import React from 'react';

export default function SugarSkull({ size = 60 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Skull base */}
      <ellipse cx="50" cy="45" rx="36" ry="38" fill="white" />
      {/* Jaw */}
      <rect x="30" y="72" width="40" height="22" rx="6" fill="white" />

      {/* Forehead diamond */}
      <polygon points="50,10 58,20 50,30 42,20" fill="#E8175D" />
      <polygon points="50,13 56,20 50,27 44,20" fill="#F5A623" />

      {/* Left eye socket */}
      <ellipse cx="34" cy="48" rx="12" ry="13" fill="#1E1E2E" />
      {/* Left eye decorative ring */}
      <ellipse cx="34" cy="48" rx="14" ry="15" fill="none" stroke="#E8391A" strokeWidth="2.5" />
      {/* Left eye flower petals */}
      <circle cx="34" cy="33" r="3.5" fill="#E8175D" />
      <circle cx="47" cy="40" r="3.5" fill="#F5A623" />
      <circle cx="47" cy="56" r="3.5" fill="#E8175D" />
      <circle cx="34" cy="63" r="3.5" fill="#F5A623" />
      <circle cx="21" cy="56" r="3.5" fill="#E8391A" />
      <circle cx="21" cy="40" r="3.5" fill="#E8175D" />
      {/* Left eye center */}
      <circle cx="34" cy="48" r="4" fill="#1E9ED4" />

      {/* Right eye socket */}
      <ellipse cx="66" cy="48" rx="12" ry="13" fill="#1E1E2E" />
      {/* Right eye decorative ring */}
      <ellipse cx="66" cy="48" rx="14" ry="15" fill="none" stroke="#1E9ED4" strokeWidth="2.5" />
      {/* Right eye flower petals */}
      <circle cx="66" cy="33" r="3.5" fill="#F5A623" />
      <circle cx="79" cy="40" r="3.5" fill="#E8391A" />
      <circle cx="79" cy="56" r="3.5" fill="#F5A623" />
      <circle cx="66" cy="63" r="3.5" fill="#E8391A" />
      <circle cx="53" cy="56" r="3.5" fill="#F5A623" />
      <circle cx="53" cy="40" r="3.5" fill="#E8391A" />
      {/* Right eye center */}
      <circle cx="66" cy="48" r="4" fill="#E8175D" />

      {/* Nose */}
      <path d="M50 60 L46 68 L54 68 Z" fill="#1E1E2E" />

      {/* Cheek left flowers */}
      <circle cx="20" cy="62" r="5" fill="#E8175D" opacity="0.8" />
      <circle cx="14" cy="55" r="3" fill="#F5A623" opacity="0.8" />
      <circle cx="14" cy="69" r="3" fill="#E8391A" opacity="0.8" />

      {/* Cheek right flowers */}
      <circle cx="80" cy="62" r="5" fill="#1E9ED4" opacity="0.8" />
      <circle cx="86" cy="55" r="3" fill="#F5A623" opacity="0.8" />
      <circle cx="86" cy="69" r="3" fill="#E8391A" opacity="0.8" />

      {/* Teeth dividers */}
      <line x1="40" y1="72" x2="40" y2="94" stroke="#AAA" strokeWidth="1.5" />
      <line x1="50" y1="72" x2="50" y2="94" stroke="#AAA" strokeWidth="1.5" />
      <line x1="60" y1="72" x2="60" y2="94" stroke="#AAA" strokeWidth="1.5" />

      {/* Top teeth color accent */}
      <rect x="30" y="72" width="10" height="5" rx="2" fill="#E8391A" opacity="0.5" />
      <rect x="40" y="72" width="10" height="5" rx="2" fill="#F5A623" opacity="0.5" />
      <rect x="50" y="72" width="10" height="5" rx="2" fill="#E8175D" opacity="0.5" />
      <rect x="60" y="72" width="10" height="5" rx="2" fill="#1E9ED4" opacity="0.5" />
    </svg>
  );
}
