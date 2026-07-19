export default function BibleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ribbon bookmark */}
      <path d="M256 50 L256 400" stroke="#e63946" strokeWidth="6" strokeLinecap="round" />

      {/* Left cover — main open page */}
      <path
        d="M22 100 L248 62 L248 440 L22 416 Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinejoin="round"
      />

      {/* Right cover — back page visible */}
      <path
        d="M264 62 L490 100 L490 416 L264 440 Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinejoin="round"
        opacity="0.15"
      />

      {/* Spine */}
      <rect x="248" y="55" width="16" height="390" rx="4" fill="currentColor" opacity="0.5" />

      {/* Gold page edges — top left */}
      <path d="M35 108 L245 70 L248 74 L38 112 Z" fill="#d4a847" />

      {/* Gold page edges — top right */}
      <path d="M267 70 L477 108 L474 112 L264 74 Z" fill="#d4a847" />

      {/* Gold page edges — bottom left */}
      <path d="M38 410 L248 432 L245 436 L35 414 Z" fill="#d4a847" />

      {/* Gold page edges — bottom right */}
      <path d="M264 432 L474 410 L477 414 L267 436 Z" fill="#d4a847" />

      {/* Gold cross on ribbon */}
      <path d="M256 120 L256 180" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
      <path d="M234 150 L278 150" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
