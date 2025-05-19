import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Trang profile hiển thị các bài hát do user đăng tải
function Profile({ user }) {
  const [userSongs, setUserSongs] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy thông tin người dùng
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        // Lấy danh sách bài hát của người dùng
        const songsRef = collection(db, 'songs');
        const q = query(songsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const songs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Lấy danh sách bài hát yêu thích
        const favoriteSongsData = [];
        if (userData && userData.favorites) {
          for (const songId of userData.favorites) {
            const songDoc = await getDoc(doc(db, 'songs', songId));
            if (songDoc.exists()) {
              const songData = songDoc.data();
              // Chỉ hiển thị bài hát đã được duyệt hoặc không có trạng thái
              if (!songData.status || songData.status === 'approved') {
                favoriteSongsData.push({
                  id: songId,
                  ...songData
                });
              }
            }
          }
        }

        setUserSongs(songs);
        setFavoriteSongs(favoriteSongsData);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu: ' + err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center mt-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  // Phân loại bài hát theo trạng thái
  const approvedSongs = userSongs.filter(song => !song.status || song.status === 'approved');
  const pendingSongs = userSongs.filter(song => song.status === 'pending');
  const rejectedSongs = userSongs.filter(song => song.status === 'rejected');

  return (
    <div className="container py-4">
      <h2 className="mb-4">Trang cá nhân</h2>
      
      {/* Thông tin người dùng */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{user.displayName || 'Người dùng'}</h5>
          <p className="card-text">Email: {user.email}</p>
        </div>
      </div>

      {/* Bài hát đã được duyệt */}
      <div className="mb-4">
        <h3>Bài hát đã được duyệt ({approvedSongs.length})</h3>
        <div className="row g-3">
          {approvedSongs.map(song => (
            <div key={song.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{song.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/song/${song.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
          {approvedSongs.length === 0 && (
            <div className="col-12">
              <p className="text-muted">Chưa có bài hát nào được duyệt.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bài hát đang chờ duyệt */}
      <div className="mb-4">
        <h3>Bài hát đang chờ duyệt ({pendingSongs.length})</h3>
        <div className="row g-3">
          {pendingSongs.map(song => (
            <div key={song.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{song.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
                  <div className="badge bg-warning text-dark mb-2">Đang chờ duyệt</div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/song/${song.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
          {pendingSongs.length === 0 && (
            <div className="col-12">
              <p className="text-muted">Không có bài hát nào đang chờ duyệt.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bài hát bị từ chối */}
      {rejectedSongs.length > 0 && (
        <div className="mb-4">
          <h3>Bài hát bị từ chối ({rejectedSongs.length})</h3>
          <div className="row g-3">
            {rejectedSongs.map(song => (
              <div key={song.id} className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{song.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
                    <div className="badge bg-danger text-white mb-2">Bị từ chối</div>
                    {song.adminNote && (
                      <p className="text-muted small">Lý do: {song.adminNote}</p>
                    )}
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/song/${song.id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bài hát yêu thích */}
      <div className="mb-4">
        <h3>Bài hát yêu thích ({favoriteSongs.length})</h3>
        <div className="row g-3">
          {favoriteSongs.map(song => (
            <div key={song.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{song.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/song/${song.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
          {favoriteSongs.length === 0 && (
            <div className="col-12">
              <p className="text-muted">Chưa có bài hát yêu thích nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 