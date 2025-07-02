import React from 'react';
import ContentBox from '../../components/ui/ContentBox/ContentBox.tsx';
import Introduction from '../HomePageContent/Introduction/Introduction.tsx';
import TopUsers from './TopUsers/TopUsers.tsx';

export const HomePagePrivateContent: React.FC = () => {
  return (
    <ContentBox>
      <TopUsers />
      <Introduction />
    </ContentBox>
  );
};

export default HomePagePrivateContent;
