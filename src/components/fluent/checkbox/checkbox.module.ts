import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsCheckbox} from './checkbox';
import {MsCheckboxGroup} from './checkbox-group';

@NgModule({
  imports: [CommonModule],
  declarations: [MsCheckbox, MsCheckboxGroup],
  exports: [MsCheckbox, MsCheckboxGroup]
})
export class MsCheckboxModule {

}
