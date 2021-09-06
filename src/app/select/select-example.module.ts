import {NgModule} from '@angular/core';
import {SelectExample} from './select-example';
import {RouterModule, Routes} from '@angular/router';
import {MsCheckboxModule, MsLabelModule, MsSelectModule} from '../../components/fluent/public-api';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

export const routes: Routes = [
  {path: '', component: SelectExample}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MsSelectModule, MsCheckboxModule, MsLabelModule, FormsModule ],
  declarations: [ SelectExample]
})
export class SelectExampleModule {

}
