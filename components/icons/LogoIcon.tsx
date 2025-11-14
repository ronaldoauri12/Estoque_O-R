import React from 'react';
import { Icon } from './Icon';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} viewBox="0 0 110 100">
    {/* "O" in dark blue-gray */}
    <g fill="#34495E">
      <path d="M28.5,20 C12.7,20 0,33.3 0,50 C0,66.7 12.7,80 28.5,80 C44.3,80 57,66.7 57,50 C57,33.3 44.3,20 28.5,20 Z M28.5,78 C13.9,78 2,65.6 2,50 C2,34.4 13.9,22 28.5,22 C43.1,22 55,34.4 55,50 C55,65.6 43.1,78 28.5,78 Z" />
      <rect x="0" y="18" width="57" height="2" />
      <rect x="0" y="80" width="57" height="2" />
    </g>
    {/* "R" in light gray */}
    <g fill="#AEAEAE">
      <rect x="60" y="18" width="2" height="64" />
      <path d="M60,34 C60,25.2 66.2,18 75,18 C83.8,18 92,25.2 92,34 C92,42.8 83.8,50 75,50 H62 V48 H75 C82.7,48 90,41.7 90,34 C90,26.3 82.7,20 75,20 C67.3,20 62,26.3 62,34 H60 Z" />
      <path d="M75,50 L95,82 H93 L73,50 H75 Z" />
      <rect x="60" y="16" width="40" height="2" />
    </g>
    {/* Triangle in light gray */}
    <polygon points="48,0 58,0 53,8" fill="#AEAEAE"/>
  </Icon>
);
