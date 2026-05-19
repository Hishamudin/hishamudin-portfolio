const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'portfolio/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    resource_type: 'image',
  }),
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'portfolio/resume',
    resource_type: 'auto',
    allowed_formats: ['pdf'],
    format: 'pdf',
  }),
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/image', protect, adminOnly, uploadImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    url: req.file.secure_url || req.file.path,
    filename: req.file.filename,
  });
});

router.post('/images', protect, adminOnly, uploadImage.array('images', 10), (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  res.json({
    urls: req.files.map((file) => ({
      url: file.secure_url || file.path,
      filename: file.filename,
    })),
  });
});

router.post('/resume', protect, adminOnly, uploadPdf.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    url: req.file.secure_url || req.file.path,
    filename: req.file.filename,
  });
});

module.exports = router;
