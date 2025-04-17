import React from 'react';
import Introduction from './Introduction';
import HotCoins from './HotCoins';
import ContentBox from '../../components/ui/ContentBox';

export const HomePageContent: React.FC = () => {
  return (
    <ContentBox>
      <Introduction />
      <HotCoins />
    </ContentBox>
  );
};

export default HomePageContent;
