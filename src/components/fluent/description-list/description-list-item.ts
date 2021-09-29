import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  templateUrl: 'ms-description-item.html',
  selector: 'MsDescriptionListItem, MsDlItem',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-description-item'
  }
})
export class MsDescriptionListItem {
  @Input()
  title: string;

  @Input()
  details: string;
}
