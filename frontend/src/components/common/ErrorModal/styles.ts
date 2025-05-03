import { SxProps, Theme } from '@mui/material';

interface ErrorModalStyles {
  modalContainer: SxProps<Theme>;
  title: SxProps<Theme>;
  description: SxProps<Theme>;
  buttonContainer: SxProps<Theme>;
}

export const errorModalStyles: ErrorModalStyles = {
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #f44336',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  },
  title: {
    color: 'error.main',
  },
  description: {
    mt: 2,
  },
  buttonContainer: {
    mt: 3,
    display: 'flex',
    justifyContent: 'flex-end',
  },
};
