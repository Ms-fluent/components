import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {MsPersona} from './persona';

@Component({
  selector: 'ms-text-persona, msTextPersona, MsTextPersona',
  templateUrl: 'text-persona.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-persona ms-text-persona'
  }
})
export class MsTextPersona extends MsPersona {
  @Input()
  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value.trim();
    const initial = value.trim().split(' ')
      .map(s => s.trim()[0].toUpperCase()).join('');

    if (initial.length === 1) {
      this.initialText = initial[0];
    } else if (initial.length > 1) {
      this.initialText = initial.slice(0, 2);
    }
  }
  private _text: string;

  @Input()
  initialText: string;


}
