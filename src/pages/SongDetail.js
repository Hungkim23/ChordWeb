import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

// Component hiển thị chi tiết một bài hát
function SongDetail({ songs, onDelete, user, isFavorite, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const song = songs.find(s => String(s.id) === String(id));
  const isAdmin = user && user.uid === 'xKJ5khwgbUerfJaZZCMQbLgPwSE2';

  // Tăng lượt xem khi component mount
  useEffect(() => {
    const updateViews = async () => {
      try {
        await updateDoc(doc(db, 'songs', id), {
          views: increment(1)
        });
      } catch (error) {
        console.error('Error updating views:', error);
      }
    };
    updateViews();
  }, [id]);

  // Kiểm tra quyền xem bài hát
  if (!song) {
    return (
      <div className="alert alert-danger mt-4">Bài hát không tồn tại. <Link to="/songs">Quay lại danh sách</Link></div>
    );
  }

  if (song.status === 'rejected') {
    return (
      <div className="alert alert-danger mt-4">Bài hát này đã bị từ chối.</div>
    );
  }

  if (song.status === 'pending' && user && user.uid !== song.userId && !isAdmin) {
    return (
      <div className="alert alert-warning mt-4">Bài hát này đang chờ duyệt.</div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card">
          <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="card-title">{song.title}</h2>
              <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
            </div>
            <div>
              {user && (
                <>
                  <button
                    className={`btn ${isFavorite(song.id) ? 'btn-danger' : 'btn-outline-danger'} me-2`}
                    onClick={() => onToggleFavorite(song.id)}
                  >
                    {isFavorite(song.id) ? '❤️ Đã yêu thích' : '🤍 Yêu thích'}
                  </button>
                  {user.uid === song.userId && (
              <>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => navigate(`/edit/${song.id}`)}
                      >Sửa</button>
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(song.id)}
                      >Xóa</button>
                    </>
                  )}
              </>
            )}
            </div>
          </div>
          <div className="mt-4">
            <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {song.chords}
            </pre>
          </div>
          <div className="text-muted mt-3">
            <small>Đăng bởi: {song.username || 'Anonymous'}</small>
            <br />
            <small>Lượt xem: {song.views || 0}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongDetail; 