export function getIndexesOf(searchStr: string, key: string, caseSensitive: boolean): number[] {
  const searchStrLen = key.length;
  if (searchStrLen === 0) {
    return [];
  }
  let startIndex = 0;
  let index;
  const indices = [];
  if (!caseSensitive) {
    searchStr = searchStr.toLowerCase();
    key = key.toLowerCase();
  }
  // tslint:disable-next-line:no-conditional-assignment
  while ((index = searchStr.indexOf(key, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}



export function splitPreserve(value: string, key: string, caseSensitive: boolean): string[] {
  const indexes = [];

  for (const i of getIndexesOf(value, key, caseSensitive)) {
    indexes.push(i, i + key.length);
  }
  if (indexes.length === 0) {
    return [value];
  }
  const tokens = [];
  if (indexes[0] !== 0) {
    tokens.push(value.slice(0, indexes[0]));
  }

  for (const start of indexes) {
    const end = start + key.length;
    tokens.push(value.slice(start, end));
  }

  const last = indexes[indexes.length - 1];
  if (last !== value.length) {
    tokens.push(value.slice(last + 1, value.length));
  }
  return tokens;
}
