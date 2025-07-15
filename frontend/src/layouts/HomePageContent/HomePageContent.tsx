import React from 'react';
import Introduction from './Introduction/Introduction.tsx';
import HotCoins from './HotCoins/HotCoins.tsx';
import ContentBox from '../../components/ui/ContentBox/ContentBox.tsx';
import Acknowledgment from './Acknowledgment/Acknowledgment.tsx';

export const HomePageContent: React.FC = () => {
  return (
    <ContentBox>
      <Introduction />
      <HotCoins />
      <Acknowledgment />
    </ContentBox>
  );
};

export default HomePageContent;
