import {Directive} from '@angular/core';
import {MsToastRef} from './toast-ref';

@Directive({
  selector: '[MsToastClose]',
  host: {
    '(click)': 'close()'
  }
})
export class MsToastClose {
  constructor(private ref: MsToastRef<any>) {
  }

  close() {
    this.ref.close();
  }
}
