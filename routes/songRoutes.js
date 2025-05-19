const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// ... existing routes ...

// Route để admin duyệt bài hát
router.post('/:songId/approve', adminAuth, songController.approveSong);

// Route để lấy danh sách bài hát chờ duyệt
router.get('/pending', adminAuth, songController.getPendingSongs);

module.exports = router; 