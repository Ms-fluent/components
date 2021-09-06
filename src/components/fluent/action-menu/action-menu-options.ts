import {InjectionToken} from '@angular/core';
import {actionMenuColorThemes, MsActionMenuColorTheme} from './action-menu-theme';

export type msActionMenuSize = 'small' | 'normal';


export class MsActionMenuDefaultOptions {
  theme: string;
  rounded: boolean;
  ripple: boolean;
  size: msActionMenuSize;
  colorThemes: { [name: string]: MsActionMenuColorTheme };
}

export const MS_ACTION_MENU_DEFAULT_OPTIONS =
  new InjectionToken<MsActionMenuDefaultOptions>('ms-action-menu-default-options', {
    providedIn: 'root',
    factory: MS_ACTION_MENU_DEFAULT_OPTIONS_FACTORY
  });

export function MS_ACTION_MENU_DEFAULT_OPTIONS_FACTORY(): MsActionMenuDefaultOptions {
  return {
    theme: 'transparent',
    rounded: true,
    ripple: true,
    size: 'normal',
    colorThemes: actionMenuColorThemes
  };
}
