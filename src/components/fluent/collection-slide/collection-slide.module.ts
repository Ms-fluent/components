import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsCollectionSlideItemDef} from './collection-slide-item-def';
import {MsCollectionSlide} from './collection-slide';
import {MsCollectionSlideNext, MsCollectionSlidePrev} from './collection-slide-directives';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsCollectionSlideItemDef, MsCollectionSlide, MsCollectionSlideNext, MsCollectionSlidePrev ],
  exports: [ MsCollectionSlideItemDef, MsCollectionSlide, MsCollectionSlideNext, MsCollectionSlidePrev ]
})
export class MsCollectionSlideModule {

}
