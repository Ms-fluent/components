import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ToastExample} from './toast/toast-example';
import {AlertExample} from './alert/alert-example';

const routes: Routes = [
  {path: 'toast', component: ToastExample},
  {path: 'alert', component: AlertExample},
  {path: 'tooltip', loadChildren: () => import('./tooltip/tooltip-example.module').then(t => t.TooltipExampleModule)},
  {path: 'loader', loadChildren: () => import('./loader/loader-example.module').then(t => t.LoaderExampleModule)},
  {path: 'form-field', loadChildren: () => import('./form-field/form-field-example.module').then(t => t.FormFieldExampleModule)},
  {path: 'label', loadChildren: () => import('./label/label-example.module').then(t => t.LabelExampleModule)},
  {path: 'table', loadChildren: () => import('./table/table-example.module').then(t => t.TableExampleModule)},
  {path: 'paginator', loadChildren: () => import('./paginator/paginator-example.module').then(t => t.PaginatorExampleModule)},
  {path: 'pivot', loadChildren: () => import('./pivot/pivot-example.module').then(t => t.PivotExampleModule)},
  {path: 'stepper', loadChildren: () => import('./stepper/stepper-example.module').then(t => t.StepperExampleModule)},
  {path: 'toggle', loadChildren: () => import('./toggle/toggle-example.module').then(t => t.ToggleExampleModule)},
  {path: 'suggest', loadChildren: () => import('./suggest/suggest-example.module').then(t => t.SuggestExampleModule)},
  {path: 'persona', loadChildren: () => import('./persona/persona-example.module').then(t => t.PersonaExampleModule)},
  {path: '', redirectTo: '/suggest', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
