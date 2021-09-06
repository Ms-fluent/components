import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContextMenuExample} from './context-menu-example';
import {MsContextMenuModule} from "../../components";

export const routes: Routes = [
  {path: '', component: ContextMenuExample}
];

@NgModule({
  imports: [MsContextMenuModule, RouterModule.forChild(routes) ],
  declarations:[ ContextMenuExample]
})
export class ContextMenuExampleModule {

}
