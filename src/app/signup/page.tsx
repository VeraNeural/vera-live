'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const isDark = timeOfDay === 'evening' || timeOfDay === 'night';

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, displayName.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <style jsx>{`
          .success-page {
            min-height: 100vh;
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
          .success-card {
            max-width: 400px;
            text-align: center;
            background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'};
            border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
            border-radius: 24px;
            padding: 48px 36px;
            backdrop-filter: blur(20px);
          }
          .success-icon {
            font-size: 4rem;
            margin-bottom: 24px;
          }
          .success-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.8rem;
            color: ${isDark ? 'rgba(255,255,255,0.9)' : 'rgba(42,42,42,0.9)'};
            margin-bottom: 12px;
          }
          .success-text {
            color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)'};
            line-height: 1.6;
            margin-bottom: 32px;
          }
          .success-btn {
            padding: 14px 32px;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            border: none;
            border-radius: 50px;
            color: white;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .success-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.35);
          }
        `}</style>
        <div className="success-page">
          <div className="success-card">
            <div className="success-icon">✉️</div>
            <h1 className="success-title">Check your email</h1>
            <p className="success-text">
              We've sent a verification link to <strong>{email}</strong>. 
              Click the link to activate your account and access Your Space.
            </p>
            <button className="success-btn" onClick={() => router.push('/login')}>
              Go to Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        .signup-page {
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

        .signup-container {
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
          margin-bottom: 8px;
          text-align: center;
        }

        .form-subtitle {
          font-size: 0.85rem;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
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

      <div className="signup-page">
        <a href="/" className="back-link">← Back</a>

        <div className="signup-container">
          <div className="logo">
            <div className="logo-text">VERA</div>
            <div className="logo-tagline">Your space awaits</div>
          </div>

          <form className="form-card" onSubmit={handleSignUp}>
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">
              Sign up to unlock all rooms in Your Space
            </p>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label className="input-label">Display Name</label>
              <input
                type="text"
                className="input"
                placeholder="How should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
                maxLength={30}
              />
            </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="footer-text">
            Already have an account?{' '}
            <a className="footer-link" onClick={() => router.push('/login')}>
              Sign In
            </a>
          </div>
        </div>
      </div>
    </>
  );
}