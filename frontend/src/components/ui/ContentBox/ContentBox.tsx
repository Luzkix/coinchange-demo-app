import React, { PropsWithChildren } from 'react';
import { Box } from '@mui/material';

const ContentBox: React.FC<PropsWithChildren> = ({ children }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '1180px',
      marginLeft: 'auto',
      marginRight: 'auto',
      px: 2, // padding left/right for small screens
      boxSizing: 'border-box',
    }}
  >
    {children}
  </Box>
);

export default ContentBox;
