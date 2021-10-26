import {Directive, EventEmitter, Output, TemplateRef} from '@angular/core';

export class MsRibbonContentContext {
  constructor(public index: number, public label: string) {}
}

@Directive({
  selector: '[MsRibbonContentDef]'
})
export class MsRibbonContentDef {
  @Output()
  onCreate: EventEmitter<void>;

  @Output()
  onActivate: EventEmitter<void>;

  @Output()
  onDeactivate: EventEmitter<void>;


  constructor(public template: TemplateRef<MsRibbonContentContext>) {
  }
}
