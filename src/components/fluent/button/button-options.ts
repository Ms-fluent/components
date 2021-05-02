import {InjectionToken} from '@angular/core';
import {colorThemes, MsButtonColorTheme} from './button-theme';

export type msButtonSize = 'small' | 'normal';

export class MsButtonDefaultOptions {
  theme: string;
  rounded: boolean;
  ripple: boolean;
  size: msButtonSize;
  colorThemes: { [name: string]: MsButtonColorTheme };
}

export const MS_BUTTON_DEFAULT_OPTIONS =
  new InjectionToken<MsButtonDefaultOptions>('ms-button-default-options', {
    providedIn: 'root',
    factory: MS_BUTTON_DEFAULT_OPTIONS_FACTORY
  });

export function MS_BUTTON_DEFAULT_OPTIONS_FACTORY(): MsButtonDefaultOptions {
  return {
    theme: 'standard',
    rounded: true,
    ripple: true,
    size: 'small',
    colorThemes
  };
}
