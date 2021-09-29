import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
  templateUrl: 'action-menu.html',
  selector: 'ms-actionMenu, msActionMenu, MsActionMenu',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-action-menu'
  }
})
export class MsActionMenu {

}
