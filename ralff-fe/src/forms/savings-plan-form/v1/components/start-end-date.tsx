import React from 'react';
import {Flex, TextField} from 'monday-ui-react-core';
import {useFormContext, useFormState} from 'react-hook-form';
import {FORM_END_DATE, FORM_START_DATE} from "../../../constants";

const StartEndDate = () => {
  const {register, setValue, getValues, getFieldState, trigger} = useFormContext();
  const {errors} = useFormState({name: [FORM_START_DATE, FORM_END_DATE]})

  const validateDate = (v: string): string | boolean => {
    if (!v) {
      return "Enter date"
    }
    const date = new Date(v);
    if (!date || isNaN(date.getTime())) {
      return "Enter date"
    }
    return true;
  }

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

  register(FORM_START_DATE, {
    valueAsDate: true,
    validate: validateStartDate
  });
  register(FORM_END_DATE, {
    valueAsDate: true,
    validate: validateEndDate
  });

  const dateToString = (date: Date): string | undefined => {
    if (!date || isNaN(date.getDate())) {
      return undefined
    }
    return date.toISOString().split('T')[0];
  }

  return (
    <Flex direction={Flex.directions.ROW} gap={Flex.gaps.MEDIUM} justify={Flex.justify.SPACE_BETWEEN}
          align={Flex.align.START}
          style={{width: '100%'}}>
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
      />
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
      />
    </Flex>
  );
};

export default StartEndDate;