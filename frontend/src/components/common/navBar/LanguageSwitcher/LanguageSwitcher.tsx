import React from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { languageSwitcherStyles } from './styles.ts';
import { SupportedLanguageEnum } from '../../../../constants/customEnums.ts';
import { Languages } from '../../../../constants/customConstants.ts';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  currentLanguage: string;
  handleLanguageChange: (lng: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  handleLanguageChange,
}) => {
  const { t } = useTranslation(['common']);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={t('header.languageSelection')}>
        <IconButton
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={languageSwitcherStyles.iconButton}
        >
          <LanguageIcon sx={languageSwitcherStyles.iconStyles} />
        </IconButton>
      </Tooltip>
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
