import {Directive, TemplateRef} from '@angular/core';


export class MsSuggestPanelContext<T> {
  items: Array<T>;
}


@Directive({
  selector: '[ms-suggest-panel-def], [msSuggestPanelDef], [MsSuggestPanelDef]'
})
export class MsSuggestPanelDef<T> {
  constructor(private _templateRef: TemplateRef<MsSuggestPanelContext<T>>) {
  }

}
