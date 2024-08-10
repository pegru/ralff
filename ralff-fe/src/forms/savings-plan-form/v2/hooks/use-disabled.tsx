import {useFormContext, useFormState} from 'react-hook-form';

export default function useDisabled(dependencies: string | string[], n: string | undefined = undefined) {
  const {getFieldState} = useFormContext();
  const formState = useFormState();
  if (!Array.isArray(dependencies)) {
    dependencies = [dependencies];
  }

  if (n && getFieldState(n, formState).error === undefined && Object.keys(formState.errors).length > 0) {
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