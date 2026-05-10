const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  HeroProfile, About, Skill, Experience, Education, Certification, Resume,
  SocialLink, ContactInfo, Achievement, TechStack, Testimonial, SiteSetting,
  Project, Message
} = require('../models');

const router = express.Router();

const sortByOrder = { order: 1, createdAt: -1 };

const sections = {
  projects: Project,
  skills: Skill,
  experience: Experience,
  education: Education,
  certifications: Certification,
  socialLinks: SocialLink,
  achievements: Achievement,
  techStack: TechStack,
  testimonials: Testimonial,
};

const singletonSections = {
  hero: HeroProfile,
  about: About,
  resume: Resume,
  contactInfo: ContactInfo,
  settings: SiteSetting,
};

async function publicPayload() {
  const [
    hero, about, resume, contactInfo, settings, skills, experience, education,
    certifications, socialLinks, achievements, techStack, testimonials, projects
  ] = await Promise.all([
    HeroProfile.findOne({ singleton: 'main' }),
    About.findOne({ singleton: 'main' }),
    Resume.findOne({ singleton: 'main' }),
    ContactInfo.findOne({ singleton: 'main' }),
    SiteSetting.findOne({ singleton: 'main' }),
    Skill.find().sort(sortByOrder),
    Experience.find().sort(sortByOrder),
    Education.find().sort(sortByOrder),
    Certification.find().sort(sortByOrder),
    SocialLink.find({ visible: true }).sort(sortByOrder),
    Achievement.find().sort(sortByOrder),
    TechStack.find().sort(sortByOrder),
    Testimonial.find({ visible: true }).sort(sortByOrder),
    Project.find({ status: { $ne: 'archived' } }).sort({ featured: -1, order: 1, createdAt: -1 }),
  ]);

  return {
    hero,
    about,
    resume,
    contactInfo,
    settings,
    skills,
    experience,
    education,
    certifications,
    socialLinks,
    achievements,
    techStack,
    testimonials,
    projects,
  };
}

router.get('/public', async (req, res) => {
  try {
    res.json(await publicPayload());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const [projects, skills, experience, messages, unread] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
    ]);
    res.json({ projects, skills, experience, messages, unread });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:section', protect, adminOnly, async (req, res) => {
  try {
    const { section } = req.params;
    if (singletonSections[section]) {
      const item = await singletonSections[section].findOne({ singleton: 'main' });
      return res.json({ item });
    }
    if (!sections[section]) return res.status(404).json({ error: 'Unknown CMS section' });
    const items = await sections[section].find().sort(sortByOrder);
    res.json({ items, total: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:section', protect, adminOnly, async (req, res) => {
  try {
    const Model = singletonSections[req.params.section];
    if (!Model) return res.status(404).json({ error: 'Unknown singleton section' });
    const item = await Model.findOneAndUpdate(
      { singleton: 'main' },
      { ...req.body, singleton: 'main' },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:section', protect, adminOnly, async (req, res) => {
  try {
    const Model = sections[req.params.section];
    if (!Model) return res.status(404).json({ error: 'Unknown list section' });
    const item = await Model.create(req.body);
    res.status(201).json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:section/:id', protect, adminOnly, async (req, res) => {
  try {
    const Model = sections[req.params.section];
    if (!Model) return res.status(404).json({ error: 'Unknown list section' });
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:section/:id', protect, adminOnly, async (req, res) => {
  try {
    const Model = sections[req.params.section];
    if (!Model) return res.status(404).json({ error: 'Unknown list section' });
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
