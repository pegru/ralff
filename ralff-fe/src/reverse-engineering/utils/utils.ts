/**
 * Copied from https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript; last accessed 30.01.2024
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export function hashCode(str: string) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Copied from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript; last accessed 30.01.2024
 * creates a simple id used for temporarily comparing nodes
 * @param length
 */
export function makeID(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const nextTick = (timeout?: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}