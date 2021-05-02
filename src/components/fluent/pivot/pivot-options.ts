import {InjectionToken} from '@angular/core';

export class MsPivotDefaultOptions {
  useRouting: boolean;
  paramName: string;
}

export const MS_PIVOT_DEFAULT_OPTIONS =
  new InjectionToken<MsPivotDefaultOptions>('ms-pivot-options', {
    providedIn: 'root',
    factory: MS_MENU_DEFAULT_OPTIONS_FACTORY
  });

/** @docs-private */
export function MS_MENU_DEFAULT_OPTIONS_FACTORY(): MsPivotDefaultOptions {
  return {
    useRouting: true,
    paramName: 'pivot'
  };
}
