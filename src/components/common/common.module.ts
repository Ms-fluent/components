import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsColor} from './color';
import {MsBgColor} from './bg-color';
import {MsBorderColor} from './border-color';
import {MsFontWeight} from './font-weight';
import {MsFontSize} from './font-size';
import {MsMouseStay} from './mouse-stay';

@NgModule({
  imports: [ CommonModule ],
  declarations: [MsColor, MsBgColor, MsBorderColor, MsFontWeight, MsFontSize, MsMouseStay],
  exports: [MsColor, MsBgColor, MsBorderColor, MsFontWeight, MsFontSize, MsMouseStay]
})
export class MsCommonModule {}
