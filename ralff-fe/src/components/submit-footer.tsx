import React from 'react';
import {Button, Flex} from 'monday-ui-react-core';
import {useNavigate} from 'react-router-dom';

interface SubmitFooterProps {
  disabled: boolean
}

const SubmitFooter = ({disabled = true}: SubmitFooterProps) => {
  const navigate = useNavigate();
  return (
    <Flex direction={Flex.directions.ROW} justify={Flex.justify.SPACE_BETWEEN} style={{width: '100%'}}>
      <Button kind={Button.kinds.SECONDARY} onClick={() => navigate('/')}>
        Cancel
      </Button>
      <Button disabled={disabled} type={Button.types.SUBMIT}>
        Submit
      </Button>
    </Flex>
  );
};

export default SubmitFooter;