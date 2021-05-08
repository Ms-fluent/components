import {InjectionToken} from '@angular/core';

export interface MsCheckboxDefaultOptions {
  theme: string;
}

export const MS_CHECKBOX_DEFAULT_OPTIONS =
  new InjectionToken<MsCheckboxDefaultOptions>('ms-checkbox-default-options', {
    providedIn: 'root',
    factory: MS_CHECKBOX_DEFAULT_OPTIONS_FACTORY
  });

export function MS_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): MsCheckboxDefaultOptions {
  return {
    theme: 'primary'
  };
}
