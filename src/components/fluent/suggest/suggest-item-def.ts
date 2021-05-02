import {Directive, TemplateRef} from '@angular/core';


export class MsSuggestItemContext<T> {
  value: T;
}


@Directive({
  selector: '[ms-suggest-item-def], [msSuggestItemDef], [MsSuggestItemDef]'
})
export class MsSuggestItemDef<T> {
  constructor(private _templateRef: TemplateRef<MsSuggestItemContext<T>>) {
  }

}
