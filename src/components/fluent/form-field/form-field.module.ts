import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsFormField} from './form-field';
import {MsInputField} from './input-field';
import {MsLabelModule} from '../label/public-api';
import {MsFloatLabel} from './float-label';
import {MsInlineFloatLabel} from './inline-float-label';
import {FormFieldContent} from './form-field-content';

@NgModule({
  imports: [CommonModule, MsLabelModule],
  declarations: [MsFormField, MsInputField, MsFloatLabel, MsInlineFloatLabel, FormFieldContent],
  exports: [MsFormField, MsInputField, MsFloatLabel, MsInlineFloatLabel, FormFieldContent]
})
export class MsFormFieldModule {
}
