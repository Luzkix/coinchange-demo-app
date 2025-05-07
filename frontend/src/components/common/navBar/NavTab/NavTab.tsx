import React from 'react';
import { Button } from '@mui/material';
import { navTabStyles } from './styles';

interface NavTabProps {
  label: string;
  to: string;
  active?: boolean;
  variant?: 'default' | 'primary';
  onClick?: () => void;
}

const NavTab: React.FC<NavTabProps> = ({
  label,
  to,
  active = false,
  variant = 'default',
  onClick,
}) => (
  <Button
    component="a"
    href={to}
    onClick={onClick}
    variant={variant === 'primary' ? 'contained' : 'text'}
    color={variant === 'primary' ? 'primary' : 'inherit'}
    sx={navTabStyles.button(active, variant)}
  >
    {label}
  </Button>
);

export default NavTab;
