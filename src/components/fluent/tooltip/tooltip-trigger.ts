import {Directive, ElementRef, Input, TemplateRef} from '@angular/core';
import {MsTooltip} from './tooltip';
import {MsTooltipAlign, MsTooltipPosition, MsTooltipTriggerEvent} from './tooltip-options';

@Directive({
  selector: '[MsTooltip]',
  host: {
    '(click)': '_clickEvent()',
    '(mouseenter)': '_mouseenterEvent()',
    '(mouseout)': '_mouseoutEvent($event)'
  }
})
export class MsTooltipTrigger {

  @Input('MsTooltip')
  _target: TemplateRef<any>;

  @Input()
  position: MsTooltipPosition = 'bottom';

  @Input()
  align: MsTooltipAlign = 'center';

  @Input()
  triggerEvent: MsTooltipTriggerEvent = 'hover';

  @Input()
  data: any;

  constructor(private elementRef: ElementRef<HTMLElement>, private tooltip: MsTooltip) {

  }

  _clickEvent() {
    if (this.triggerEvent === 'click') {
      this.tooltip.open(this._target, this.elementRef.nativeElement, {
        position: this.position,
        align: this.align,
        hasBackdrop: true
      });
    }
  }

  _mouseenterEvent() {
    if (this.triggerEvent === 'hover') {
      this.tooltip.open(this._target, this.elementRef.nativeElement, {position: this.position, align: this.align});
    }
  }

  _mouseoutEvent(event: MouseEvent) {

  }
}
