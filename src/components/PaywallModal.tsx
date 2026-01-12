'use client';

import { useRouter } from 'next/navigation';

type PaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  isDark: boolean;
};

export default function PaywallModal({ isOpen, onClose, roomName, isDark }: PaywallModalProps) {
  const router = useRouter();

  const handleStartTrial = async () => {
    const response = await fetch('/api/checkout', { method: 'POST' });
    const { url, error } = await response.json();
    if (url) {
      window.location.href = url;
    } else {
      alert(error || 'Failed to start checkout');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal {
          background: ${isDark
            ? 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8f6f2 100%)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-radius: 24px;
          padding: 40px 36px;
          max-width: 400px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
          position: relative;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border: none;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          border-radius: 50%;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
        }

        .modal-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .modal-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 400;
          color: ${isDark ? 'rgba(255,255,255,0.95)' : 'rgba(42,42,42,0.95)'};
          margin-bottom: 12px;
        }

        .modal-text {
          font-size: 0.95rem;
          color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(42,42,42,0.6)'};
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .room-name {
          color: #8b5cf6;
          font-weight: 500;
        }

        .trial-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 16px;
        }

        .trial-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }

        .pricing-note {
          font-size: 0.8rem;
          color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(42,42,42,0.4)'};
          margin-bottom: 20px;
        }

        .pricing-highlight {
          color: #34d399;
          font-weight: 500;
        }

        .signin-link {
          font-size: 0.9rem;
          color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(42,42,42,0.5)'};
        }

        .signin-link a {
          color: #8b5cf6;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .signin-link a:hover {
          text-decoration: underline;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 24px 0;
          text-align: left;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(42,42,42,0.7)'};
        }

        .feature-icon {
          color: #34d399;
          font-size: 1rem;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>

          <div className="modal-icon">🔒</div>

          <h2 className="modal-title">Unlock {roomName}</h2>

          <p className="modal-text">
            The <span className="room-name">{roomName}</span> is available with a VERA subscription. Start your free trial to access all rooms.
          </p>

          <div className="features">
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Access to all 6 rooms</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Unlimited conversations with VERA</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Full Library with all stories</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <span>Cancel anytime</span>
            </div>
          </div>

          <button className="trial-btn" onClick={handleStartTrial}>
            Start 7-Day Free Trial
          </button>

          <p className="pricing-note">
            Then <span className="pricing-highlight">$8/month</span> · Cancel anytime
          </p>

          <p className="signin-link">
            Already have an account?{' '}
            <a
              onClick={() => {
                onClose();
                router.push('/login');
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
