
import React from 'react';
import { Icon } from './Icon';

export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M13 3V9H21V3H13ZM3 21H11V15H3V21ZM3 13H11V3H3V13ZM13 21H21V11H13V21Z" />
  </Icon>
);
