import {OverlayRef} from '@angular/cdk/overlay';

let uniqueId = 0;

export class MsTooltipRef<T, R = any> {
  /** The instance of the component in the dialog. */
  componentInstance: T;

  overlayRef: OverlayRef;
  target: HTMLElement;


}
