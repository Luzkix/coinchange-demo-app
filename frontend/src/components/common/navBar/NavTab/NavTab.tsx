import React from 'react';
import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
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
}) => {
  return (
    <Button
      component={RouterLink}
      to={to}
      onClick={onClick}
      variant={variant === 'primary' ? 'contained' : 'text'}
      color={variant === 'primary' ? 'primary' : 'inherit'}
      sx={navTabStyles.button(active, variant)}
    >
      {label}
    </Button>
  );
};

export default NavTab;
