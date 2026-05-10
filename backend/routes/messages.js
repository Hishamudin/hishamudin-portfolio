const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const { Message, SiteSetting } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// POST /api/messages — public (contact form)
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 chars')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, subject, message } = req.body;
      const newMessage = await Message.create({ name, email, subject, message });
      const settings = await SiteSetting.findOne({ singleton: 'main' });
      const ownerName = settings?.ownerName || 'Portfolio Owner';

      // Send email notification
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = createTransporter();
          await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Contact: ${subject || 'Message from ' + name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366f1;">New Portfolio Message</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <hr/>
                <p style="white-space: pre-wrap;">${message}</p>
                <hr/>
                <p style="color: #888; font-size: 12px;">Received: ${new Date().toLocaleString()}</p>
              </div>
            `
          });

          // Auto-reply
          await transporter.sendMail({
            from: `"${ownerName}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Got your message, ${name}!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366f1;">Thanks for reaching out!</h2>
                <p>Hi ${name},</p>
                <p>I've received your message and will get back to you within 24-48 hours.</p>
                <p>Here's a copy of your message:</p>
                <blockquote style="border-left: 3px solid #6366f1; padding-left: 16px; color: #555;">${message}</blockquote>
                <p>Best,<br/>${ownerName}</p>
              </div>
            `
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError.message);
        }
      }

      res.status(201).json({ message: 'Message sent successfully!', id: newMessage._id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET /api/messages — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { read, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (read !== undefined) filter.read = read === 'true';

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Message.countDocuments(filter);

    res.json({ messages, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/messages/:id/read — admin only
router.patch('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: msg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/messages/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
