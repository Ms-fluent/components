import {NgModule} from '@angular/core';
import {LabelExample} from './label-example';
import {RouterModule, Routes} from '@angular/router';
import {MsLabelModule} from '../../components';

export const routes: Routes = [
  {path: '', component: LabelExample}
];

@NgModule({
  imports: [MsLabelModule, RouterModule.forChild(routes) ],
  declarations: [ LabelExample]
})
export class LabelExampleModule {

}
