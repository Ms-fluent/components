import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsActionMenu} from './action-menu';
import {MsActionMenuButton} from './action-menu-button';
import {MsActionMenuIconButton} from './action-menu-icon-button';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsActionMenu, MsActionMenuButton, MsActionMenuIconButton ],
  exports: [ MsActionMenu, MsActionMenuButton, MsActionMenuIconButton ]
})
export class MsActionMenuModule {}
