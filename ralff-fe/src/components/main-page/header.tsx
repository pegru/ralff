import React from 'react';
import {Box, Divider, Flex, IconButton} from 'monday-ui-react-core';
import {useNavigate} from 'react-router-dom';
import {Heading} from "monday-ui-react-core/next";
import {Launch} from 'monday-ui-react-core/icons';
import {TITLE} from '../../forms/constants';

const Header = () => {
  const navigate = useNavigate();
  return (
    <Flex style={{width: '60%', display: 'block'}}>
      <Box backgroundColor={Box.backgroundColors.GREY_BACKGROUND_COLOR} padding={Box.paddings.SMALL}>
        <Flex direction={Flex.directions.ROW} gap={Flex.gaps.SMALL}>
          <IconButton
            icon={Launch}
            onClick={() => navigate('/')}
          />
          <Heading>
            {TITLE}
          </Heading>
        </Flex>
        <Divider/>
      </Box>
    </Flex>
  );
};

export default Header;