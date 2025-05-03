import React, { useEffect } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { errorPopupStyles } from './styles';

interface ErrorPopupProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
  autoHideDuration?: number;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  open,
  onClose,
  errorMessage,
  autoHideDuration = 5000, // Default to 5 seconds
}) => {
  // Auto-hide the popup after specified duration
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [open, onClose, autoHideDuration]);

  // Add click event listener to close popup when clicking anywhere
  useEffect(() => {
    if (open) {
      const handleDocumentClick = () => {
        onClose();
      };

      // Add the event listener
      document.addEventListener('click', handleDocumentClick);

      // Clean up the event listener when component unmounts or popup closes
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Fade in={open}>
      <Box sx={errorPopupStyles.popup}>
        <Box sx={errorPopupStyles.header}>
          <ErrorOutlineIcon sx={errorPopupStyles.icon} />
          <Typography variant="subtitle1" sx={errorPopupStyles.title}>
            {errorMessage}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};
