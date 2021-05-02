import {OverlayRef} from '@angular/cdk/overlay';
import {MsToast} from './toast';

export class MsToastRef {
  overlayRef: OverlayRef;

  y: number=0;

  constructor(private toast: MsToast) {
  }

  close() {
    this.toast.close(this);
  }
}
