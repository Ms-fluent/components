import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ToastExample} from './toast/toast-example';
import {AlertExample} from './alert/alert-example';

const routes: Routes = [
  {path: 'action-menu', loadChildren: () => import('./action-menu/action-menu-example.module').then(t => t.ActionMenuExampleModule)},
  {path: 'button', loadChildren: () => import('./button/button-example.module').then(t => t.ButtonExampleModule)},
  {path: 'form-field', loadChildren: () => import('./form-field/form-field-example.module').then(t => t.FormFieldExampleModule)},
  {path: 'label', loadChildren: () => import('./label/label-example.module').then(t => t.LabelExampleModule)},
  {path: 'toggle', loadChildren: () => import('./toggle/toggle-example.module').then(t => t.ToggleExampleModule)},
  {path: 'radio', loadChildren: () => import('./radio/radio-example.module').then(t => t.RadioExampleModule)},
  {path: 'checkbox', loadChildren: () => import('./checkbox/checkbox-example.module').then(t => t.CheckboxExampleModule)},

  {path: 'suggest', loadChildren: () => import('./suggest/suggest-example.module').then(t => t.SuggestExampleModule)},
  {path: 'picker', loadChildren: () => import('./picker/picker-example.module').then(t => t.PickerExampleModule)},
  {path: 'select', loadChildren: () => import('./select/select-example.module').then(t => t.SelectExampleModule)},

  {path: 'toast', component: ToastExample},
  {path: 'tooltip', loadChildren: () => import('./tooltip/tooltip-example.module').then(t => t.TooltipExampleModule)},
  {path: 'dialog', loadChildren: () => import('./dialog/dialog-example.module').then(t => t.DialogExampleModule)},

  {path: 'table', loadChildren: () => import('./table/table-example.module').then(t => t.TableExampleModule)},
  {path: 'paginator', loadChildren: () => import('./paginator/paginator-example.module').then(t => t.PaginatorExampleModule)},
  {path: 'grid', loadChildren: () => import('./grid/grid-example.module').then(t => t.GridExampleModule)},

  {path: 'pivot', loadChildren: () => import('./pivot/pivot-example.module').then(t => t.PivotExampleModule)},
  {path: 'dropdown', loadChildren: () => import('./dropdown/dropdown-example.module').then(t => t.DropdownExampleModule)},
  {path: 'context-menu', loadChildren: () => import('./context-menu/context-menu-example.module').then(t => t.ContextMenuExampleModule)},
  {path: 'collection-slide', loadChildren: () => import('./collection-slide/collection-slide-example.module')
      .then(t => t.CollectionSlideExampleModule)},

  {path: 'alert', component: AlertExample},
  {path: 'loader', loadChildren: () => import('./loader/loader-example.module').then(t => t.LoaderExampleModule)},
  {path: 'spinner', loadChildren: () => import('./spinner/spinner-example.module').then(t => t.SpinnerExampleModule)},
  {path: 'persona', loadChildren: () => import('./persona/persona-example.module').then(t => t.PersonaExampleModule)},
  {path: 'stepper', loadChildren: () => import('./stepper/stepper-example.module').then(t => t.StepperExampleModule)},

  {path: '', redirectTo: '/picker', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
