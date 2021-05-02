import {ChangeDetectionStrategy, Component, ElementRef, HostBinding, Inject, Input, Optional, ViewEncapsulation} from '@angular/core';
import {MsActionMenuButtonBase} from './action-menu-button-base';
import {MS_ACTION_MENU_DEFAULT_OPTIONS, MsActionMenuDefaultOptions} from './action-menu-options';

@Component({
  selector: 'button[msActionMenuIconButton], button[ms-actionMenuIconButton]',
  templateUrl: 'action-menu-icon-button.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-action-menu-iconButton',
    '[class.ms-disabled]': 'disabled',
    '[attr.type]': 'type'
  }
})
export class MsActionMenuIconButton extends MsActionMenuButtonBase{
  @Input()
  icon: string = 'Add';

  @Input()
  @HostBinding('class.rounded')
  rounded: boolean;

  constructor(_elementRef: ElementRef<HTMLButtonElement>,
              @Optional() @Inject(MS_ACTION_MENU_DEFAULT_OPTIONS) _defaultOptions: MsActionMenuDefaultOptions) {
    super(_elementRef, _defaultOptions);
  }
}
