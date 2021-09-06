import {NgModule} from '@angular/core';
import {RadioExample} from './radio-example';
import {RouterModule, Routes} from '@angular/router';
import {MsRadioModule, MsLabelModule, MsCheckboxModule} from '../../components/fluent/public-api';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

export const routes: Routes = [
  {path: '', component: RadioExample}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MsRadioModule, MsLabelModule, FormsModule, MsCheckboxModule],
  declarations: [ RadioExample]
})
export class RadioExampleModule {

}
