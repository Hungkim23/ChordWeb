const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const songController = require('../controllers/songController');

// Trang quản lý bài hát chờ duyệt
router.get('/pending-songs', adminAuth, async (req, res) => {
  try {
    const pendingSongs = await Song.find({ isApproved: false, isAdminPost: false });
    res.render('admin/pending-songs', { songs: pendingSongs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 