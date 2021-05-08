import {InjectionToken} from '@angular/core';

export interface MsRadioDefaultOptions {
  theme: string;
}

export const MS_RADIO_DEFAULT_OPTIONS =
  new InjectionToken<MsRadioDefaultOptions>('ms-radio-default-options', {
    providedIn: 'root',
    factory: MS_RADIO_DEFAULT_OPTIONS_FACTORY
  });

export function MS_RADIO_DEFAULT_OPTIONS_FACTORY(): MsRadioDefaultOptions {
  return {
    theme: 'primary'
  };
}
