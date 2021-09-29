import {NgModule} from '@angular/core';
import {SelectionExample} from './selection-example';
import {RouterModule, Routes} from '@angular/router';
import {MsLabelModule, MsSelectionModule} from '../../components';
import {CommonModule} from '@angular/common';

export const routes: Routes = [
  {path: '', component: SelectionExample}
];

@NgModule({
  imports: [RouterModule.forChild(routes), MsSelectionModule, CommonModule, MsLabelModule],
  declarations: [ SelectionExample]
})
export class SelectionExampleModule {

}
