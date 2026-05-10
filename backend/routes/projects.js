const express = require('express');
const { body, validationResult } = require('express-validator');
const { Project } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects — public
router.get('/', async (req, res) => {
  try {
    const { category, featured, status = 'completed' } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (status !== 'all') filter.status = status;

    const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
    res.json({ projects, total: projects.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/projects/:id — public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects — admin only
router.post('/',
  protect, adminOnly,
  [
    body('title').trim().notEmpty().withMessage('Title required'),
    body('description').notEmpty().withMessage('Description required'),
    body('category').isIn(['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'ai/ml', 'data', 'other'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const project = await Project.create(req.body);
      res.status(201).json({ project });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// PUT /api/projects/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/projects/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
