export const errorPopupStyles = {
  popup: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 2000,
    minWidth: '200px',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '4px',
    display: 'flex',
    border: '1px solid #f44336',
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes fadeIn': {
      '0%': {
        opacity: 0,
        transform: 'translateY(20px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  title: {
    color: '#f44336',
    flex: 1,
  },
  icon: {
    color: '#f44336',
  },
};
