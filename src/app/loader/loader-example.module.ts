import {NgModule} from '@angular/core';
import {MsButtonModule} from '../../components/fluent/button';
import {MsTooltipModule} from '../../components/fluent/tooltip';
import {LoaderExample} from './loader-example';
import {RouterModule, Routes} from '@angular/router';
import {MsLoaderModule} from '../../components/fluent/loader';

export const routes: Routes = [
  {path: '', component: LoaderExample}
];

@NgModule({
  imports: [MsButtonModule, MsLoaderModule, MsTooltipModule, RouterModule.forChild(routes)],
  declarations: [ LoaderExample]
})
export class LoaderExampleModule {

}
