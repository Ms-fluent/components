import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsDropdownTrigger} from './dropdown-trigger';
import {MsDropdown} from './dropdown';
import {OverlayModule} from "@angular/cdk/overlay";

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [MsDropdownTrigger, MsDropdownTrigger, MsDropdown],
  exports: [MsDropdownTrigger, MsDropdownTrigger, MsDropdown]
})
export class MsDropdownModule {
}
