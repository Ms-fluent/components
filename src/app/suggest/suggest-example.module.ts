import {NgModule} from '@angular/core';
import {SuggestExample} from './suggest-example';
import {RouterModule, Routes} from '@angular/router';
import {MsButtonModule, MsFormFieldModule, MsLabelModule, MsSuggestModule} from '../../components/fluent';


export const routes: Routes = [
  {path: '', component: SuggestExample},
];

@NgModule({
  imports: [MsLabelModule, MsSuggestModule, MsFormFieldModule, MsButtonModule, RouterModule.forChild(routes)],
  declarations: [SuggestExample]
})
export class SuggestExampleModule {}
