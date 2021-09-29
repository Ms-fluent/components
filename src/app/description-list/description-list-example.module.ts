import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MsButtonModule, MsDescriptionListModule} from '../../components';
import {CommonModule} from '@angular/common';
import {DescriptionListExample} from './description-list-example';

export const routes: Routes = [
  {path: '', component: DescriptionListExample}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MsButtonModule, MsDescriptionListModule],
  declarations: [ DescriptionListExample ]
})
export class DescriptionListExampleModule {

}
