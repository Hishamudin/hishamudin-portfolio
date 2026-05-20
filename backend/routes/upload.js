const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/* ===========================
   IMAGE STORAGE
=========================== */

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'portfolio/images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  })
});

/* ===========================
   PDF / RESUME STORAGE
=========================== */

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'portfolio/resume',
    resource_type: 'raw',
    public_id: `resume-${Date.now()}`
  })
});

/* ===========================
   MULTER CONFIG
=========================== */

const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const uploadPdf = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      return cb(null, true);
    }

    cb(new Error('Only PDF files are allowed'));
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

/* ===========================
   IMAGE UPLOAD
=========================== */

router.post(
  '/image',
  protect,
  adminOnly,
  uploadImage.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    res.json({
      url: req.file.secure_url || req.file.path,
      filename: req.file.filename
    });
  }
);

/* ===========================
   MULTIPLE IMAGES
=========================== */

router.post(
  '/images',
  protect,
  adminOnly,
  uploadImage.array('images', 10),
  (req, res) => {
    if (!req.files?.length) {
      return res.status(400).json({
        error: 'No files uploaded'
      });
    }

    res.json({
      urls: req.files.map(file => ({
        url: file.secure_url || file.path,
        filename: file.filename
      }))
    });
  }
);

/* ===========================
   RESUME PDF UPLOAD
=========================== */

router.post(
  '/resume',
  protect,
  adminOnly,
  uploadPdf.single('resume'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    res.json({
      url: req.file.secure_url || req.file.path,
      filename: req.file.filename
    });
  }
);

module.exports = router;