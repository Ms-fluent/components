import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MsToggle} from './toggle';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [MsToggle],
  exports: [MsToggle]
})
export class MsToggleModule {}
