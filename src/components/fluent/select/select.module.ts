import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsSelect} from './select';
import {MsSelectOption} from './select-option';
import {OverlayModule} from '@angular/cdk/overlay';
import {MsSelectOptionGroup} from './select-option-group';
import {MsfSelectTemplate} from './select-template';
import {MSF_SELECT_SCROLL_STRATEGY_PROVIDER} from './select-scroll-strategy';
import {MsfSelectOptionCheckbox} from './select-option-checkbox';
import {MsCheckboxModule} from '../checkbox/public-api';

@NgModule({
  imports: [CommonModule, MsCheckboxModule, OverlayModule],
  declarations: [MsSelect, MsSelectOption, MsSelectOptionGroup, MsfSelectTemplate, MsfSelectOptionCheckbox],
  exports: [MsSelect, MsSelectOption, MsSelectOptionGroup, MsfSelectTemplate, MsfSelectOptionCheckbox],
  providers: [MSF_SELECT_SCROLL_STRATEGY_PROVIDER]
})
export class MsSelectModule {
}
