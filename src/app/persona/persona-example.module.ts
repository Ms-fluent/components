import {NgModule} from '@angular/core';
import {PersonaExample} from './persona-example';
import {RouterModule, Routes} from '@angular/router';
import {MsPersonaModule} from '../../components/fluent/public-api';

export const routes: Routes = [
  {path: '', component: PersonaExample}
];

@NgModule({
  imports: [MsPersonaModule, RouterModule.forChild(routes) ],
  declarations: [ PersonaExample]
})
export class PersonaExampleModule {

}
