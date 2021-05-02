import {Directive} from '@angular/core';

@Directive({
  selector: '[ms-alert-button], [MsAlertButton]',
  host: {
    'class': 'ms-alert-button'
  }
})
export class MsAlertButton {

}
