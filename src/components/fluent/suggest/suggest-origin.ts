import {Directive, ElementRef} from '@angular/core';
import {MsSuggest} from './suggest';

@Directive({
  selector: 'input[ms-suggest-origin], input[msSuggestOrigin], input[MsSuggestOrigin]',
})
export class MsSuggestOrigin {
  constructor(private _elementRef: ElementRef<HTMLInputElement>) {
  }

  get host(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }
}
