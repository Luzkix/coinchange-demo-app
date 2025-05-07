import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { languageSwitcherStyles } from './styles.ts';
import { SupportedLanguageEnum } from '../../../../constants/customEnums.ts';
import { Languages } from '../../../../constants/customConstants.ts';

interface LanguageSwitcherProps {
  currentLanguage: string;
  handleLanguageChange: (lng: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  handleLanguageChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={languageSwitcherStyles.iconButton}
      >
        <LanguageIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {Object.values(SupportedLanguageEnum).map((language) => (
          <MenuItem
            key={language}
            selected={currentLanguage === language}
            onClick={() => {
              handleLanguageChange(language);
              setAnchorEl(null);
            }}
          >
            {Languages[language].localizedName}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
