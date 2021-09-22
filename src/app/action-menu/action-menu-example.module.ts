import {NgModule} from '@angular/core';
import {ActionMenuExample} from './action-menu-example';
import {RouterModule, Routes} from '@angular/router';
import {MsActionMenuModule} from '../../components';
import {CommonModule} from '@angular/common';

export const routes: Routes = [
  {path: '', component: ActionMenuExample}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MsActionMenuModule ],
  declarations: [ ActionMenuExample]
})
export class ActionMenuExampleModule {

}
