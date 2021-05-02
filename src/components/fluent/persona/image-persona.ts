import {ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {MS_PERSONA_SIZES, MsPersonaSize, MsPersonaSizeDeclaration} from './persona-size';
import {MsPersona} from './persona';
import {MS_PERSONA_STATUS, MsPersonaStatusName, MsPersonaStatusDeclaration} from './persona-status-declaration';

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
