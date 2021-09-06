import {MsContextMenuItem} from './context-menu-item';
import {MsContextMenu} from './context-menu';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [CommonModule],
  declarations: [MsContextMenu, MsContextMenuItem],
  exports: [MsContextMenu, MsContextMenuItem]
})
export class MsContextMenuModule {
}
