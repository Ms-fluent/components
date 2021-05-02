import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsFormField} from './form-field';
import {MsInputField} from './input-field';
import {MsLabelModule} from '../label';
import {MsFloatLabel} from './float-label';
import {MsInlineFloatLabel} from './inline-float-label';

@NgModule({
  imports: [CommonModule, MsLabelModule],
  declarations: [MsFormField, MsInputField, MsFloatLabel, MsInlineFloatLabel],
  exports: [MsFormField, MsInputField, MsFloatLabel, MsInlineFloatLabel]
})
export class MsFormFieldModule {
}
