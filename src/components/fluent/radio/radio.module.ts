import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsRadioGroup} from './radio-group';
import {MsRadio} from './radio';


@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsRadio, MsRadioGroup ],
  exports: [ MsRadio, MsRadioGroup ]
})
export class MsRadioModule {}
