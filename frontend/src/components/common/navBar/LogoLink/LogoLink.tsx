import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { logoLinkStyles } from './styles.ts';

interface LogoLinkProps {
  to: string;
  onClick?: () => void;
}

const LogoLink: React.FC<LogoLinkProps> = ({ to, onClick }) => (
  <Link to={to} onClick={onClick} style={logoLinkStyles.link as React.CSSProperties}>
    <Typography variant="h6" sx={logoLinkStyles.typography}>
      CoinChange
    </Typography>
  </Link>
);

export default LogoLink;
