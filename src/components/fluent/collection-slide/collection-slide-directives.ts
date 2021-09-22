import {Directive, HostListener} from '@angular/core';
import {MsCollectionSlide} from './collection-slide';

@Directive({
  selector: '[MsCollectionSlidePrev]',
  host: {
    '[class.ms-disabled]': '!slide.hasPrev()'
  }
})
export class MsCollectionSlidePrev {
  constructor(public slide: MsCollectionSlide<any>) {}

  @HostListener('click')
  click() {
    this.slide.prev();
  }
}


@Directive({
  selector: '[MsCollectionSlideNext]',
  host: {
    '[class.ms-disabled]': '!slide.hasNext()'
  }
})
export class MsCollectionSlideNext {
  constructor(public slide: MsCollectionSlide<any>) {

  }

  @HostListener('click')
  click() {
    this.slide.next();
  }
}
