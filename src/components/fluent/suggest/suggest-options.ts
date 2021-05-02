import {InjectionToken} from '@angular/core';

export class MsSuggestOptions {
  maxItem: number = 5;
}

export const MS_SUGGEST_DEFAULT_OPTIONS = new InjectionToken<MsSuggestOptions>('ms-suggest-default-options', {
  providedIn: 'root',
  factory: () => ({
    maxItem: 7
  })
});
