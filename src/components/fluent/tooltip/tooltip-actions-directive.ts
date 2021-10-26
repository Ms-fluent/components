import {Directive, ElementRef, Input, OnChanges, OnInit, Optional, SimpleChanges} from '@angular/core';
import {MsTooltipRef} from './tooltip-ref';
import {MsTooltip} from './tooltip';


/**
 * Button that will close the current tooltip.
 */
@Directive({
  selector: '[MsTooltipClose]',
  exportAs: 'msTooltipClose',
  host: {
    '(click)': '_onButtonClick($event)',
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.type]': 'type',
  }
})
export class MsTooltipClose implements OnInit, OnChanges {
  /** Screenreader label for the button. */
  @Input('aria-label') ariaLabel: string;

  /** Default to "button" to prevents accidental form submits. */
  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  /** Tooltip close input. */
  @Input('MsTooltipClose') tooltipResult: any;

  constructor(
    // The tooltip title directive is always used in combination with a `MsTooltipRef`.
    // tslint:disable-next-line: lightweight-tokens
    @Optional() public tooltipRef: MsTooltipRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _tooltip: MsTooltip) {
  }

  // todo
  ngOnInit() {
    if (!this.tooltipRef) {
      // When this directive is included in a tooltip via TemplateRef (rather than being
      // in a Component), the TooltipRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the TooltipRef by
      // ID. This must occur in `onInit`, as the ID binding for the tooltip container won't
      // be resolved at constructor time.
      // this.tooltipRef = getClosestTooltip(this._elementRef, this._tooltip.openTooltips)!;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const proxiedChange = changes['MsTooltipClose'];

    if (proxiedChange) {
      this.tooltipResult = proxiedChange.currentValue;
    }
  }

  // todo
  _onButtonClick(event: MouseEvent) {
    // Determinate the focus origin using the click event, because using the FocusMonitor will
    // result in incorrect origins. Most of the time, close buttons will be auto focused in the
    // tooltip, and therefore clicking the button won't result in a focus change. This means that
    // the FocusMonitor won't detect any origin change, and will always output `program`.
    // _closeTooltipVia(this.tooltipRef,
    //   event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse', this.tooltipResult);

    this.tooltipRef.close(this.tooltipResult);
  }
}
