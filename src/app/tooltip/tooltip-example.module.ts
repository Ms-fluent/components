import {NgModule} from '@angular/core';
import {MsButtonModule} from '../../components/fluent/button/public-api';
import {MsTooltipModule} from '../../components/fluent/tooltip';
import {TooltipContentComponent, TooltipExample} from './tooltip-example';
import {RouterModule, Routes} from '@angular/router';
import {MsCommonModule} from '../../components/common';

export const routes: Routes = [
  {path: '', component: TooltipExample}
];

@NgModule({
  imports: [MsButtonModule,MsCommonModule,  MsTooltipModule, RouterModule.forChild(routes)],
  declarations: [TooltipContentComponent, TooltipExample]
})
export class TooltipExampleModule {

}
