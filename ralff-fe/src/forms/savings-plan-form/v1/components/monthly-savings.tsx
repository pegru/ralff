import React from 'react';
import {TextField} from 'monday-ui-react-core';
import {useFormContext, useFormState} from 'react-hook-form';
import {FORM_MONTHLY_SAVINGS} from "../../../constants";

const MonthlySavings = () => {
  const {register, setValue, getValues} = useFormContext();
  const {errors} = useFormState({name: FORM_MONTHLY_SAVINGS});

  register(FORM_MONTHLY_SAVINGS, {
    required: {value: true, message: 'Enter a number'},
    min: {value: 10, message: 'Minimum saving amount is 10€'},
    max: {value: 1000, message: 'Maximum saving amount is 1.000€'},
    validate: v => isNaN(+v) ? "Enter a number" : true
  })

  return (
    <TextField
      title={'Monthly savings*'}
      id={'monthly-savings'}
      type={TextField.types.NUMBER}
      placeholder={'Enter monthly savings'}
      validation={{
        status: errors?.monthlySavings ? "error" : "success",
        text: errors?.monthlySavings?.message as string ?? ''
      }}
      onChange={value => {
        setValue(FORM_MONTHLY_SAVINGS, value, {
          shouldValidate: true
        })
      }}
      value={getValues(FORM_MONTHLY_SAVINGS)}
    />
  );
};

export default MonthlySavings;