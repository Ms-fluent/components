import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {MsPersona} from './persona';

@Component({
  selector: 'ms-icon-persona, msIconPersona, MsIconPersona',
  templateUrl: 'icon-persona.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-persona ms-icon-persona'
  }
})
export class MsIconPersona extends MsPersona {
  @Input()
  icon:string = 'Contact';

  get iconClass(): string {
    return `ms-Icon--${this.icon}`;
  }
}
