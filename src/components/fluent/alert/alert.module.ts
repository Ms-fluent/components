import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsAlertTitle} from './alert-title';
import {MsAlert} from './alert';
import {MsAlertButton} from './alert-button';
import {MsAlertContent} from './alert-content';
import {MsAlertFooter} from './alert-footer';

@NgModule({
  imports: [CommonModule],
  declarations: [MsAlert, MsAlertButton, MsAlertContent, MsAlertFooter, MsAlertTitle ],
  exports: [MsAlert, MsAlertButton, MsAlertContent, MsAlertFooter, MsAlertTitle ]
})
export class MsAlertModule {}
