import React from 'react';
import { Icon } from './Icon';

export const SortIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-gray-600">
    <path d="M8.29,13.29a1,1,0,0,0,0,1.42l4,4a1,1,0,0,0,1.42,0l4-4a1,1,0,1,0-1.42-1.42L12,16.59,9.71,14.29A1,1,0,0,0,8.29,13.29ZM15.71,9.29a1,1,0,0,0-1.42,0L12,11.59,9.71,9.29A1,1,0,0,0,8.29,10.71l4,4a1,1,0,0,0,1.42,0l4-4A1,1,0,0,0,15.71,9.29Z"/>
  </Icon>
);
