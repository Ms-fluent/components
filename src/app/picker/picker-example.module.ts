import {NgModule} from '@angular/core';
import {PickerExample} from './picker-example';
import {RouterModule, Routes} from '@angular/router';
import {MsCheckboxModule, MsLabelModule, MsPickerModule} from '../../components/fluent/public-api';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

export const routes: Routes = [
  {path: '', component: PickerExample}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MsPickerModule, MsCheckboxModule, MsLabelModule, FormsModule, ],
  declarations: [ PickerExample]
})
export class PickerExampleModule {

}
