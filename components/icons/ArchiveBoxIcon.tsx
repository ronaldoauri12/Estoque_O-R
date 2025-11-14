import React from 'react';
import { Icon } from './Icon';

export const ArchiveBoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/>
    <rect x="1" y="3" width="22" height="5" rx="2" ry="2"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </Icon>
);
