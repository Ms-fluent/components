import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MsPivotModule} from '../../components/fluent/pivot';
import {PivotExample} from './pivot-example';

const routes: Routes = [
  {path: '', component: PivotExample}
];

@NgModule({
  imports: [CommonModule, MsPivotModule, RouterModule.forChild(routes)],
  declarations: [ PivotExample ]
})
export class PivotExampleModule {

}
