import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import {MS_BUTTON_DEFAULT_OPTIONS, MsButtonDefaultOptions} from '../button-options';
import {MsButtonBase} from '../button-base';

@Component({
  selector: 'button[msButton], button[ms-button]',
  templateUrl: 'button.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-button',
    '[class.ms-disabled]': 'disabled',
    '[attr.type]': 'type'
  }
})
export class MsButton extends MsButtonBase {
  @Input()
  icon: string;

  constructor(_elementRef: ElementRef<HTMLButtonElement>,
              @Optional() @Inject(MS_BUTTON_DEFAULT_OPTIONS) _defaultOptions: MsButtonDefaultOptions) {
    super(_elementRef, _defaultOptions);
  }

}
