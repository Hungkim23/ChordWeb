// Khi tạo bài hát mới
exports.createSong = async (req, res) => {
  try {
    const { title, artist, chords } = req.body;
    const userId = req.user.id;
    
    // Kiểm tra xem người dùng có phải admin không
    const user = await User.findById(userId);
    const isAdmin = user && user.role === 'admin';
    
    const song = new Song({
      title,
      artist,
      chords,
      userId,
      isApproved: isAdmin, // Tự động duyệt nếu là admin
      isAdminPost: isAdmin
    });
    
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API để admin duyệt bài hát
exports.approveSong = async (req, res) => {
  try {
    const { songId } = req.params;
    const song = await Song.findById(songId);
    
    if (!song) {
      return res.status(404).json({ message: 'Không tìm thấy bài hát' });
    }
    
    song.isApproved = true;
    await song.save();
    
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách bài hát (chỉ hiển thị bài đã duyệt)
exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find({ isApproved: true });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách bài hát chờ duyệt (chỉ admin)
exports.getPendingSongs = async (req, res) => {
  try {
    const songs = await Song.find({ isApproved: false, isAdminPost: false });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 