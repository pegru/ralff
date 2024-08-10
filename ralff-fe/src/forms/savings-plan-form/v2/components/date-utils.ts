export const validateDate = (v: string): string | boolean => {
  if (!v) {
    return "Enter date"
  }
  const date = new Date(v);
  if (!date || isNaN(date.getTime())) {
    return "Enter date"
  }
  return true;
}

export const dateToString = (date: Date): string | undefined => {
  if (!date || isNaN(date.getDate())) {
    return undefined
  }
  return date.toISOString().split('T')[0];
}