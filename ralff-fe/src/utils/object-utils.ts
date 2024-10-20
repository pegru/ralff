export const hashRecord = (object: Record<string, unknown>): string => {
  const number = JSON.stringify(object)
    .split('')
    .reduce((hash, char) => {
      hash = (hash << 5) - hash + char.charCodeAt(0);
      return hash & hash; // Convert to 32-bit integer
    }, 0);
  return String(number);
}