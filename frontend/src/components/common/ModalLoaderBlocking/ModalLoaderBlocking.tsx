import React from 'react';
import { Box, CircularProgress, Modal } from '@mui/material';
import { modalBoxStyle } from './styles';

interface ModalLoaderBlockingProps {
  isOpen: boolean;
}

const ModalLoaderBlocking: React.FC<ModalLoaderBlockingProps> = ({ isOpen }) => (
  <Modal
    open={isOpen}
    aria-labelledby="blocking-loader-modal"
    disableEscapeKeyDown
    disableAutoFocus
  >
    <Box sx={modalBoxStyle}>
      <CircularProgress />
    </Box>
  </Modal>
);

export default ModalLoaderBlocking;
