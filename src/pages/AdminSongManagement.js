import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

function AdminSongManagement({ user }) {
  const [pendingSongs, setPendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Kiểm tra quyền admin
  const isAdmin = user && user.uid === 'xKJ5khwgbUerfJaZZCMQbLgPwSE2';

  useEffect(() => {
    if (!isAdmin) {
      setError('Bạn không có quyền truy cập trang này');
      setLoading(false);
      return;
    }

    const fetchPendingSongs = async () => {
      try {
        const songsRef = collection(db, 'songs');
        const q = query(songsRef, where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        
        const songs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPendingSongs(songs);
        setLoading(false);
      } catch (err) {
        setError('Lỗi khi tải danh sách bài hát: ' + err.message);
        setLoading(false);
      }
    };

    fetchPendingSongs();
  }, [isAdmin]);

  const handleApprove = async (songId) => {
    try {
      await updateDoc(doc(db, 'songs', songId), {
        status: 'approved'
      });
      setPendingSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
    } catch (err) {
      setError('Lỗi khi duyệt bài hát: ' + err.message);
    }
  };

  const handleReject = async (songId, adminNote) => {
    try {
      await updateDoc(doc(db, 'songs', songId), {
        status: 'rejected',
        adminNote
      });
      setPendingSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
    } catch (err) {
      setError('Lỗi khi từ chối bài hát: ' + err.message);
    }
  };

  const handleApproveAll = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt tất cả bài hát đang chờ duyệt?')) {
      return;
    }

    setProcessing(true);
    try {
      const batch = [];
      for (const song of pendingSongs) {
        batch.push(updateDoc(doc(db, 'songs', song.id), {
          status: 'approved'
        }));
      }
      await Promise.all(batch);
      setPendingSongs([]);
    } catch (err) {
      setError('Lỗi khi duyệt tất cả bài hát: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAdmin) {
    return <div className="alert alert-danger mt-4">Bạn không có quyền truy cập trang này</div>;
  }

  if (loading) {
    return <div className="text-center mt-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý bài hát chờ duyệt</h2>
        {pendingSongs.length > 0 && (
          <button 
            className="btn btn-success"
            onClick={handleApproveAll}
            disabled={processing}
          >
            {processing ? 'Đang xử lý...' : 'Duyệt tất cả'}
          </button>
        )}
      </div>
      
      {pendingSongs.length === 0 ? (
        <div className="alert alert-info">Không có bài hát nào đang chờ duyệt</div>
      ) : (
        <div className="row">
          {pendingSongs.map(song => (
            <div key={song.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{song.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{song.artist}</h6>
                  <p className="card-text">
                    <small>Đăng bởi: {song.username || 'Anonymous'}</small>
                  </p>
                  <div className="mt-3">
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleApprove(song.id)}
                    >
                      Duyệt
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        const note = window.prompt('Nhập lý do từ chối:');
                        if (note) {
                          handleReject(song.id, note);
                        }
                      }}
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminSongManagement; 