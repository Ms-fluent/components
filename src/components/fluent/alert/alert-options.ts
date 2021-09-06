import {MS_ALERT_THEME_DECLARATIONS, MsAlertTheme, MsAlertThemeDeclaration} from './alert-theme';
import {InjectionToken} from '@angular/core';


export type msAlertDisplay = 'inline-block' | 'inline' | 'block';

export const MS_ALERT_DEFAULT_ICON = 'Info';


export class MsAlertOptions {
  themeDeclarations: Map<string, MsAlertThemeDeclaration>;
  theme: MsAlertTheme;
}

export const MS_ALERT_DEFAULT_OPTIONS =
  new InjectionToken<MsAlertOptions>('ms-alert-options', {
    providedIn: 'root',
    factory: MS_ALERT_OPTIONS_FACTORY
  });

/** @docs-private */
export function MS_ALERT_OPTIONS_FACTORY(): MsAlertOptions {
  return {
    themeDeclarations: new Map<string, MsAlertThemeDeclaration>(MS_ALERT_THEME_DECLARATIONS),
    theme: 'standardDarkAlt'
  };
}
