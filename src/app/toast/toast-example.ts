import {Component} from '@angular/core';
import {MsToast} from '../../components/fluent/toast';

@Component({
  templateUrl: 'toast-example.html'
})
export class ToastExample {
  constructor(private toast: MsToast) {
  }

  message: string = 'Lorem ipsum dolor si amet ergosum palator siom taget berismu';

  launch() {
    this.toast.info(this.message);
  }

  error() {
    this.toast.error(this.message);
  }

  warning() {
    this.toast.warning(this.message);
  }

  infoAlt() {
    this.toast.infoAlt(this.message);
  }
}
