import {Directive, ElementRef, Input} from '@angular/core';
import {Assert} from '../helpers';
import {msColor} from '../core';

/**
 * Directive to set the font color of an html element.
 */
@Directive({
  selector: '[msColor]'
})
export class MsColor {
  @Input('msColor')
  get color(): msColor | string {
    return this._color;
  }

  set color(value: msColor | string) {
    this.host.classList.remove(...this.getMsColorClasses());

    if (value && value.trim() !== '') {
      value = value.trim();
      this.host.classList.add(`ms-fontColor-${value}`);
    }
    this._color = value;
  }

  private _color: msColor | string;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  getMsColorClasses(): string[] {
    const classes = Array.from(this.host.classList);
    return classes.filter(item => item.startsWith('ms-fontColor-'));
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
