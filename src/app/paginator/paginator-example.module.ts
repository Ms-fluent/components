import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsPaginatorModule, MsTableModule} from '../../components/fluent/public-api';
import {RouterModule, Routes} from '@angular/router';
import {PaginatorExample} from './paginator-example';

const routes: Routes = [
  {path: '', component: PaginatorExample}
];

@NgModule({
  imports: [CommonModule, MsPaginatorModule, MsTableModule, RouterModule.forChild(routes)],
  declarations: [ PaginatorExample ]
})
export class PaginatorExampleModule {

}
