import {Directive, ElementRef, Input, TemplateRef} from '@angular/core';
import {MsTooltip} from './tooltip';
import {MsTooltipAlign, MsTooltipPosition, MsTooltipTriggerEvent} from './tooltip-options';

@Directive({
  selector: '[ms-tooltip], [MsTooltip]',
  host: {
    '(click)': '_clickEvent()',
    '(mouseenter)': '_mouseenterEvent()',
    '(mouseout)': '_mouseoutEvent($event)'
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

  @Input()
  triggerEvent: MsTooltipTriggerEvent = 'click';

  constructor(private elementRef: ElementRef<HTMLElement>, private tooltip: MsTooltip) {

  }

  _clickEvent() {
    if (this.triggerEvent === 'click') {
      this.tooltip.open(this.elementRef.nativeElement, this._target, {position: this.position, align: this.align, hasBackdrop: true});
    }
  }

  _mouseenterEvent() {
    if (this.triggerEvent === 'hover') {
      this.tooltip.open(this.elementRef.nativeElement, this._target, {position: this.position, align: this.align});
    }
  }

  _mouseoutEvent(event: MouseEvent) {

  }
}
