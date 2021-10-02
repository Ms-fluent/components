import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsButtonModule, MsContextMenuModule, MsDropdownModule, MsTableModule} from '../../components/fluent/public-api';
import {RouterModule, Routes} from '@angular/router';
import {TableExample} from './table-example';

const routes: Routes = [
  {path: '', component: TableExample}
];

@NgModule({
  imports: [CommonModule, MsTableModule, MsContextMenuModule, MsDropdownModule, RouterModule.forChild(routes), MsButtonModule],
  declarations: [ TableExample ]
})
export class TableExampleModule {

}
