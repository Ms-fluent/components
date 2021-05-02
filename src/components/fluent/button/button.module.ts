import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsButton} from './button/button';
import {MsIconButton} from './icon/icon-button';

@NgModule({
  imports: [CommonModule],
  declarations: [MsButton, MsIconButton],
  exports: [MsButton, MsIconButton]
})
export class MsButtonModule {
}
