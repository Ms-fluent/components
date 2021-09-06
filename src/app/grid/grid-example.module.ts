import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {GridExample} from './grid-example';
import {MsGridModule} from '../../components';

const routes: Routes = [
  {path: '', component: GridExample}
];

@NgModule({
  imports: [CommonModule, MsGridModule, RouterModule.forChild(routes)],
  declarations: [ GridExample ]
})
export class GridExampleModule {

}
