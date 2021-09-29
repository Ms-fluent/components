import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'MsActionMenuFarSection',
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    style : 'display: block'
  }
})
export class MsActionMenuFarSection {

}
