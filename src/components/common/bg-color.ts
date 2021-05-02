import {Directive, ElementRef, Input} from '@angular/core';
import {msColor} from '../core';
import {addMsClassName, isValidClassName, removeMsClasses} from '../helpers/className.helpers';

@Directive({
  selector: '[msBgColor]',
  exportAs: 'msBgColor'
})
export class MsBgColor {
  @Input('msBgColor')
  get bgColor(): msColor | string {
    return this._bgColor;
  }

  set bgColor(value: msColor | string) {
    removeMsClasses(this.host, 'ms-bgColor');

    if (isValidClassName(value)) {
      addMsClassName(this.host, 'ms-bgColor', value);
    }
    this._bgColor = value;
  }

  private _bgColor: msColor | string;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }


  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
