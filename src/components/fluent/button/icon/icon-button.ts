import {AfterViewInit, Component, ElementRef, HostBinding, Inject, Input, OnInit, Optional} from '@angular/core';
import {MS_BUTTON_DEFAULT_OPTIONS, MsButtonDefaultOptions} from '../button-options';
import {MsButtonBase} from '../button-base';

@Component({
  templateUrl: 'icon-button.html',
  selector: 'button[msIconButton], button[ms-icon-button]',
  host: {
    'class': 'ms-iconButton',
    '[class.ms-disabled]': 'disabled',
    '[attr.type]': 'type'
  }
})
export class MsIconButton extends MsButtonBase implements AfterViewInit, OnInit {
  @Input()
  icon: string = 'Add';

  @Input()
  @HostBinding('class.rounded')
  rounded: boolean;

  constructor(_elementRef: ElementRef<HTMLButtonElement>,
              @Optional() @Inject(MS_BUTTON_DEFAULT_OPTIONS) _defaultOptions: MsButtonDefaultOptions) {
    super(_elementRef, _defaultOptions);
  }

}
