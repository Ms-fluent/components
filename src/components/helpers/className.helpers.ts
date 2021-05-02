import {Assert} from './assertHelpers';

export function isValidClassName(value: string): boolean {
  return !(value === null || value === undefined || typeof value !== 'string' || value.trim() === '');
}

export function addMsClassName(element: HTMLElement, prefix: string, value: string) {
  Assert.isNotNull(element);
  if (!isValidClassName(value)) {
    throw new Error('Invalid ms class value');
  }

  if (!isValidClassName(prefix)) {
    throw new Error('Invalid ms class prefix');
  }

  element.classList.add(`${prefix.trim()}-${value.trim()}`);
}


export function getMsClasses(element: HTMLElement, prefix: string): string[] {
  Assert.isNotNull(element);
  const classes = Array.from(element.classList);
  return classes.filter(item => item.startsWith(prefix + '-'));
}

export function removeMsClasses(element: HTMLElement, prefix: string) {
  Assert.isNotNull(element);
  const classes = getMsClasses(element, prefix);
  element.classList.remove(...classes);
}

export function removeMsIconClasses(element: HTMLElement) {
  Assert.isNotNull(element);
  removeMsClasses(element, 'ms-Icon-');
  element.classList.remove('ms-Icon');
}
