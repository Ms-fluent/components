import {InjectionToken} from '@angular/core';

export class MsCollectionSlideDefaultOptions {
  motion: string;
  width?: string;
  height?: string;
}

export const MS_COLLECTION_SLIDE_DEFAULT_OPTIONS = new InjectionToken('MsCollectionSlideDefaultOptions', {
  providedIn: 'root',
  factory: MS_COLLECTION_SLIDE_DEFAULT_OPTIONS_FACTORY
});

export function MS_COLLECTION_SLIDE_DEFAULT_OPTIONS_FACTORY(): MsCollectionSlideDefaultOptions {
  return {
    motion: 'ease-in-out'
  };
}
