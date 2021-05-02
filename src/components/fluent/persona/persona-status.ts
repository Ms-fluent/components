import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MsPersonaStatusDeclaration} from './persona-status-declaration';

@Component({
  templateUrl: 'persona-status.html',
  selector: 'MsPersonaStatus',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '["ms-persona--status", colorClass , bgColorClass ]',
    '[style.fontSize.px]': 'fontSize',
    '[style.width.px]': 'width',
    '[style.height.px]': 'width'
  }
})
export class MsPersonaStatus {
  @Input()
  statusDeclaration: MsPersonaStatusDeclaration;

  @Input()
  fontSize: number;

  @Input()
  width: number;

  get colorClass(): string {
    return 'ms-fontColor-' + this.statusDeclaration.color;
  }

  get bgColorClass(): string {
    return 'ms-bgColor-' + this.statusDeclaration.bgColor;
  }
}
