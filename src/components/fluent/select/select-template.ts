import {Directive, Input, TemplateRef} from "@angular/core";

@Directive({
  selector: 'ng-template[MsfSelectTemplate]'
})
export class MsfSelectTemplate {


  constructor(public template: TemplateRef<MsfSelectTemplateContext>) { }
}


export interface MsfSelectTemplateContext {
  value?: any;
  values?: any[];
}
