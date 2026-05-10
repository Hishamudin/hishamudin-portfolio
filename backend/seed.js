require('dotenv').config();
const mongoose = require('mongoose');
const {
  User, Project, HeroProfile, About, Skill, Experience, Education,
  Certification, Resume, SocialLink, ContactInfo, Achievement, TechStack,
  Testimonial, SiteSetting
} = require('./models');

const owner = {
  name: 'Hishamudin Hussain',
  title: 'Aspiring Software Engineer | Full Stack Developer | Data Analytics Enthusiast',
  summary: 'Aspiring Software Engineer with strong foundations in full-stack development and SQL-driven backend systems. Skilled in building scalable web applications and automating workflows. Experienced across domains including healthcare and enterprise automation. Quick learner with strong logical thinking, problem-solving, and collaborative skills, eager to contribute to high-performing software solutions.',
  location: 'Karaikal, India',
  email: process.env.ADMIN_EMAIL || 'admin@portfolio.dev',
};

const projects = [
  {
    title: 'Multi-Scale Spatio-Temporal Traffic Flow Prediction System',
    description: 'Traffic flow prediction system using Python, Flask, DBN, Pandas, and Scikit-learn to model multi-scale spatio-temporal traffic patterns.',
    detailedDescription: 'Traffic flow prediction system using Python, Flask, DBN, Pandas, and Scikit-learn to model multi-scale spatio-temporal traffic patterns.',
    shortDescription: 'Traffic flow prediction using Python, Flask, DBN, Pandas, and Scikit-learn.',
    technologies: ['Python', 'Flask', 'DBN', 'Pandas', 'Scikit-learn'],
    category: 'ai/ml',
    featured: true,
    order: 1,
  },
  {
    title: 'MediTrack System',
    description: 'Healthcare-focused system built with PHP, MySQL, HTML, CSS, and XAMPP for managing medical tracking workflows.',
    detailedDescription: 'Healthcare-focused system built with PHP, MySQL, HTML, CSS, and XAMPP for managing medical tracking workflows.',
    shortDescription: 'Healthcare workflow system built with PHP, MySQL, HTML, CSS, and XAMPP.',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'XAMPP'],
    category: 'fullstack',
    featured: true,
    order: 2,
  },
  {
    title: 'Water Quality Prediction System',
    description: 'Machine learning project that predicts water quality using Python, exploratory data analysis, feature engineering, Pandas, Matplotlib, and Seaborn.',
    detailedDescription: 'Machine learning project that predicts water quality using Python, exploratory data analysis, feature engineering, Pandas, Matplotlib, and Seaborn.',
    shortDescription: 'ML-powered water quality prediction with Python and EDA workflows.',
    technologies: ['Python', 'Machine Learning', 'Pandas', 'Matplotlib', 'Seaborn'],
    category: 'ai/ml',
    order: 3,
  },
  {
    title: 'Advanced Email ID Requisition System',
    description: 'Workflow automation platform built during the ONGC internship using PHP, SQL, and JavaScript, including PDF generation and email automation.',
    detailedDescription: 'Workflow automation platform built during the ONGC internship using PHP, SQL, and JavaScript, including PDF generation and email automation.',
    shortDescription: 'Email requisition workflow automation with PHP, SQL, and JavaScript.',
    technologies: ['PHP', 'SQL', 'JavaScript', 'PDF Generation', 'Email Automation'],
    category: 'fullstack',
    order: 4,
  },
];

const skills = [
  ...['Python', 'Java', 'JavaScript', 'HTML5', 'CSS3', 'SQL', 'PHP'].map((name, i) => ({ category: 'Languages', name, level: [88, 78, 84, 90, 88, 86, 80][i], order: i + 1 })),
  ...['React JS', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn'].map((name, i) => ({ category: 'Libraries', name, level: [82, 86, 82, 78, 78, 76][i], order: i + 1 })),
  ...['GitHub', 'VS Code', 'Google Colab', 'XAMPP', 'MySQL'].map((name, i) => ({ category: 'Tools', name, level: [86, 90, 82, 80, 84][i], order: i + 1 })),
];

const techStack = ['React JS', 'Node.js', 'Express', 'MongoDB', 'Python', 'JavaScript', 'SQL', 'PHP', 'MySQL', 'Pandas', 'Scikit-learn', 'GitHub']
  .map((name, i) => ({ name, category: i < 4 ? 'MERN' : 'Core', symbol: name.slice(0, 2).toUpperCase(), order: i + 1 }));

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    await Promise.all([
      Project.deleteMany({}), HeroProfile.deleteMany({}), About.deleteMany({}), Skill.deleteMany({}),
      Experience.deleteMany({}), Education.deleteMany({}), Certification.deleteMany({}), Resume.deleteMany({}),
      SocialLink.deleteMany({}), ContactInfo.deleteMany({}), Achievement.deleteMany({}), TechStack.deleteMany({}),
      Testimonial.deleteMany({}), SiteSetting.deleteMany({}),
    ]);

    await HeroProfile.create({
      singleton: 'main',
      name: owner.name,
      title: owner.title,
      summary: owner.summary,
      location: owner.location,
      availability: 'Open to internships, entry-level roles, and collaborations',
      typingRoles: ['Full Stack Developer', 'Software Engineer', 'Data Analytics Enthusiast', 'Backend Systems Learner'],
      resumeUrl: '/resume.pdf',
    });

    await About.create({
      singleton: 'main',
      heading: 'About Me',
      body: owner.summary,
      highlights: ['Full-stack development', 'SQL-driven backend systems', 'Workflow automation', 'Data analytics and ML foundations'],
      stats: [
        { label: 'CGPA', value: 7.9 },
        { label: 'Projects', value: 4 },
        { label: 'Internships', value: 2 },
        { label: 'Skill Areas', value: 18 },
      ],
    });

    await Education.create({
      institution: 'B.S. Abdur Rahman Crescent Institute of Science and Technology',
      degree: 'B.Tech in Information Technology',
      period: '2022-2026',
      grade: 'CGPA: 7.9',
      order: 1,
    });

    await Experience.insertMany([
      {
        type: 'work',
        title: 'AICTE EDUNET SHELL Virtual Internship',
        role: 'Intern',
        company: 'AICTE EDUNET SHELL',
        period: 'June 2025 - July 2025',
        bullets: ['Built Water Quality Prediction System using Python and ML', 'Performed EDA and feature engineering', 'Used Pandas, Matplotlib, and Seaborn'],
        tags: ['Python', 'Machine Learning', 'Pandas', 'EDA'],
        order: 1,
      },
      {
        type: 'work',
        title: 'ONGC Full Stack Web Development Internship',
        role: 'Intern',
        company: 'ONGC',
        period: 'July 2024',
        bullets: ['Built Advanced Email ID Requisition System', 'Automated workflow using PHP and SQL', 'Added PDF generation and email automation', 'Reduced manual work by 80%'],
        tags: ['PHP', 'SQL', 'JavaScript', 'Automation'],
        order: 2,
      },
    ]);

    await Promise.all([
      Project.insertMany(projects),
      Skill.insertMany(skills),
      TechStack.insertMany(techStack),
      Certification.insertMany([
        { title: 'AI for All', issuer: 'Hatch Academy', order: 1 },
        { title: 'Google Data Analytics', issuer: 'Google', order: 2 },
        { title: 'Infosys Springboard Python Foundation', issuer: 'Infosys Springboard', order: 3 },
      ]),
      Resume.create({ singleton: 'main', title: `${owner.name} Resume`, fileUrl: '/resume.pdf', version: '2026' }),
      ContactInfo.create({
        singleton: 'main',
        email: owner.email,
        location: owner.location,
        headline: 'Get in touch',
        description: 'Open to internships, entry-level software roles, data analytics opportunities, and meaningful collaborations.',
      }),
      SiteSetting.create({
        singleton: 'main',
        siteTitle: `${owner.name} | Developer Portfolio`,
        ownerName: owner.name,
        contactEmail: owner.email,
        resumeUrl: '/resume.pdf',
        seoTitle: `${owner.name} - Full Stack Developer Portfolio`,
        seoDescription: owner.summary,
      }),
      SocialLink.insertMany([
        { platform: 'github', label: 'GitHub', url: 'https://github.com/', order: 1 },
        { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/', order: 2 },
        { platform: 'email', label: 'Email', url: `mailto:${owner.email}`, order: 3 },
      ]),
      Achievement.insertMany([
        { title: 'Reduced manual email requisition work by 80%', description: 'Automated PDF generation and email workflow during ONGC internship.', order: 1 },
      ]),
    ]);

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        email: owner.email,
        password: 'admin123456',
        role: 'admin',
      });
      console.log(`Created admin user: ${owner.email} / admin123456`);
    }

    console.log('CMS seed complete');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
