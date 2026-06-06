import { SVGProps } from 'react';

export const IconUpload = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <path d="M12 17V3" />
    <path d="M7 8l5-5 5 5" />
    <path d="M3 21h18" />
  </svg>
);

export const IconDownload = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <path d="M12 3v14" />
    <path d="M7 12l5 5 5-5" />
    <path d="M3 21h18" />
  </svg>
);

export const IconSpark = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <path d="M5.5 5.5l13 13" />
    <path d="M18.5 5.5l-13 13" />
  </svg>
);

export const IconTrash = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <path d="M4 4l16 16" />
    <path d="M20 4L4 20" />
  </svg>
);

export const IconLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" {...props}>
    <rect x="10" y="10" width="80" height="80" />
    <line x1="10" y1="50" x2="90" y2="50" />
    <line x1="50" y1="10" x2="50" y2="90" />
  </svg>
);
