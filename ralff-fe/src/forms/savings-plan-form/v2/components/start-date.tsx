import React from 'react';
import {TextField} from 'monday-ui-react-core';
import {useFormContext, useFormState} from 'react-hook-form';
import {dateToString, validateDate} from './date-utils';
import useDisabled from '../hooks/use-disabled';
import {FORM_END_DATE, FORM_START_DATE, FORM_TITLE} from "../../../constants";

const StartDate = () => {
  const {register, setValue, getValues, getFieldState, trigger} = useFormContext();
  const {errors} = useFormState({name: [FORM_START_DATE, FORM_END_DATE]})

  const disabled = useDisabled(FORM_TITLE, FORM_START_DATE);

  const validateStartDate = (v: string): string | boolean => {
    const isStartDateValid = validateDate(v);
    if (isStartDateValid !== true) {
      return isStartDateValid;
    }
    if (getFieldState(FORM_END_DATE).isDirty) {
      trigger(FORM_END_DATE);
    }
    return true;
  }

  register(FORM_START_DATE, {
    valueAsDate: true,
    validate: validateStartDate
  });

  return (
    <TextField
      title={'Start date*'}
      id={'start-date'}
      placeholder={'Enter start date'}
      type={TextField.types.DATE}
      validation={{
        status: errors?.startDate ? 'error' : 'success',
        text: errors?.startDate?.message as string ?? ''
      }}
      onChange={value => setValue(FORM_START_DATE, new Date(value), {
        shouldValidate: true,
        shouldDirty: true
      })}
      value={dateToString(getValues(FORM_START_DATE))}
      disabled={disabled}
    />
  );
};

export default StartDate;