import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MsCommonModule} from '../components/common';
import {ToastExample} from './toast/toast-example';
import {MsToastModule} from '../components/fluent/toast';
import {MsAlertModule} from '../components/fluent/alert';
import {AlertExample} from './alert/alert-example';

@NgModule({
  declarations: [
    AppComponent, ToastExample, AlertExample
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsCommonModule,
    MsToastModule,
    MsAlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
