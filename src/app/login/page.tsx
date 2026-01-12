'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/sanctuary/space');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: ${isDark
            ? 'linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)'
            : 'linear-gradient(180deg, #f8f6f2 0%, #f0ebe3 50%, #e8e2d8 100%)'};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
        }

        .logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
        }

        .logo-tagline {
          font-size: 0.9rem;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
          margin-top: 8px;
        }

        .form-card {
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
          border-radius: 24px;
          padding: 36px 32px;
          margin-bottom: 24px;
          backdrop-filter: blur(20px);
        }

        .form-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
          margin-bottom: 28px;
          text-align: center;
        }

        .input-group {
          margin-bottom: 18px;
        }

        .input-label {
          display: block;
          font-size: 0.8rem;
          color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)'};
          margin-bottom: 8px;
        }

        .input {
          width: 100%;
          padding: 14px 18px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-radius: 14px;
          color: ${isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.95)'};
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .input:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .input::placeholder {
          color: ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(42,42,42,0.35)'};
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 18px;
          font-size: 0.85rem;
          color: #ef4444;
          text-align: center;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.35);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 24px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
        }

        .divider-text {
          font-size: 0.75rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .google-btn {
          width: 100%;
          padding: 14px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-radius: 14px;
          color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .google-btn:hover {
          background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)'};
          box-shadow: 0 4px 15px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.06)'};
        }

        .google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footer-text {
          text-align: center;
          font-size: 0.9rem;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
        }

        .footer-link {
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .footer-link:hover {
          text-decoration: underline;
        }

        .back-link {
          position: absolute;
          top: 24px;
          left: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
          border-radius: 50px;
          color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)'};
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .back-link:hover {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'};
        }

        .loading-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="login-page">
        <a href="/" className="back-link">← Back</a>

        <div className="login-container">
          <div className="logo">
            <div className="logo-text">VERA</div>
            <div className="logo-tagline">Welcome back</div>
          </div>

          <form className="form-card" onSubmit={handleSignIn}>
            <h1 className="form-title">Sign In</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : 'Sign In'}
            </button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="footer-text">
            Don't have an account?{' '}
            <a className="footer-link" onClick={() => router.push('/signup')}>
              Create Account
            </a>
          </div>
        </div>
      </div>
    </>
  );
}