import React from 'react';
import { Icon } from './Icon';

export const MagicWandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9 5l-2.5 1L9 8l3 3 3-3 2.5-2-2.5-1L12 2z" />
    <path d="M12 22V8" />
    <path d="M4 14l2 2 2-2" />
    <path d="M16 14l2 2 2-2" />
  </Icon>
);
