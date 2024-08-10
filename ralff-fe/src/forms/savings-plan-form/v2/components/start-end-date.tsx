import React from 'react';
import {Flex} from 'monday-ui-react-core';
import StartDate from './start-date';
import EndDate from './end-date';

const StartEndDate = () => {
  return (
    <Flex direction={Flex.directions.ROW} gap={Flex.gaps.MEDIUM} justify={Flex.justify.SPACE_BETWEEN}
          align={Flex.align.START}
          style={{width: '100%'}}>
      <StartDate/>
      <EndDate/>
    </Flex>
  );
};

export default StartEndDate;