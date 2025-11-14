import React from 'react';
import { Icon } from './Icon';

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} viewBox="0 0 24 24">
    <path fill="currentColor" d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
  </Icon>
);
