import {Directive, ElementRef, Input} from '@angular/core';
import {msColor} from '../core';

@Directive({
  selector: '[msBorderColor]',
  exportAs: 'msBorderColor'
})
export class MsBorderColor {
  @Input('msBorderColor')
  get borderColor(): msColor | string {
    return this._borderColor;
  }

  set borderColor(value: msColor | string) {
    this.host.classList.remove(...this.getMsBorderColorClasses());

    if (value && value.trim() !== '') {
      value = value.trim();
      this.host.classList.add(`ms-borderColor-${value}`);
    }
    this._borderColor = value;
  }

  private _borderColor: msColor | string;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  getMsBorderColorClasses(): string[] {
    const classes = Array.from(this.host.classList);
    return classes.filter(item => item.startsWith('ms-borderColor-'));
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
