import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import {MsActionMenuButtonBase} from './action-menu-button-base';
import {MS_ACTION_MENU_DEFAULT_OPTIONS, MsActionMenuDefaultOptions} from './action-menu-options';

@Component({
  selector: 'button[MsActionMenuIconButton]',
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
  @Input('MsActionMenuIconButton')
  icon: string = 'Add';

  constructor(_elementRef: ElementRef<HTMLButtonElement>,
              changeDetector: ChangeDetectorRef,
              @Optional() @Inject(MS_ACTION_MENU_DEFAULT_OPTIONS) _defaultOptions: MsActionMenuDefaultOptions) {
    super(_elementRef, changeDetector, _defaultOptions);
  }
}
