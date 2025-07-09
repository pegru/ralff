export const validateDate = (v: Date | null): string | boolean => {
  if (isNaN(v?.getTime() as number)) {
    return 'Enter date';
  }
  return true;
}

export const dateToString = (date: Date): string | undefined => {
  if (!date || isNaN(date.getDate())) {
    return undefined
  }
  return date.toISOString().split('T')[0];
}