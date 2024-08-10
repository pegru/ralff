import React, {ReactNode} from 'react';
import {Box} from 'monday-ui-react-core';
import Header from './header';

interface MainPageProps {
  children?: ReactNode
}

function MainPage({children}: MainPageProps) {
  return (
    <Box backgroundColor={Box.backgroundColors.PRIMARY_BACKGROUND_COLOR}>
      <Header/>
      <Box padding={Box.paddings.SMALL}>
        <div>
          {children}
        </div>
      </Box>
    </Box>
  );
}

export default MainPage;