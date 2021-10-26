import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  templateUrl: 'ribbon-menu-group.html',
  selector: 'MsRibbonMenuGroup',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-ribbon-menu-group',
    role: 'menubar',
    '[attr.aria-label]': 'ariaLabel'
  }
})
export class MsRibbonMenuGroup {
  @Input()
  ariaLabel: string;


  _getDepth(): number {
    return 1;
  }

  /**
   * Activates menu item, causing the link to be activated.
   * @private
   */
  _spaceKeyDown() {

  }

  /**
   * - Closes submenu.
   * - Moves focus to parent menubar item.
   * @private
   */
  _escapeKeyDown() {

  }


  /**
   * Moves focus to previous item in the submenu.
   * If focus is on the first item, moves focus to the last item.
   */
  upKeyDown() {
  }

  /**
   * Moves focus to the next item in the submenu.
   * If focus is on the last item, moves focus to the first item.
   * @private
   */
  _downKeyDown() {
  }

  /**
   * Moves focus to the first item in the submenu.
   * @private
   */
  _homeKeyDown() {
  }

  /**
   * Moves focus to the last item in the submenu.
   * @private
   */
  _endKeyDown() {
  }

  /**
   * - Moves focus to next item in the menubar having a name that starts with the typed character.
   * - If none of the items have a name starting with the typed character, focus does not move.
   * @param char The key pressed by the user.
   * @private
   */
  _characterKeyDown(char: string) {
  }
}
