import React from 'react';
import {TextField} from 'monday-ui-react-core';
import {useFormContext, useFormState} from 'react-hook-form';
import useDisabled from '../hooks/use-disabled';
import {FORM_TITLE} from "../../../constants";


const Title = () => {
  const {setValue, register, getValues} = useFormContext();
  const {errors} = useFormState({name: FORM_TITLE})

  const disabled = useDisabled([], FORM_TITLE);

  register(FORM_TITLE, {
    required: {value: true, message: 'Enter Title'},
    maxLength: {value: 10, message: 'Input too long'}
  });

  return (
    <TextField
      disabled={disabled}
      title={'Title*'}
      id={'title'}
      placeholder={'Enter Title'}
      validation={{
        status: errors?.title ? 'error' : 'success',
        text: errors?.title?.message as string ?? ''
      }}
      onChange={value => setValue(FORM_TITLE, value, {
        shouldValidate: true,
        shouldDirty: true
      })}
      value={getValues(FORM_TITLE)}
    />
  );
};

export default Title;