import {NgModule} from '@angular/core';
import {ButtonExample} from './button-example';
import {RouterModule, Routes} from '@angular/router';
import {MsButtonModule} from '../../components';
import {CommonModule} from '@angular/common';

export const routes: Routes = [
  {path: '', component: ButtonExample}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MsButtonModule],
  declarations: [ ButtonExample]
})
export class ButtonExampleModule {

}
