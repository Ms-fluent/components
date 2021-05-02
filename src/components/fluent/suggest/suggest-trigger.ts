import {Directive, HostBinding, HostListener} from '@angular/core';
import {MsSuggest} from './suggest';

@Directive({
  selector: '[ms-suggest-trigger], [msSuggestTrigger], [MsSuggestTrigger]',
})
export class MsSuggestTrigger {
  constructor(private suggest: MsSuggest<any>) {
    if(!suggest) {
      throw new Error('The MsSuggestTrigger must be inside a MsSuggest.');
    }
  }

  @HostListener('click')
  _onclick() {
    this.suggest?.toggle();
  }
}
