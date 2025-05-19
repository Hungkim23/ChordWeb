import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SongList from './pages/SongList';
import SongDetail from './pages/SongDetail';
import SongForm from './pages/SongForm';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import AdminSongManagement from './pages/AdminSongManagement';

// Component con để xử lý navigation
function AppContent() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const navigate = useNavigate();

  // Theo dõi trạng thái đăng nhập và load userData
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Load userData khi user đăng nhập
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setFavorites(data.favorites || []);
        }
      } else {
        setUserData(null);
        setFavorites([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load dữ liệu bài hát từ Firestore
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'songs'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSongs(data);
      setFilteredSongs(data);
      setLoading(false);
    };
    fetchSongs();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredSongs(songs);
      navigate('/');
    } else {
      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) || 
        song.artist.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSongs(filtered);
      navigate('/search');
    }
  };

  // Thêm bài hát mới
  const handleAddSong = async (song) => {
    if (!user) return;
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'songs'), { 
      ...song, 
      userId: user.uid,
      username: userData?.username || 'Anonymous',
      createdAt: now, 
      views: 0 
    });
    setSongs(prev => [...prev, { 
      ...song, 
      id: docRef.id, 
      userId: user.uid,
      username: userData?.username || 'Anonymous',
      createdAt: now, 
      views: 0 
    }]);
  };

  // Sửa bài hát
  const handleEditSong = async (song) => {
    await updateDoc(doc(db, 'songs', song.id), song);
    setSongs(prev => prev.map(s => s.id === song.id ? song : s));
  };

  // Xóa bài hát
  const handleDeleteSong = async (id) => {
    await deleteDoc(doc(db, 'songs', id));
    setSongs(prev => prev.filter(s => s.id !== id));
  };

  // Thêm/xóa bài hát khỏi danh sách yêu thích
  const toggleFavorite = async (songId) => {
    if (!user) return;
    
    const newFavorites = favorites.includes(songId)
      ? favorites.filter(id => id !== songId)
      : [...favorites, songId];
    
    await updateDoc(doc(db, 'users', user.uid), { favorites: newFavorites });
    setFavorites(newFavorites);
  };

  // Kiểm tra xem bài hát có trong danh sách yêu thích không
  const isFavorite = (songId) => favorites.includes(songId);

  // Đăng xuất
  const handleLogout = async () => {
    await signOut(getAuth());
  };

  // Trang thêm bài hát
  function AddSongPage() {
    return <SongForm onSave={async song => { await handleAddSong(song); navigate('/songs'); }} onCancel={() => navigate('/songs')} user={user} />;
  }

  // Trang sửa bài hát
  function EditSongPage() {
    const { pathname } = useLocation();
    const id = pathname.split('/').pop();
    const song = songs.find(s => String(s.id) === String(id));
    return <SongForm song={song} onSave={async s => { await handleEditSong({ ...s, id }); navigate('/songs'); }} onCancel={() => navigate('/songs')} user={user} />;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to="/">Hợp Âm Chuẩn</Link>
          <div className="d-flex align-items-center flex-grow-1 mx-4">
            <input
              type="search"
              className="form-control"
              placeholder="Tìm kiếm bài hát..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div>
            <Link className="btn btn-success ms-2" to="/songs">Danh sách bài hát</Link>
            {user && <Link className="btn btn-success ms-2" to="/add">+ Thêm bài hát</Link>}
            {!user && <Link className="btn btn-outline-primary ms-2" to="/auth">Đăng nhập</Link>}
            {user && <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>Đăng xuất</button>}
            {user && <Link className="btn btn-link ms-2" to="/profile">Trang cá nhân</Link>}
          </div>
        </div>
      </nav>
      <div className="container" style={{ marginTop: '80px' }}>
        {loading ? <div className="text-center my-5">Đang tải dữ liệu...</div> : (
          <Routes>
            <Route path="/" element={<Home songs={songs} user={user} />} />
            <Route path="/songs" element={<SongList user={user} />} />
            <Route path="/song/:id" element={<SongDetail songs={songs} onDelete={handleDeleteSong} user={user} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />} />
            <Route path="/add" element={user ? <AddSongPage /> : <Auth />} />
            <Route path="/edit/:id" element={user ? <EditSongPage /> : <Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Auth />} />
            <Route path="/search" element={<SearchResults songs={filteredSongs} user={user} onDelete={handleDeleteSong} />} />
            <Route path="/admin/songs" element={<AdminSongManagement user={user} />} />
          </Routes>
        )}
      </div>
    </>
  );
}

// Component gốc của ứng dụng
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 