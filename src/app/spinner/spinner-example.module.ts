import {NgModule} from '@angular/core';
import {MsButtonModule, MsSpinnerModule} from '../../components';
import {MsTooltipModule} from '../../components/fluent/tooltip';
import {SpinnerExample} from './spinner-example';
import {RouterModule, Routes} from '@angular/router';
import {MsLoaderModule} from '../../components/fluent/loader';

export const routes: Routes = [
  {path: '', component: SpinnerExample}
];

@NgModule({
  imports: [MsButtonModule, MsLoaderModule, MsTooltipModule, RouterModule.forChild(routes), MsSpinnerModule],
  declarations: [ SpinnerExample]
})
export class SpinnerExampleModule {

}
