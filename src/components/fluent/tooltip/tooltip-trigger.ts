import {Directive, ElementRef, Input, TemplateRef} from '@angular/core';
import {MsTooltip} from "./tooltip";
import {MsTooltipAlign, MsTooltipPosition} from "./tooltip-options";

@Directive({
  selector: '[ms-tooltip], [MsTooltip]',
  host: {
    '(click)': '_clickEvent()'
  }
})
export class MsTooltipTrigger {

  @Input('ms-tooltip')
  _target: string | TemplateRef<any>;

  @Input('MsTooltip')
  set target(value: string | TemplateRef<any>) {
    this._target = value;
  }

  @Input()
  position: MsTooltipPosition = 'bottom';

  @Input()
  align: MsTooltipAlign = 'center';

  constructor(private elementRef: ElementRef<HTMLElement>, private tooltip: MsTooltip) {

  }

  _clickEvent() {
    this.tooltip.open(this.elementRef.nativeElement, this._target, {position: this.position, align: this.align});
  }

}
