import {Directive, TemplateRef} from '@angular/core';

@Directive({
  selector: '[ms-paginatorPageDef], [msPaginatorPageDef], [MsPaginatorPageDef]'
})
export class MsPaginatorPageDef<T> {
  constructor(public template: TemplateRef<T>) {
  }
}
