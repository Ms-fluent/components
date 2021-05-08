import {NgModule} from '@angular/core';
import {RadioExample} from './radio-example';
import {RouterModule, Routes} from '@angular/router';
import {MsRadioModule} from '../../components/fluent/radio';

export const routes: Routes = [
  {path: '', component: RadioExample}
];

@NgModule({
  imports: [ RouterModule.forChild(routes), MsRadioModule],
  declarations: [ RadioExample]
})
export class RadioExampleModule {

}
