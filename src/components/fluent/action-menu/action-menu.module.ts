import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsActionMenu} from './action-menu';
import {MsActionMenuButton} from './action-menu-button';
import {MsActionMenuIconButton} from './action-menu-icon-button';
import {MsActionMenuFarSection} from './action-menu-far-section';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsActionMenu, MsActionMenuButton, MsActionMenuIconButton, MsActionMenuFarSection ],
  exports: [ MsActionMenu, MsActionMenuButton, MsActionMenuIconButton, MsActionMenuFarSection ]
})
export class MsActionMenuModule {}
