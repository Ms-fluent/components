import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsRibbonMenu} from './ribbon-menu/ribbon-menu';
import {MsRibbonMenuGroup} from './ribbon-menu/ribbon-menu-group';
import {MsRibbonMenuItem} from './ribbon-menu/ribbon-menu-item';
import {MsRibbon} from './ribbon';
import {MsRibbonContent} from './ribbon-content';
import {MsRibbonContentDef} from './ribbon-content-def';
import {MsRibbonToggle} from './ribbon-toggle';

@NgModule({
  imports: [CommonModule],
  declarations: [MsRibbonToggle, MsRibbon, MsRibbonContent, MsRibbonContentDef,  MsRibbonMenu, MsRibbonMenuGroup, MsRibbonMenuItem],
  exports: [MsRibbonToggle, MsRibbon, MsRibbonContent, MsRibbonContentDef,MsRibbonMenu, MsRibbonMenuGroup, MsRibbonMenuItem]
})
export class MsRibbonModule {
}
