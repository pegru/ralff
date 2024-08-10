import React from 'react';
import {TextField} from 'monday-ui-react-core';
import {useFormContext, useFormState} from 'react-hook-form';
import {dateToString, validateDate} from './date-utils';
import useDisabled from '../hooks/use-disabled';
import {FORM_END_DATE, FORM_START_DATE, FORM_TITLE} from "../../../constants";

const EndDate = () => {
  const {register, setValue, getValues, getFieldState, trigger} = useFormContext();
  const {errors} = useFormState({name: [FORM_START_DATE, FORM_END_DATE]});

  const disabled = useDisabled([FORM_TITLE, FORM_START_DATE], FORM_END_DATE);

  const validateEndDate = (v: string): string | boolean => {
    const isEndDateValid = validateDate(v);
    if (isEndDateValid !== true) {
      return isEndDateValid;
    }
    if (errors?.startDate) {
      return true;
    }

    // validate that end > start
    // until here we know that we have two valid dates
    const startDate = new Date(getValues(FORM_START_DATE));
    const endDate = new Date(getValues(FORM_END_DATE));
    if (startDate.getTime() >= endDate.getTime()) {
      return "Date must be after start"
    }
    return true;
  }

  register(FORM_END_DATE, {
    valueAsDate: true,
    validate: validateEndDate
  });

  return (
    <TextField
      title={'End date*'}
      id={'end-date'}
      placeholder={'Enter end date'}
      type={TextField.types.DATE}
      validation={{
        status: errors?.endDate ? 'error' : 'success',
        text: errors?.endDate?.message as string ?? ''
      }}
      onChange={value => setValue(FORM_END_DATE, value, {
        shouldValidate: true,
        shouldDirty: true
      })}
      value={dateToString(getValues(FORM_END_DATE))}
      disabled={disabled}
    />
  );
};

export default EndDate;