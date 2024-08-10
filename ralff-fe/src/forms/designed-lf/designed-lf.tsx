import React from 'react';
import {Box, Flex, Heading} from 'monday-ui-react-core';
import {FormProvider, useForm} from 'react-hook-form';
import {LoginFormDto} from './model/login-form-dto';
import {useNavigate} from 'react-router-dom';
import {createPortal} from 'react-dom';
import {render} from '@testing-library/react';
import {MyToast} from '../../components/my-toast';
import Username from '../html-lf/components/username';
import Password from '../html-lf/components/password';
import FooterWrapper from "../html-lf/components/footer-wrapper";

function DesignedLf() {
  const navigate = useNavigate();

  const initialFormValues: LoginFormDto = {
    username: '',
    password: ''
  }

  const formMethods = useForm<LoginFormDto>({
    defaultValues: initialFormValues,
    mode: 'onChange'
  });


  const {
    handleSubmit,
    reset
  } = formMethods;

  const createBanner = () => {
    render(createPortal(<MyToast/>, document.body));
  }

  const onSubmit = (data: LoginFormDto) => {
    console.log(data);
    createBanner();
  }

  return (
    <Flex direction={Flex.directions.COLUMN} align={Flex.align.CENTER}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} onReset={event => reset()}>
          <Box border={Box.borders.DEFAULT} padding={Box.paddings.LARGE} rounded={Box.roundeds.MEDIUM}>
            <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.MEDIUM} align={Flex.align.START}>
              <Heading type={Heading.types.h1} value={'Login Form'}/>
              <Username/>
              <Password/>
              <FooterWrapper/>
            </Flex>
          </Box>
        </form>
      </FormProvider>
    </Flex>
  );
}

DesignedLf.componentName = 'LoginForm'

export default DesignedLf;