import React from 'react';
import Introduction from './Introduction/Introduction.tsx';
import HotCoins from './HotCoins/HotCoins.tsx';
import ContentBox from '../../components/ui/ContentBox/ContentBox.tsx';

export const HomePageContent: React.FC = () => {
  return (
    <ContentBox>
      <Introduction />
      <HotCoins />
    </ContentBox>
  );
};

export default HomePageContent;
