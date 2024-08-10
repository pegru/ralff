import React from 'react';
import {Button} from 'monday-ui-react-core';
import {useFormContext} from 'react-hook-form';
import {SavingsFormDto} from '../../model/savings-form-dto';
import {SavingsDto} from '../../model/savings-dto';
import {FORM_END_DATE, FORM_MONTHLY_SAVINGS, FORM_SAVINGS, FORM_START_DATE, FORM_TITLE} from "../../../constants";

const Generate = () => {
  const formMethods = useFormContext();
  const {trigger, getValues, setValue} = formMethods;

  const onClick = async () => {
    const result = await trigger([FORM_TITLE, FORM_START_DATE, FORM_END_DATE, FORM_MONTHLY_SAVINGS])
    // console.log(getValues())
    if (!result) {
      return;
    }
    // console.log('Generating')

    // generate savings entries
    const savingsFormDto: SavingsFormDto = getValues() as SavingsFormDto;
    if (!savingsFormDto.startDate || !savingsFormDto.endDate) {
      return;
    }

    const startDate = new Date(savingsFormDto.startDate);
    const endDate = new Date(savingsFormDto.endDate);
    const savings: SavingsDto[] = [];

    const iterator = new Date(startDate);
    while (iterator.getTime() < endDate.getTime()) {
      iterator.setMonth(iterator.getMonth() + 1);
      savings.push({
        paymentDate: new Date(iterator),
        amount: savingsFormDto.monthlySavings
      });
    }

    setValue(FORM_SAVINGS, savings);
  }

  return (
    <Button size={Button.sizes.SMALL} style={{alignSelf: 'end'}} onClick={onClick}>
      {'Generate'}
    </Button>
  );
};

export default Generate;