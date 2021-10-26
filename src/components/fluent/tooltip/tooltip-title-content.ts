import {Component, Inject} from '@angular/core';
import {MS_TOOLTIP_DATA} from './tooltip-injectors';

@Component({
  template: `{{data.content}}`
})
export class MsTooltipTitleContent {

  constructor(@Inject(MS_TOOLTIP_DATA)public data) {
  }
}
