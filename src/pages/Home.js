import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Trang chủ hiển thị top 10 bài hát nổi bật
function Home({ songs, user }) {
  const navigate = useNavigate();

  // Lấy top 10 bài hát có views cao nhất (không lọc theo tuần)
  const topSongs = useMemo(() => {
    return songs
      .slice() // copy mảng để không ảnh hưởng mảng gốc
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
  }, [songs]);

  // Kiểm tra quyền admin
  const isAdmin = user && user.uid === 'xKJ5khwgbUerfJaZZCMQbLgPwSE2';

  // Hàm lấy 4 dòng đầu tiên của phần lời bài hát để xem trước
  const getPreviewLines = (chords, songId) => {
    // Log kiểm tra dữ liệu chords
    console.log('songId:', songId, 'chords:', chords);
    if (!chords) return '';
    const lines = chords.split(/\r?\n/).filter(line => line.trim() !== '');
    return lines.slice(0, 4).join('\n');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Top 10 bài hát nổi bật</h1>
      <div className="row g-3 mt-4">
        {/* Duyệt qua từng bài hát top để hiển thị card */}
        {topSongs.map(song => (
          <div className="col-md-6 col-lg-4" key={song.id}>
            {/* Card bài hát, click vào sẽ chuyển sang trang chi tiết */}
            <div
              className="card h-100 shadow-sm song-card-hover"
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={e => {
                if (e.target.closest('.song-action-btn')) return;
                navigate(`/song/${song.id}`);
              }}
            >
              <div className="card-body">
                {/* Tiêu đề và tác giả */}
                <h5 className="card-title">{song.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
                {/* Xem trước 4 dòng đầu của lời/chords */}
                <pre style={{ fontSize: '0.85em', color: '#555', marginBottom: 8, marginTop: 8, whiteSpace: 'pre-line' }}>
                  {getPreviewLines(song.chords, song.id)}
                </pre>
                {/* Hiển thị số lượt xem */}
                <div className="text-muted" style={{ fontSize: 13 }}>
                  {song.views || 0} lượt xem
                </div>
                {/* Nút sửa/xóa chỉ hiện với chủ sở hữu hoặc admin */}
                {((user && user.uid === song.userId) || isAdmin) && (
                  <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 2 }}>
                    <button
                      className="btn btn-warning btn-sm me-2 song-action-btn"
                      onClick={e => { e.stopPropagation(); navigate(`/edit/${song.id}`); }}
                    >Sửa</button>
                    <button
                      className="btn btn-danger btn-sm song-action-btn"
                      onClick={e => { e.stopPropagation(); /* Xóa không khả dụng ở Home, hoặc truyền prop nếu muốn */ }}
                      disabled
                    >Xóa</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Nếu không có bài hát nào */}
        {topSongs.length === 0 && <div className="text-center text-muted">Chưa có bài hát nào.</div>}
      </div>
    </div>
  );
}

export default Home; 