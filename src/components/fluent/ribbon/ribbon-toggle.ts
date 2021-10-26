import {Directive, HostListener} from '@angular/core';
import {MsRibbon} from './ribbon';

@Directive({
  selector: '[MsRibbonToggle]',
  host: {
    class: 'ms-ribbon-toggle'
  }
})
export class MsRibbonToggle {
  constructor(private ribbon: MsRibbon) {}

  @HostListener('click')
  _onClick() {
    this.ribbon.toggle();
  }
}
