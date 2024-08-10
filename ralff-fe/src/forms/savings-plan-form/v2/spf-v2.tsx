import React from 'react';
import {Box, Flex, Heading} from 'monday-ui-react-core';
import {FormProvider, useForm} from 'react-hook-form';
import {SavingsFormDto} from '../model/savings-form-dto';
import Title from './components/title';
import StartEndDate from './components/start-end-date';
import MonthlySavings from './components/monthly-savings';
import SavingsSummary from './components/savings-summary';
import {useNavigate} from 'react-router-dom';
import FooterWrapper from './components/footer-wrapper';
import SavingsWrapper from './components/savings-wrapper';
import Generate from './components/generate';

const defaultValuesUnfilled: SavingsFormDto = {
  title: '',
  startDate: null,
  endDate: null,
  monthlySavings: 0,
  savings: []
}
const defaultValuesFilled: SavingsFormDto = {
  title: 'Title',
  startDate: new Date('2023-10-11'),
  endDate: new Date('2023-12-11'),
  monthlySavings: 150,
  savings: []
}

function SpfV2() {
  const navigate = useNavigate();
  const formMethods = useForm<SavingsFormDto>({
    defaultValues: defaultValuesUnfilled,
    mode: 'onBlur'
  });

  const onSubmit = (data: SavingsFormDto) => {
    console.log(data);
    navigate('/')
  }

  return (
    <Flex direction={Flex.directions.COLUMN} align={Flex.align.CENTER} style={{width: '80%'}}>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} onReset={event => formMethods.reset()}>
          <Box border={Box.borders.DEFAULT} padding={Box.paddings.LARGE} rounded={Box.roundeds.MEDIUM}>
            <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.MEDIUM} align={Flex.align.START}>
              <Heading type={Heading.types.h1} value={'Saving Plan'}/>
              <Title/>
              <StartEndDate/>
              <MonthlySavings/>
              <Generate/>
              <SavingsWrapper/>
              <SavingsSummary/>
              <FooterWrapper/>
            </Flex>
          </Box>

        </form>
      </FormProvider>
    </Flex>
  );
}

export default SpfV2;