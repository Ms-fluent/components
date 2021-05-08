import {NgModule} from '@angular/core';
import {CheckboxExample} from './checkbox-example';
import {RouterModule, Routes} from '@angular/router';
import {MsCheckboxModule} from '../../components/fluent/checkbox';
import {MsLabelModule} from '../../components/fluent/label';

export const routes: Routes = [
  {path: '', component: CheckboxExample}
];

@NgModule({
  imports: [ RouterModule.forChild(routes), MsCheckboxModule, MsLabelModule],
  declarations: [ CheckboxExample]
})
export class CheckboxExampleModule {

}
