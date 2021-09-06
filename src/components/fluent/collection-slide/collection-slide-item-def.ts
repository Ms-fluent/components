import {Directive, TemplateRef} from '@angular/core';

export class MsCollectionSlideItemContext<T> {
  constructor(public $implicit: T, public index: number) {
  }
}

@Directive({
  selector: '[MsCollectionSlideItemDef]'
})
export class MsCollectionSlideItemDef<T> {
  constructor(public template: TemplateRef<MsCollectionSlideItemContext<T>>) {
  }

}
