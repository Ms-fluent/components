import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RibbonMenuExample} from './ribbon-menu-example';
import {MsRibbonModule} from '../../components';
import {CommonModule} from '@angular/common';

export const routes: Routes = [
  {path: '', component: RibbonMenuExample}
];

@NgModule({
  imports: [MsRibbonModule, RouterModule.forChild(routes), CommonModule],
  declarations:[ RibbonMenuExample]
})
export class RibbonMenuExampleModule {

}
