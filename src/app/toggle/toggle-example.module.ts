import {NgModule} from '@angular/core';
import {ToggleExample} from './toggle-example';
import {RouterModule, Routes} from '@angular/router';
import {MsToggleModule} from '../../components/fluent';

export const routes: Routes = [
  {path: '', component: ToggleExample}
];

@NgModule({
  imports: [ RouterModule.forChild(routes), MsToggleModule],
  declarations: [ ToggleExample]
})
export class ToggleExampleModule {

}
