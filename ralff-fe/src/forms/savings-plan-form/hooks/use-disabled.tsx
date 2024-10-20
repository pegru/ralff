import {useFormContext, useFormState} from 'react-hook-form';
import {SavingsFormDto} from "../types/savings-form-dto.ts";

export interface UseDisabledProps<T> {
  dependencies: keyof T | (keyof T)[];
  fieldName?: keyof T | undefined | string;
}


export default function useDisabled<T = SavingsFormDto>({dependencies, fieldName = undefined}: UseDisabledProps<T>) {
  const {getFieldState} = useFormContext();
  const formState = useFormState();
  if (!Array.isArray(dependencies)) {
    dependencies = [dependencies];
  }

  if (fieldName && getFieldState(fieldName, formState).error === undefined && Object.keys(formState.errors).length > 0) {
    // checks whether another field holds error but teh current doesn't -> disable fieldName
    return true;
  }

  for (const n of dependencies) {
    const {isDirty, error} = getFieldState(n, formState);
    const isEnabled = isDirty && !error;
    // const keys = Object.keys(formState.errors);
    if (!isEnabled) {
      return true;
    }
  }
  return false;
};