import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { logoLinkStyles } from './styles.ts';

const LogoLink: React.FC = () => (
  <Link to="/" style={logoLinkStyles.link as React.CSSProperties}>
    <Typography variant="h6" sx={logoLinkStyles.typography}>
      CoinChange
    </Typography>
  </Link>
);

export default LogoLink;
