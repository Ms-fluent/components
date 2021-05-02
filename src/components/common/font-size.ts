import {Directive, ElementRef, Input} from '@angular/core';
import {msontSize} from '../core';

@Directive({
  selector: '[msontSize]',
})
export class MsontSize {

  @Input('msontSize')
  get size(): msontSize {
    return this._size;
  }

  set size(value: msontSize) {
    this.host.classList.remove(...this.getMsontSizeClasses());
    if (value) {
      this.host.classList.add(`ms-fontSize-${value}`);
    }
    this._size = value;
  }
  private _size: msontSize;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  getMsontSizeClasses(): string[] {
    const classes = Array.from(this.host.classList);
    return classes.filter(item => item.startsWith('ms-fontSize-'));
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
