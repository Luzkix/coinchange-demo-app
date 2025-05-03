import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { errorModalStyles } from './styles';

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
  title?: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ open, onClose, errorMessage, title }) => {
  const { t } = useTranslation(['errors', 'common']);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <Box sx={errorModalStyles.modalContainer}>
        <Typography id="error-modal-title" variant="h6" component="h2" sx={errorModalStyles.title}>
          {title || t('errors:title.genericErrorTitle')}
        </Typography>
        <Typography id="error-modal-description" sx={errorModalStyles.description}>
          {errorMessage}
        </Typography>
        <Box sx={errorModalStyles.buttonContainer}>
          <Button onClick={onClose} variant="contained" color="primary">
            {t('common:button.close')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
