import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DropdownExample} from './dropdown-example';
import {MsButtonModule, MsContextMenuModule, MsDropdownModule} from '../../components';

export const routes: Routes = [
  {path: '', component: DropdownExample}
];

@NgModule({
  imports: [MsContextMenuModule, MsDropdownModule, MsButtonModule, RouterModule.forChild(routes) ],
  declarations:[ DropdownExample]
})
export class DropdownExampleModule {

}
