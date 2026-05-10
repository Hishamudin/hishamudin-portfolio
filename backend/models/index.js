const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const timestamps = { timestamps: true };

const stringArray = [{ type: String, trim: true }];

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
}, timestamps);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 180 },
  detailedDescription: { type: String },
  technologies: stringArray,
  image: { type: String, trim: true },
  githubUrl: { type: String, trim: true },
  liveDemoUrl: { type: String, trim: true },
  techStack: stringArray,
  category: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'ai/ml', 'data', 'other'],
    default: 'fullstack'
  },
  githubLink: { type: String, trim: true },
  liveDemo: { type: String, trim: true },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
  order: { type: Number, default: 0 },
}, timestamps);

function normalizeProjectFields(data) {
  if (!data) return data;
  if (data.technologies && !data.techStack) data.techStack = data.technologies;
  if (data.techStack && !data.technologies) data.technologies = data.techStack;
  if (data.githubUrl && !data.githubLink) data.githubLink = data.githubUrl;
  if (data.githubLink && !data.githubUrl) data.githubUrl = data.githubLink;
  if (data.liveDemoUrl && !data.liveDemo) data.liveDemo = data.liveDemoUrl;
  if (data.liveDemo && !data.liveDemoUrl) data.liveDemoUrl = data.liveDemo;
  if (data.image && !data.images) data.images = [data.image].filter(Boolean);
  if (Array.isArray(data.images) && data.images[0] && !data.image) data.image = data.images[0];
  data.githubUrl = normalizeExternalUrl(data.githubUrl);
  data.githubLink = normalizeExternalUrl(data.githubLink || data.githubUrl);
  data.liveDemoUrl = normalizeExternalUrl(data.liveDemoUrl);
  data.liveDemo = normalizeExternalUrl(data.liveDemo || data.liveDemoUrl);
  return data;
}

function normalizeExternalUrl(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    const validHost = parsed.hostname.includes('.') || parsed.hostname === 'localhost';
    if (!['http:', 'https:'].includes(parsed.protocol) || !validHost) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

projectSchema.pre('validate', function (next) {
  normalizeProjectFields(this);
  next();
});

projectSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update?.$set) normalizeProjectFields(update.$set);
  else normalizeProjectFields(update);
  next();
});

const heroProfileSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true },
  location: { type: String, trim: true },
  availability: { type: String, default: 'Open to opportunities' },
  profileImage: { type: String, trim: true },
  resumeUrl: { type: String, trim: true },
  typingRoles: stringArray,
  ctaPrimary: { type: String, default: 'View My Work' },
  ctaSecondary: { type: String, default: 'Download Resume' },
}, timestamps);

const aboutSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  heading: { type: String, default: 'About Me' },
  body: { type: String, required: true },
  highlights: stringArray,
  stats: [{
    label: { type: String, trim: true },
    value: { type: Number, default: 0 },
  }],
}, timestamps);

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  level: { type: Number, min: 0, max: 100, default: 80 },
  icon: { type: String, trim: true },
  order: { type: Number, default: 0 },
}, timestamps);

const experienceSchema = new mongoose.Schema({
  type: { type: String, enum: ['work', 'education'], default: 'work' },
  title: { type: String, required: true, trim: true },
  role: { type: String, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  period: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  bullets: stringArray,
  tags: stringArray,
  order: { type: Number, default: 0 },
}, timestamps);

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  period: { type: String, required: true, trim: true },
  grade: { type: String, trim: true },
  location: { type: String, trim: true },
  details: stringArray,
  order: { type: Number, default: 0 },
}, timestamps);

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, trim: true },
  date: { type: String, trim: true },
  credentialUrl: { type: String, trim: true },
  order: { type: Number, default: 0 },
}, timestamps);

const resumeSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  title: { type: String, default: 'Resume' },
  fileUrl: { type: String, trim: true },
  version: { type: String, trim: true },
}, timestamps);

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  icon: { type: String, trim: true },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
}, timestamps);

const contactInfoSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  headline: { type: String, default: 'Get in touch' },
  description: { type: String, trim: true },
}, timestamps);

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  date: { type: String, trim: true },
  order: { type: Number, default: 0 },
}, timestamps);

const techStackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  color: { type: String, trim: true },
  symbol: { type: String, trim: true },
  order: { type: Number, default: 0 },
}, timestamps);

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, trim: true },
  company: { type: String, trim: true },
  quote: { type: String, required: true },
  avatar: { type: String, trim: true },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, timestamps);

const siteSettingSchema = new mongoose.Schema({
  singleton: { type: String, default: 'main', unique: true },
  siteTitle: { type: String, required: true, trim: true },
  ownerName: { type: String, required: true, trim: true },
  contactEmail: { type: String, required: true, lowercase: true, trim: true },
  resumeUrl: { type: String, trim: true },
  seoTitle: { type: String, trim: true },
  seoDescription: { type: String, trim: true },
  ogImage: { type: String, trim: true },
}, timestamps);

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, trim: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
}, timestamps);

module.exports = {
  User: mongoose.model('User', userSchema),
  Project: mongoose.model('Project', projectSchema),
  Message: mongoose.model('Message', messageSchema),
  HeroProfile: mongoose.model('HeroProfile', heroProfileSchema),
  About: mongoose.model('About', aboutSchema),
  Skill: mongoose.model('Skill', skillSchema),
  Experience: mongoose.model('Experience', experienceSchema),
  Education: mongoose.model('Education', educationSchema),
  Certification: mongoose.model('Certification', certificationSchema),
  Resume: mongoose.model('Resume', resumeSchema),
  SocialLink: mongoose.model('SocialLink', socialLinkSchema),
  ContactInfo: mongoose.model('ContactInfo', contactInfoSchema),
  Achievement: mongoose.model('Achievement', achievementSchema),
  TechStack: mongoose.model('TechStack', techStackSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  SiteSetting: mongoose.model('SiteSetting', siteSettingSchema),
};
