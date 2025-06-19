import React from 'react';
import { Box, CircularProgress, SxProps, Typography } from '@mui/material';
import { Theme } from '@mui/system';

export type AllowedVariantsOfCustomCircularProgress = 'determinate' | 'indeterminate';
export type AllowedCircularColorsOfCustomCircularProgress =
  | 'inherit'
  | 'primary'
  | 'error'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning';
export type AllowedTextColorsOfCustomCircularProgress =
  | 'primary'
  | 'error'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'textPrimary'
  | 'textSecondary'
  | 'textDisabled';

interface CustomCircularProgressProps {
  variant?: AllowedVariantsOfCustomCircularProgress | undefined;
  percentLeft?: number | undefined;
  circularSize?: string | number | undefined;
  circularThickness?: number | undefined;
  circularColor?: AllowedCircularColorsOfCustomCircularProgress | undefined;
  textColor?: string | AllowedTextColorsOfCustomCircularProgress | undefined;
  textSx?: SxProps<Theme> | undefined;
}

export const CustomCircularProgress: React.FC<CustomCircularProgressProps> = ({
  variant,
  percentLeft,
  circularSize,
  circularThickness,
  circularColor,
  textColor,
  textSx,
}) => {
  return (
    <>
      <Box sx={{ position: 'relative', display: 'inline-flex', mx: 1 }}>
        <CircularProgress
          variant={variant ? variant : 'determinate'}
          value={percentLeft}
          size={circularSize ? circularSize : 25}
          thickness={circularThickness ? circularThickness : 5}
          color={
            circularColor ? circularColor : !!percentLeft && percentLeft > 30 ? 'primary' : 'error'
          }
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!!percentLeft && percentLeft > 0 && (
            <Typography
              variant="caption"
              color={textColor ? textColor : percentLeft > 30 ? 'primary' : 'error'}
              sx={textSx ? textSx : { fontWeight: 700 }}
            >
              {Math.floor(percentLeft / 10)}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};
