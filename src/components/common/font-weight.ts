import {Directive, ElementRef, Input} from '@angular/core';
import {msFontWeight} from '../core';

@Directive({
  selector: '[msFontWeight]',
})
export class MsFontWeight {

  @Input('msFontWeight')
  get weight(): msFontWeight {
    return this._weight;
  }

  set weight(value: msFontWeight) {
    this.host.classList.remove(...this.getMsFontWeightClasses());
    if (value) {
      this.host.classList.add(`ms-fontWeight-${value}`);
    }
    this._weight = value;
  }
  private _weight: msFontWeight;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  getMsFontWeightClasses(): string[] {
    const classes = Array.from(this.host.classList);
    return classes.filter(item => item.startsWith('ms-fontWeight-'));
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
