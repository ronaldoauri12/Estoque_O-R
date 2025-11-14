
import React from 'react';
import { Icon } from './Icon';

export const ProductIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M21.71,7.29l-4-4A1,1,0,0,0,17,3H7A1,1,0,0,0,6.29,3.29l-4,4A1,1,0,0,0,2,8v10a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V8A1,1,0,0,0,21.71,7.29ZM12,18H4V8.41l2-2H18l2,2V18H12Zm5-12H7.41l1-1h7.18l1,1ZM14,12v4h4V12Z" />
  </Icon>
);
