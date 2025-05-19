import React from 'react';
import { useNavigate } from 'react-router-dom';

function SearchResults({ songs, user, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <h2 className="mb-4">Kết quả tìm kiếm</h2>
      {songs.length === 0 ? (
        <div className="alert alert-info">
          Không tìm thấy bài hát nào phù hợp với từ khóa tìm kiếm.
        </div>
      ) : (
        <div className="row g-3">
          {songs.map(song => (
            <div className="col-md-6 col-lg-4" key={song.id}>
              <div
                className="card h-100 shadow-sm song-card-hover"
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={e => {
                  if (e.target.closest('.song-action-btn')) return;
                  navigate(`/song/${song.id}`);
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">{song.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
                  <div className="text-muted" style={{ fontSize: 13 }}>{song.views || 0} lượt xem</div>
                  {user && user.uid === song.userId && (
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                      <button
                        className="btn btn-warning btn-sm me-2 song-action-btn"
                        onClick={e => { e.stopPropagation(); navigate(`/edit/${song.id}`); }}
                      >Sửa</button>
                      <button
                        className="btn btn-danger btn-sm song-action-btn"
                        onClick={e => { e.stopPropagation(); onDelete(song.id); }}
                      >Xóa</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults; 