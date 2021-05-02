import {Component} from '@angular/core';
import {MsToast} from '../../components/fluent/toast/toast';

@Component({
  templateUrl: 'toast-example.html'
})
export class ToastExample {
  constructor(private toast: MsToast) {
  }

  launch() {
    this.toast.launch('My first toast items!')
  }
}
