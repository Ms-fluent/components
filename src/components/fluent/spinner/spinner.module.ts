import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsSpinner} from './spinner';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsSpinner ],
  exports: [ MsSpinner ]
})
export class MsSpinnerModule {}
