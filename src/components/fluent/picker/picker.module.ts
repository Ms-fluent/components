import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {MsPicker} from './picker';
import {MsPersonaModule} from '../persona';

@NgModule({
  imports: [ CommonModule, MsPersonaModule, OverlayModule ],
  declarations: [ MsPicker ],
  exports: [ MsPicker ]
})
export class MsPickerModule {

}
