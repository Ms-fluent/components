import {NgModule} from '@angular/core';
import {CheckboxExample} from './checkbox-example';
import {RouterModule, Routes} from '@angular/router';
import {MsCheckboxModule, MsLabelModule} from '../../components/fluent/public-api';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

export const routes: Routes = [
  {path: '', component: CheckboxExample}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MsCheckboxModule, MsLabelModule, FormsModule],
  declarations: [ CheckboxExample]
})
export class CheckboxExampleModule {

}
