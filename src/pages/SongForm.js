import React, { useState, useEffect } from 'react';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';

// Form thêm/sửa bài hát
function SongForm({ onSave, song, onCancel, user }) {
  const [title, setTitle] = useState(''); // Tiêu đề bài hát
  const [artist, setArtist] = useState(''); // Tên ca sĩ
  const [chords, setChords] = useState(''); // Lời và hợp âm
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id: songId } = useParams(); // Lấy ID từ URL nếu đang edit

  // Khi nhận prop song mới, cập nhật state
  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist);
      setChords(song.chords);
    } else {
      setTitle('');
      setArtist('');
      setChords('');
    }
  }, [song]);

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const songData = {
        title,
        artist,
        chords,
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        createdAt: new Date(),
        views: 0,
        status: 'pending'
      };

      if (songId) {
        // Cập nhật bài hát
        await updateDoc(doc(db, 'songs', songId), songData);
      } else {
        // Tạo bài hát mới
        await addDoc(collection(db, 'songs'), songData);
      }
      navigate('/songs');
    } catch (error) {
      setError('Lỗi khi lưu bài hát: ' + error.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body">
            {/* Tiêu đề form */}
            <h2 className="mb-4">{song ? 'Sửa bài hát' : 'Thêm bài hát mới'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {/* Form nhập thông tin bài hát */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tiêu đề bài hát:</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Ca sĩ:</label>
                <input value={artist} onChange={e => setArtist(e.target.value)} required className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Hợp âm & lời:</label>
                <textarea value={chords} onChange={e => setChords(e.target.value)} required rows={8} className="form-control" />
              </div>
              {/* Nút lưu và hủy */}
              <button type="submit" className="btn btn-success me-2">{song ? 'Lưu' : 'Thêm'}</button>
              {onCancel && <button type="button" onClick={onCancel} className="btn btn-secondary">Huỷ</button>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongForm; 