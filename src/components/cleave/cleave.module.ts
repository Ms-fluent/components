import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsCleaveDateMaskDirective} from './date-input.directive';
import {MsCleaveLocalTimeMaskDirective} from './local-time.directive';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsCleaveDateMaskDirective, MsCleaveLocalTimeMaskDirective ],
  exports: [ MsCleaveDateMaskDirective, MsCleaveLocalTimeMaskDirective ]
})
export class MsCleaveModule {

}
