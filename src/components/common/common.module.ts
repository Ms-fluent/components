import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsColor} from './color';
import {MsBgColor} from './bg-color';
import {MsBorderColor} from './border-color';
import {MsontWeight} from './font-weight';
import {MsontSize} from './font-size';

@NgModule({
  imports: [ CommonModule ],
  declarations: [MsColor, MsBgColor, MsBorderColor, MsontWeight, MsontSize],
  exports: [MsColor, MsBgColor, MsBorderColor, MsontWeight, MsontSize]
})
export class MsCommonModule {}
