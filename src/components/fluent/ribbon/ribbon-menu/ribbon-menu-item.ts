import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";

@Component({
  templateUrl: 'ribbon-menu-item.html',
  selector: 'MsRibbonMenuItem',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ribbon-menu-item',
    role: 'menuitem',
    '[attr.aria-tabindex]' : 'tabindex()',
    '[attr.aria-haspopup]' : 'hasPopUp()',
    '[attr.aria-expanded]' : 'expanded()'

  }
})
export class MsRibbonMenuItem {
  /**
   * -1 if item is inside a group.
   * 0 if item is direct ribbon child.
   */
  tabindex() : number {

  }

  /**
   * Indicates the menuitem has a submenu.
   */
  hasPopUp(): boolean {}

  /**
   * Indicates the submenu is open.
   */
  expanded(): boolean {}


  @Input()
  icon: string;

  @Input()
  imageIcon: string;



}
