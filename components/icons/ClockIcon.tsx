import React from 'react';
import { Icon } from './Icon';

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);
