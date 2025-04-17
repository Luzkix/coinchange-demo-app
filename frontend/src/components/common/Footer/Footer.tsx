import React from 'react';
import { Box, Button, Link as MuiLink, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { footerStyles } from './styles';
import footerLinks from '../../../constants/footerLinks';
import ContentBox from '../../ui/ContentBox';

export const Footer: React.FC = () => {
  const { t } = useTranslation(['footer']);

  return (
    <Box component="footer" sx={footerStyles.footer}>
      <ContentBox>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={footerStyles.sectionTitle}>
              {t('sections.services')}
            </Typography>
            {footerLinks.services.map((linkKey) => (
              <MuiLink href="#" key={linkKey} sx={footerStyles.linkItem}>
                {t(`links.services.${linkKey}`)}
              </MuiLink>
            ))}
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={footerStyles.sectionTitle}>
              {t('sections.coinChange')}
            </Typography>
            {footerLinks.coinChange.map((linkKey) => (
              <MuiLink href="#" key={linkKey} sx={footerStyles.linkItem}>
                {t(`links.coinChange.${linkKey}`)}
              </MuiLink>
            ))}
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={footerStyles.sectionTitle}>
              {t('sections.education')}
            </Typography>
            {footerLinks.education.map((linkKey) => (
              <MuiLink href="#" key={linkKey} sx={footerStyles.linkItem}>
                {t(`links.education.${linkKey}`)}
              </MuiLink>
            ))}
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={footerStyles.sectionTitle}>
              {t('sections.newsletter')}
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={footerStyles.newsletterForm}
            >
              <TextField
                placeholder={t('newsletterForm.placeholder')}
                variant="filled"
                size="small"
                fullWidth
                sx={footerStyles.newsletterInput}
              />
              <Button variant="contained" color="primary">
                {t('newsletterForm.subscribe')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ContentBox>
    </Box>
  );
};

export default Footer;
