import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// Component xử lý đăng nhập/đăng ký
function Auth() {
  const [isLogin, setIsLogin] = useState(true); // true: đăng nhập, false: đăng ký
  const [email, setEmail] = useState(''); // Email người dùng
  const [password, setPassword] = useState(''); // Mật khẩu
  const [username, setUsername] = useState('');
  const [error, setError] = useState(''); // Thông báo lỗi
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Đăng nhập - chỉ cần email và password
        await signInWithEmailAndPassword(getAuth(), email, password);
      } else {
        // Đăng ký - cần thêm username
        if (!username.trim()) {
          setError('Vui lòng nhập tên người dùng');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
        // Tạo document user với username
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username: username.trim(),
          favorites: []
        });
      }
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Tên người dùng</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên người dùng"
                      required
                    />
                  </div>
                )}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                </button>
              </form>
              <div className="text-center mt-3">
                <button
                  className="btn btn-link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setUsername('');
                  }}
                >
                  {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth; 