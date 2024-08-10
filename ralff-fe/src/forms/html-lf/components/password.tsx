import React from 'react';
import {FORM_PASSWORD} from '../../constants';
import {TextField} from 'monday-ui-react-core';
import {useFormContext, useWatch} from 'react-hook-form';

export interface PasswordProps {
}

const Password = ({}: PasswordProps) => {
  const {control, setValue, register} = useFormContext();
  const password = useWatch({control, name: FORM_PASSWORD});
  return (
    <TextField
      {...register(FORM_PASSWORD, {required: {value: true, message: ""}})}
      placeholder={'Enter password'}
      id={'password'}
      title={FORM_PASSWORD}
      type={TextField.types.PASSWORD}
      size={TextField.sizes.MEDIUM}
      onChange={value => setValue(FORM_PASSWORD, value, {shouldDirty: true, shouldValidate: true})}
      value={password}
    />
  );
};

export default Password;