import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let token;
            if (isLogin) {
                // Login
                const response = await authAPI.login(email, password);
                token = response.access_token;
            } else {
                // Signup
                if (name.trim().length < 1) {
                    setError('Lütfen adınızı girin');
                    setLoading(false);
                    return;
                }
                if (password.length < 8) {
                    setError('Şifre en az 8 karakter olmalıdır');
                    setLoading(false);
                    return;
                }

                const response = await authAPI.signup(email, password, name);
                token = response.access_token;
            }

            // Set token first so it's available for the next API call
            localStorage.setItem('foodtime_token', token);

            // Fetch full user data
            const userData = await authAPI.getMe();

            // Now call login with both token and user data
            login(token, userData);

        } catch (err) {
            console.error('Auth error:', err);
            if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else if (isLogin) {
                setError('Giriş başarısız. Email veya şifre hatalı.');
            } else {
                setError('Kayıt başarısız. Lütfen tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-logo">FOOD TIME</h1>
                <p className="auth-tagline">Kalori alma, Beslen.</p>

                <div className="auth-card">
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => {
                                setIsLogin(true);
                                setError('');
                            }}
                        >
                            Giriş Yap
                        </button>
                        <button
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => {
                                setIsLogin(false);
                                setError('');
                            }}
                        >
                            Kayıt Ol
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label>Ad Soyad</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Adınızı girin"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isLogin ? 'Şifrenizi girin' : 'En az 8 karakter'}
                                required
                                minLength={isLogin ? undefined : 8}
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Lütfen bekleyin...' : isLogin ? 'GİRİŞ YAP' : 'KAYIT OL'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
