import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MsStepperModule} from '../../components/fluent/public-api';
import {StepperExample} from './stepper-example';

const routes: Routes = [
  {path: '', component: StepperExample}
];

@NgModule({
  imports: [CommonModule, MsStepperModule, RouterModule.forChild(routes)],
  declarations: [ StepperExample ]
})
export class StepperExampleModule {

}
