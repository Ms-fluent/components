import {Component} from '@angular/core';
import {MsToastOptions} from './toast-options';
import {MsAlertTheme} from '../alert';

@Component({
  template: `
      <MsAlert style="font-size: 14px" [theme]="theme">
          <div style="display: flex">
              <div>{{message}}</div>
              <div style="margin-left: 8px">
                  <span class="ms-Icon ms-Icon--Cancel" style="font-size: 16px; cursor: pointer" MsToastClose></span>
              </div>
          </div>
      </MsAlert>`
})
export class StringToastComponent {
  constructor(public options: MsToastOptions) {
    this.message = options.data.message;
    this.theme = options.data.theme;
  }

  message: string;
  theme: MsAlertTheme
}
