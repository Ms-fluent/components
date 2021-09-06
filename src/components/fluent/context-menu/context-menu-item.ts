import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {MsContextMenu} from './context-menu';


@Component({
  templateUrl: 'context-menu-item.html',
  selector: 'ms-context-menu-item, msContextMenuItem, MsContextMenuItem',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-contextMenuItem',
    '[attr.disabled]': 'disabled',
    '[class.ms-disabled]': 'disabled'
  }
})
export class MsContextMenuItem {
  @Input()
  icon: string;

  @Input()
  secondaryText: string;

  @Input()
  secondaryIcon: string;

  @Input()
  theme: string;

  @Input()
  disabled: boolean = false;

  constructor(private _elementRef: ElementRef<HTMLElement>,
              public menu: MsContextMenu,
              private _changeDetector: ChangeDetectorRef) {
  }
}
