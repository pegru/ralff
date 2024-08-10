import React from 'react';
import SavingsTable from './table/savings-table';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {SavingsFormDto} from '../../model/savings-form-dto';
import {FORM_SAVINGS} from "../../../constants";

const SavingsWrapper = () => {
  const {control} = useFormContext<SavingsFormDto>()
  const {
    fields: savingFields,
    remove,
    replace
  } = useFieldArray({
    control,
    name: FORM_SAVINGS,
    shouldUnregister: false
  });

  // React.useEffect(() => {
  //   const fieldsToConsider: Fields[] = [FORM_TITLE, FORM_START_DATE, FORM_END_DATE];
  //   const subscription = watch(async (value, info) => {
  //     const field = fieldsToConsider.find(v => v === info.name);
  //     if (!field) {
  //       return;
  //     }
  //     const otherFields = fieldsToConsider.filter(v => v !== info.name);
  //
  //     console.log('info', info);
  //
  //     let isValid = await trigger(field);
  //     let hasErrors = otherFields.some(v => getFieldState(v).error);
  //     let isDirty = otherFields.every(v => {
  //       const value = getValues(v);
  //       if (defaultValues && value === defaultValues[v]) {
  //         return false;
  //       }
  //       return true;
  //     });
  //
  //     if (isValid && isDirty && !hasErrors) {
  //       console.log('update here');
  //     }
  //   })
  //   console.log('useEffect');
  //   return () => subscription.unsubscribe();
  // }, [watch()])
  return (
    <>
      <SavingsTable fields={savingFields} remove={remove}/>
    </>
  );
};

export default SavingsWrapper;