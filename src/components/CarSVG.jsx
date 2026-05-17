export default function CarSVG({ model, height = 140 }) {
  if (model === 'windsor') {
    return (
      <svg viewBox="0 0 280 110" xmlns="http://www.w3.org/2000/svg" height={height} style={{ width: '100%', maxWidth: 320 }}>
        <ellipse cx="140" cy="92" rx="118" ry="13" fill="rgba(0,0,0,0.22)" />
        <path d="M28 76 Q35 56 62 47 Q90 36 140 34 Q190 32 218 46 Q244 55 252 76 Z" fill="#c8c4c0" />
        <path d="M28 76 L252 76 L248 88 L32 88 Z" fill="#b0acaa" />
        <path d="M56 50 Q66 36 100 33 L100 52 Q76 54 62 58 Z" fill="#4a7a9b" opacity="0.9" />
        <path d="M104 33 Q144 32 164 40 Q174 45 174 52 L104 52 Z" fill="#4a7a9b" opacity="0.9" />
        <path d="M52 58 Q54 38 140 32 Q226 38 228 58 Z" fill="#d8d4d0" />
        <circle cx="72" cy="86" r="16" fill="#222" />
        <circle cx="72" cy="86" r="10" fill="#444" />
        <circle cx="72" cy="86" r="5" fill="#d4a574" />
        <circle cx="208" cy="86" r="16" fill="#222" />
        <circle cx="208" cy="86" r="10" fill="#444" />
        <circle cx="208" cy="86" r="5" fill="#d4a574" />
        <path d="M244 64 L252 68 L252 74 L244 74 Z" fill="#fffbe6" opacity="0.9" />
        <rect x="126" y="72" width="28" height="10" rx="3" fill="#c84b2f" />
        <text x="140" y="80" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="white" fontFamily="sans-serif">MG</text>
      </svg>
    );
  }

  if (model === 'nexon') {
    return (
      <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" height={height} style={{ width: '100%' }}>
        <ellipse cx="100" cy="74" rx="88" ry="10" fill="rgba(0,0,0,0.1)" />
        <path d="M15 62 Q22 44 50 37 Q78 28 100 27 Q122 26 150 34 Q178 42 185 62 Z" fill="#3a6aa8" />
        <path d="M15 62 L185 62 L180 72 L20 72 Z" fill="#2a5a98" />
        <path d="M48 40 Q58 30 98 27 L98 44 Q72 46 55 50 Z" fill="#a8d4f0" opacity="0.85" />
        <path d="M102 27 Q136 27 154 35 Q164 40 164 44 L102 44 Z" fill="#a8d4f0" opacity="0.85" />
        <circle cx="50" cy="70" r="12" fill="#222" /><circle cx="50" cy="70" r="7" fill="#444" /><circle cx="50" cy="70" r="3" fill="#2a5da8" />
        <circle cx="150" cy="70" r="12" fill="#222" /><circle cx="150" cy="70" r="7" fill="#444" /><circle cx="150" cy="70" r="3" fill="#2a5da8" />
        <rect x="88" y="58" width="24" height="8" rx="3" fill="#2a5da8" />
        <text x="100" y="65" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="white" fontFamily="sans-serif">NEXON</text>
      </svg>
    );
  }

  if (model === 'punch') {
    return (
      <svg viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg" height={height} style={{ width: '100%' }}>
        <ellipse cx="100" cy="74" rx="88" ry="10" fill="rgba(0,0,0,0.1)" />
        <path d="M18 62 Q24 46 48 40 Q75 32 100 31 Q125 30 152 38 Q176 46 182 62 Z" fill="#4a8a7a" />
        <path d="M18 62 L182 62 L178 72 L22 72 Z" fill="#3a7a6a" />
        <path d="M52 42 Q60 33 95 31 L95 46 Q70 48 58 50 Z" fill="#6ab8d4" opacity="0.85" />
        <path d="M100 31 Q132 31 148 38 Q155 42 155 46 L100 46 Z" fill="#6ab8d4" opacity="0.85" />
        <circle cx="52" cy="70" r="12" fill="#222" /><circle cx="52" cy="70" r="7" fill="#444" /><circle cx="52" cy="70" r="3" fill="#1f7a5c" />
        <circle cx="148" cy="70" r="12" fill="#222" /><circle cx="148" cy="70" r="7" fill="#444" /><circle cx="148" cy="70" r="3" fill="#1f7a5c" />
      </svg>
    );
  }

  console.warn(`CarSVG: unknown model "${model}"`);
  return null;
}
