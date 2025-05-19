import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

// Component hiển thị danh sách bài hát
function SongList({ user }) {
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lọc bài hát theo từ khóa tìm kiếm
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase())
  );

  // Kiểm tra quyền admin
  const isAdmin = user && user.uid === 'xKJ5khwgbUerfJaZZCMQbLgPwSE2';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songsRef = collection(db, 'songs');
        // Lấy tất cả bài hát (cả cũ và mới)
        const querySnapshot = await getDocs(songsRef);
        
        const songsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Lọc bài hát: hiển thị nếu là bài cũ (không có status) hoặc đã được duyệt
        .filter(song => !song.status || song.status === 'approved');
        
        setSongs(songsData);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách bài hát: ' + err.message);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleDelete = async (songId) => {
    try {
      await deleteDoc(doc(db, 'songs', songId));
      setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
    } catch (err) {
      setError('Lỗi khi xóa bài hát: ' + err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh Sách Bài Hát</h2>
        {isAdmin && (
          <Link to="/admin/songs" className="btn btn-primary">
            Quản lý bài hát chờ duyệt
          </Link>
        )}
      </div>
      
      {/* Ô tìm kiếm bài hát */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Tìm kiếm bài hát hoặc ca sĩ..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      
      <div className="row g-3">
        {/* Duyệt qua từng bài hát để hiển thị card */}
        {filteredSongs.map(song => (
          <div className="col-md-6 col-lg-4" key={song.id}>
            {/* Card bài hát, click vào sẽ chuyển sang trang chi tiết */}
            <div
              className="card h-100 shadow-sm song-card-hover"
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={e => {
                // Nếu click vào nút sửa/xóa thì không chuyển trang
                if (e.target.closest('.song-action-btn')) return;
                navigate(`/song/${song.id}`);
              }}
            >
              <div className="card-body">
                {/* Tiêu đề và tác giả */}
                <h5 className="card-title">{song.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
                <div className="text-muted small mb-2">
                  {song.views || 0} lượt xem
                </div>
                {/* Nút sửa/xóa chỉ hiện với chủ sở hữu hoặc admin */}
                {((user && user.uid === song.userId) || isAdmin) && (
                  <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                    <button
                      className="btn btn-warning btn-sm me-2 song-action-btn"
                      onClick={e => { e.stopPropagation(); navigate(`/edit/${song.id}`); }}
                    >Sửa</button>
                    <button
                      className="btn btn-danger btn-sm song-action-btn"
                      onClick={e => { e.stopPropagation(); handleDelete(song.id); }}
                    >Xóa</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Nếu không có bài hát nào */}
        {filteredSongs.length === 0 && <div className="text-center text-muted">Không tìm thấy bài hát nào.</div>}
      </div>
    </div>
  );
}

export default SongList; 