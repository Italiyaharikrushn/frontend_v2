import React from 'react';

export const CraftyLogoEmblem = ({ size = 44, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`crafty-logo-emblem ${className}`}
  >
    <defs>
      <linearGradient id="craftyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5E4A8" />
        <stop offset="35%" stopColor="#D4AF37" />
        <stop offset="70%" stopColor="#C5A059" />
        <stop offset="100%" stopColor="#AA7C11" />
      </linearGradient>
    </defs>

    {/* Outer Rounded Box */}
    <rect
      x="6"
      y="6"
      width="88"
      height="88"
      rx="22"
      ry="22"
      stroke="url(#craftyGoldGrad)"
      strokeWidth="5"
      fill="#3D2314"
    />

    {/* Floral Blossom 4-Petal Motif */}
    <path
      d="M50 50 C38 35, 38 18, 50 18 C62 18, 62 35, 50 50 Z"
      stroke="url(#craftyGoldGrad)"
      strokeWidth="3.5"
      fill="none"
    />
    <path
      d="M50 50 C38 65, 38 82, 50 82 C62 82, 62 65, 50 50 Z"
      stroke="url(#craftyGoldGrad)"
      strokeWidth="3.5"
      fill="none"
    />
    <path
      d="M50 50 C35 38, 18 38, 18 50 C18 62, 35 62, 50 50 Z"
      stroke="url(#craftyGoldGrad)"
      strokeWidth="3.5"
      fill="none"
    />
    <path
      d="M50 50 C65 38, 82 38, 82 50 C82 62, 65 62, 50 50 Z"
      stroke="url(#craftyGoldGrad)"
      strokeWidth="3.5"
      fill="none"
    />

    {/* Inner Petal lines & accents */}
    <path d="M50 50 Q36 36 28 28 Q42 42 50 50 Z" fill="url(#craftyGoldGrad)" opacity="0.85" />
    <path d="M50 50 Q64 36 72 28 Q58 42 50 50 Z" fill="url(#craftyGoldGrad)" opacity="0.85" />
    <path d="M50 50 Q36 64 28 72 Q42 58 50 50 Z" fill="url(#craftyGoldGrad)" opacity="0.85" />
    <path d="M50 50 Q64 64 72 72 Q58 58 50 50 Z" fill="url(#craftyGoldGrad)" opacity="0.85" />

    {/* Center Core */}
    <circle cx="50" cy="50" r="3.5" fill="url(#craftyGoldGrad)" />
  </svg>
);

const CraftyLogo = ({ size = 42, showSubtitle = false }) => {
  return (
    <div className="crafty-brand-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem' }}>
      <CraftyLogoEmblem size={size} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span
          className="crafty-brand-title"
          style={{
            fontFamily: "var(--font-serif, 'Playfair Display', serif)",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#D4AF37',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
          }}
        >
          crafty_kiya
        </span>
        {showSubtitle && (
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'rgba(212, 175, 55, 0.8)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginTop: '1px'
            }}
          >
            Handcrafted Luxury
          </span>
        )}
      </div>
    </div>
  );
};

export default CraftyLogo;
