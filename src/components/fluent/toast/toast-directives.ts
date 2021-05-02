import {Directive} from "@angular/core";
import {MsToastRef} from "./toast-ref";

@Directive({
  selector: '[ms-toastClose],[msToastClose]',
  host: {
    '(click)': 'close()'
  }
})
export class MsToastClose {
  constructor(private ref: MsToastRef) {
  }

  close() {
    this.ref.close();
  }
}
