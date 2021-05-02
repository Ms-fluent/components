import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsLoader} from './loader';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsLoader ],
  exports: [ MsLoader ]
})
export class MsLoaderModule {}
