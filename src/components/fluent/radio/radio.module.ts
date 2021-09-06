import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsRadioGroup} from './radio-group';
import {MsRadio} from './radio';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  declarations: [ MsRadio, MsRadioGroup ],
  exports: [ MsRadio, MsRadioGroup ]
})
export class MsRadioModule {}
