import React from 'react';

interface SmartResumeIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * SmartResumeIcon: A bespoke, ultra-professional and smart icon for the resume.
 * Features an executive document silhouette with a candidate profile emblem,
 * structured technical content lines, and a sparkling smart intelligence star/diamond.
 */
export function SmartResumeIcon({
  className = 'w-5 h-5',
  size = 20,
  glow = false,
}: SmartResumeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(242,194,48,0.4)]' : ''}`}
    >
      {/* Document Base with folded corner */}
      <path
        d="M5 3.5C5 2.67157 5.67157 2 6.5 2H14.5L19 6.5V20.5C19 21.3284 18.3284 22 17.5 22H6.5C5.67157 22 5 21.3284 5 20.5V3.5Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Folded corner flap */}
      <path
        d="M14 2V6.5C14 6.77614 14.2239 7 14.5 7H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Candidate Profile Circle & Silhouette */}
      <circle
        cx="9"
        cy="7.5"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 12C6.5 10.6193 7.61929 9.5 9 9.5C10.3807 9.5 11.5 10.6193 11.5 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Professional Content Lines */}
      <path
        d="M8 15H16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 18H14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Smart Intelligence Sparkle / Diamond in Top/Center Right */}
      <path
        d="M17.5 11L18.2 12.8L20 13.5L18.2 14.2L17.5 16L16.8 14.2L15 13.5L16.8 12.8L17.5 11Z"
        fill="#F2C230"
        stroke="#E0A521"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
