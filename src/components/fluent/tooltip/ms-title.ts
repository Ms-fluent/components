import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {MsTooltip} from './tooltip';
import {MsTooltipRef} from './tooltip-ref';
import {MsTooltipOptions} from './tooltip-options';

@Directive({
  selector: '[MsTitle]',
})
export class MsTitle {
  @Input('MsTitle')
  title: string;

  private _tooltipRef: MsTooltipRef<any>;

  private _hostMouseOutEvent = (event: MouseEvent) => {
    if (event.relatedTarget !== this._tooltipRef._containerInstance.host) {
      this.close();
    }
  }

  private _containerHostMouseOutEvent = (event: MouseEvent) => {
    if (event.relatedTarget !== this.host) {
      this.close();
    }
  }

  constructor(private tooltip: MsTooltip, private elementRef: ElementRef<HTMLElement>) {

  }

  @HostListener('mouseenter')
  _mouseenter() {
    if (this._tooltipRef) {
      return;
    }
    const options = new MsTooltipOptions<any>();
    options.hasBackdrop = false;
    this._tooltipRef = this.tooltip.info(this.host, this.title, options);

    this._tooltipRef._containerInstance.host.addEventListener('mouseleave', this._containerHostMouseOutEvent);
    this.host.addEventListener('mouseleave', this._hostMouseOutEvent);
  }

  close() {
    this._tooltipRef.close();
    this.host.removeEventListener('mouseleave', this._hostMouseOutEvent);
    this._tooltipRef._containerInstance.host.removeEventListener('mouseleave', this._containerHostMouseOutEvent);
    this._tooltipRef = null;
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
