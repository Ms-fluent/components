import {Directive, ElementRef, Input} from '@angular/core';
import {msFontSize} from '../core';

@Directive({
  selector: '[msFontSize]',
})
export class MsFontSize {

  @Input('msFontSize')
  get size(): msFontSize {
    return this._size;
  }

  set size(value: msFontSize) {
    this.host.classList.remove(...this.getMsFontSizeClasses());
    if (value) {
      this.host.classList.add(`ms-fontSize-${value}`);
    }
    this._size = value;
  }
  private _size: msFontSize;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  getMsFontSizeClasses(): string[] {
    const classes = Array.from(this.host.classList);
    return classes.filter(item => item.startsWith('ms-fontSize-'));
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
