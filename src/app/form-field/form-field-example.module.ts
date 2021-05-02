import {NgModule} from '@angular/core';
import {MsFormFieldModule} from '../../components/fluent/form-field';
import {RouterModule, Routes} from '@angular/router';
import {FormFieldExample} from './form-field-example';
import {MsLabelModule} from "../../components/fluent/label";

export const routes: Routes = [
  {path: '', component: FormFieldExample}
];

@NgModule({
  imports: [MsFormFieldModule, RouterModule.forChild(routes), MsLabelModule],
  declarations:[ FormFieldExample]
})
export class FormFieldExampleModule {

}
