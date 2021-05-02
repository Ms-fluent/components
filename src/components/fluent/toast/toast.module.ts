import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsToast} from './toast';
import {StringToastComponent} from './string-toast-component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {MsToastClose} from './toast-directives';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule],
  providers: [MsToast],
  declarations: [StringToastComponent, MsToastClose]
})
export class MsToastModule {

}
