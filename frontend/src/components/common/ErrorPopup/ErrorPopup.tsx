import React, { useEffect } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { errorPopupStyles } from './styles';
import {
  DEFAULT_ERROR_POPUP_AUTOHIDE_TIME,
  DEFAULT_NUMBER_OF_POPUP_ERROR_MESSAGES,
} from '../../../constants/configVariables.ts';

interface ErrorPopupProps {
  messages: Array<{ id: number; text: string }>;
  removeMessage: (id: number) => void;
  autoHideDuration?: number;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  messages,
  removeMessage,
  autoHideDuration = DEFAULT_ERROR_POPUP_AUTOHIDE_TIME,
}) => {
  // Omezení na maximálně X nejnovějších zpráv
  const limitedMessages = messages.slice(-DEFAULT_NUMBER_OF_POPUP_ERROR_MESSAGES);

  useEffect(() => {
    // Automatické odstranění zpráv po čase
    const timers = limitedMessages.map((message) =>
      setTimeout(() => removeMessage(message.id), autoHideDuration),
    );

    // Přidání event listeneru - při kliknutí kamkoliv zmizí zobrazené zprávy
    const handleDocumentClick = () => {
      limitedMessages.forEach((message) => removeMessage(message.id));
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [limitedMessages, removeMessage, autoHideDuration]);

  if (limitedMessages.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '10px',
      }}
    >
      {limitedMessages.map((message) => (
        <Fade in={true} key={message.id}>
          <Box sx={errorPopupStyles.popup}>
            <Box sx={errorPopupStyles.header}>
              <ErrorOutlineIcon sx={errorPopupStyles.icon} />
              <Typography variant="body1" sx={errorPopupStyles.title}>
                {message.text}
              </Typography>
            </Box>
          </Box>
        </Fade>
      ))}
    </Box>
  );
};
