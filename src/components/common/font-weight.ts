import {Directive, ElementRef, Input} from '@angular/core';
import {msontWeight} from '../core';

@Directive({
  selector: '[msontWeight]',
})
export class MsontWeight {

  @Input('msontWeight')
  get weight(): msontWeight {
    return this._weight;
  }

  set weight(value: msontWeight) {
    this.host.classList.remove(...this.getMsontWeightClasses());
    if (value) {
      this.host.classList.add(`ms-fontWeight-${value}`);
    }
    this._weight = value;
  }
  private _weight: msontWeight;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  getMsontWeightClasses(): string[] {
    const classes = Array.from(this.host.classList);
    return classes.filter(item => item.startsWith('ms-fontWeight-'));
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
