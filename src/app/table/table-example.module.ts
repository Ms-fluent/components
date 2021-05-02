import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsTableModule} from '../../components/fluent';
import {RouterModule, Routes} from '@angular/router';
import {TableExample} from './table-example';

const routes: Routes = [
  {path: '', component: TableExample}
];

@NgModule({
  imports: [CommonModule, MsTableModule, RouterModule.forChild(routes)],
  declarations: [ TableExample ]
})
export class TableExampleModule {

}
