import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsToast} from './toast';
import {StringToastComponent} from './string-toast-component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {MsToastClose} from './toast-directives';
import {MsToastContainer} from './toast-container';
import {MsAlertModule} from '../alert';

@NgModule({
  imports: [CommonModule, MsAlertModule, OverlayModule, PortalModule],
  providers: [MsToast],
  exports: [
    MsToastClose
  ],
  declarations: [StringToastComponent, MsToastClose, MsToastContainer]
})
export class MsToastModule {

}
