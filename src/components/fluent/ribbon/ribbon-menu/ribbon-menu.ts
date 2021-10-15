import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  templateUrl: 'ribbon-menu.html',
  selector: 'MsRibbonMenu',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-ribbon-menu',
    role: 'menubar',
    '[attr.aria-label]': 'ariaLabel'
  }
})
export class RibbonMenu {
  @Input()
  id: string;

  @Input()
  ariaLabel: string;

  /**
   * Opens submenu and moves focus to first item in the submenu.
   */
  _spaceKeyDown() {
  }

  _enterKeyDown() {
  }

  /**
   * Opens submenu and moves focus to first item in the submenu.
   * @private
   */
  _rightArrowKeyDown() {
  }


  /**
   * Opens submenu and moves focus to last item in the submenu.
   * @private
   */
  _leftArrowKeyDown() {
  }

  /**
   * - Moves focus to the previous item in the menubar.
   * - If focus is on the first item, moves focus to the last item.
   * @private
   */
  _upArrowKeyDown() {
  }


  /**
   * - Moves focus to the next item in the menubar.
   * - If focus is on the last item, moves focus to the first item.
   * @private
   */
  _downArrowKeyDown() {
  }

  /**
   * Opens submenu and moves focus to first item in the submenu.
   * @private
   */
  _homeKeyDown() {

  }

  /**
   * Moves focus to last item in the menubar.
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

