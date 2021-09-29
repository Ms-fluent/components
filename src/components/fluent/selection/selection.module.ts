import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsSelectionToggle} from './selection-toggle';
import {MsSelection} from './selection';

@NgModule({
  imports: [CommonModule],
  exports: [
    MsSelectionToggle,
    MsSelection
  ],
  declarations: [MsSelectionToggle, MsSelection]
})
export class MsSelectionModule {

}
