import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import {MsActionMenuButtonBase} from './action-menu-button-base';
import {MS_ACTION_MENU_DEFAULT_OPTIONS, MsActionMenuDefaultOptions} from './action-menu-options';

@Component({
  selector: 'button[msActionMenuButton], button[ms-actionMenuButton], button[MsActionMenuButton]',
  templateUrl: 'action-menu-button.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-action-menu-button',
    '[class.ms-disabled]': 'disabled',
    '[attr.type]': 'type'
  }
})
export class MsActionMenuButton extends MsActionMenuButtonBase{
  @Input()
  icon: string;

  constructor(elementRef: ElementRef<HTMLButtonElement>,
              changeDetector: ChangeDetectorRef,
              @Optional() @Inject(MS_ACTION_MENU_DEFAULT_OPTIONS) defaultOptions: MsActionMenuDefaultOptions) {
    super(elementRef, changeDetector, defaultOptions);
  }
}
