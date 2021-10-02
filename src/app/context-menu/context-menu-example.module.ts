import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContextMenuExample} from './context-menu-example';
import {MsContextMenuModule} from '../../components';
import {CommonModule} from '@angular/common';

export const routes: Routes = [
  {path: '', component: ContextMenuExample}
];

@NgModule({
  imports: [MsContextMenuModule, RouterModule.forChild(routes), CommonModule],
  declarations:[ ContextMenuExample]
})
export class ContextMenuExampleModule {

}
