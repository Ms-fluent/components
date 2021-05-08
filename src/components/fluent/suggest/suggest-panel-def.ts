import {Directive, TemplateRef} from '@angular/core';


export class MsSuggestPanelContext<T> {
  constructor(public $implicit: T[], public keyword: string) {
  }

  get items(): Array<T> {
    return this.$implicit;
  }
}


@Directive({
  selector: '[ms-suggest-panel-def], [msSuggestPanelDef], [MsSuggestPanelDef]'
})
export class MsSuggestPanelDef<T> {
  constructor(public template: TemplateRef<MsSuggestPanelContext<T>>) {
  }
}
