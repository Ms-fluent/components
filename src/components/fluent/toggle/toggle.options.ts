/** Default `ms-toggle` options that can be overridden. */
import {InjectionToken} from '@angular/core';

// tslint:disable-next-line:no-empty-interface
export interface MsToggleDefaultOptions {
  theme: string;
  labelPosition: 'before' | 'after'
}

export const MS_SLIDE_DEFAULT_OPTIONS = new InjectionToken<MsToggleDefaultOptions>('ms-toggle-default-options', {
  providedIn: 'root',
  factory: () => ({ theme: 'blue', labelPosition: 'after' })
});
