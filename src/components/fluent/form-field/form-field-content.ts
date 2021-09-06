import {Component} from '@angular/core';

@Component({
  selector: 'MsFormFieldContent, ms-formFieldContent, ms-formFieldContent',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'ms-formFieldContent'
  }
})
export class FormFieldContent {}
