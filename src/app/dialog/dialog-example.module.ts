import {NgModule} from '@angular/core';
import {DialogComponent, DialogExample} from './dialog-example';
import {RouterModule, Routes} from '@angular/router';
import {MsButtonModule, MsDialogModule, MsPersonaModule} from '../../components';

export const routes: Routes = [
  {path: '', component: DialogExample}
];

@NgModule({
  imports: [MsPersonaModule, MsDialogModule, MsButtonModule, RouterModule.forChild(routes) ],
  declarations: [ DialogExample, DialogComponent ]
})
export class DialogExampleModule {

}
