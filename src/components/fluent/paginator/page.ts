import {EmbeddedViewRef} from '@angular/core';

export class MsPaginatorPage<T> {
  /** The index of this page. */
  index: number;

  /** Items data injected in the page. */
  items: Array<T>;

  /*** Index of the page that was selected previously.*/
  previousPageIndex?: number;

  /** The current page size */
  size: number;

  start: number;

  viewRef: EmbeddedViewRef<MsPaginatorPage<T>>;

  /** The current total number of items being paged */
  get length(): number {
    return this.items.length;
  }

  get end(): number {
    return this.start + this.items.length - 1;
  }
}
