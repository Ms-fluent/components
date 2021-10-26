import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Input, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MsRibbonMenuGroup} from './ribbon-menu-group';

@Component({
  templateUrl: 'ribbon-menu-item.html',
  selector: 'MsRibbonMenuItem, a[MsRibbonMenuItem]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-ribbon-menu-item',
    role: 'menuitem',
    '[attr.aria-tabindex]': 'tabindex()',
    '[attr.aria-haspopup]': 'hasPopUp()',
    '[attr.aria-expanded]': 'expanded()',
    '[attr.aria-selected]': '_isActive',
    '[attr.aria-controls]': 'ariaControls',
    '[class.ms-disabled]': 'disabled',
    '[class.ms-active]': '_isActive'
  }
})
export class MsRibbonMenuItem {

  @Input()
  label: string;

  @Input()
  disabled: boolean = false;

  @ContentChild(forwardRef(() => MsRibbonMenuGroup))
  group: MsRibbonMenuGroup;

  ariaControls: string = '';

  @ViewChild('iconContainer')
  _iconContainer: ElementRef<HTMLElement>;

  get iconContainer(): HTMLElement {
    return this._iconContainer.nativeElement;
  }

  _isActive: boolean = false;

  /**
   * -1 if item is inside a group.
   * 0 if item is direct ribbon child.
   */
  tabindex(): number {
    return this.disabled ? -1 : 0;
  }

  /**
   * Indicates the menuitem has a submenu.
   */
  hasPopUp(): boolean {
    return !!this.group;
  }

  /**
   * Indicates the submenu is open.
   */
  expanded(): boolean {
    return false;
  }


  @Input()
  icon: string;

  @Input()
  imageIcon: string;

  @Input()
  iconStyle: 'regular' | 'filled' = 'regular';

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }


  get iconClass(): string {
    if (!this.icon) {
      return '';
    }
    return `icon-ic_fluent_${this.icon.toLowerCase()}_24_${this.iconStyle}`
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
