import React from 'react';
import {Flex, Text} from 'monday-ui-react-core';
import {useWatch} from 'react-hook-form';
import {SavingsDto} from '../../model/savings-dto';
import {FORM_SAVINGS} from "../../../constants";

const SavingsSummary = () => {
  const savings: SavingsDto[] = useWatch({name: FORM_SAVINGS})
  let total = 0;
  if (savings) {
    total = savings.reduce((partialSum, a) => {
      return partialSum + (a.amount ? +a.amount : 0)
    }, 0);
  }

  return (
    <Flex direction={Flex.directions.ROW} gap={Flex.gaps.SMALL} justify={Flex.justify.END} style={{width: '100%'}}>
      <Text type={Text.types.TEXT1}>
        Total Savings
      </Text>
      <Text type={Text.types.TEXT1}>
        {total} €
      </Text>
    </Flex>
  );
};

export default SavingsSummary;