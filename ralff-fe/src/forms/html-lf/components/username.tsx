import React from 'react';
import {FORM_USERNAME} from '../../constants';
import {TextField} from 'monday-ui-react-core';
import {useFormContext, useWatch} from 'react-hook-form';

export interface UsernameProps {
}

const Username = ({}: UsernameProps) => {
  const {control, setValue, register} = useFormContext();
  const username = useWatch({control, name: FORM_USERNAME});
  return (
    <TextField
      {...register(FORM_USERNAME, {required: {value: true, message: ""}})}
      placeholder={'Enter username'}
      id={'username'}
      title={FORM_USERNAME}
      size={TextField.sizes.MEDIUM}
      onChange={value => setValue(FORM_USERNAME, value, {shouldDirty: true, shouldValidate: true})}
      value={username}
    />
  );
};

export default Username;