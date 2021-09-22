import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {MsPersona} from './persona';

@Component({
  selector: 'ms-image-persona, msImagePersona, MsImagePersona',
  templateUrl: 'image-persona.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-persona'
  }
})
export class MsImagePersona extends MsPersona {
  @Input()
  imageUrl: string;

  @Input()
  imageAlt: string = 'Persona image';
}
