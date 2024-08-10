import React from 'react';
import MainPage from '../../components/main-page/main-page';
import HtmlLf from './html-lf';

const HtmlLfPage = () => {

  const onSubmit = () => {
    // ignore
  }

  return (
    <MainPage>
      <HtmlLf onSubmit={onSubmit}/>
    </MainPage>
  );
};

export default HtmlLfPage;