import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {CanDisable, CanDisableCtor, mixinDisabled} from '../../core/common-behaviors';


class MsSelectOptionGroupBase {
}

const _MsfSelectOptionGroupMixinBase: CanDisableCtor & MsSelectOptionGroupBase = mixinDisabled(MsSelectOptionGroupBase);

let _uniqueId = 0;

@Component({
  selector: 'MsSelectOptionGroup, ms-select-option-group',

  template: `
      <label class="ms-select-optionGroup-label" [id]="_labelId">{{ label }}
          <ng-content></ng-content>
      </label>
      <ng-content select="MsSelectOption, ms-select-option, ng-container"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: ['disabled'],
  host: {
    'class': 'ms-select-optionGroup',
    'role': 'group',
    '[class.ms-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-labelledby]': '_labelId',
  }

})
export class MsSelectOptionGroup extends _MsfSelectOptionGroupMixinBase implements CanDisable {
  /** Unique id for the underlying label. */
  _labelId: string = `msf-select-optionGroup-label-${_uniqueId++}`;

  /** Label for the option group. */
  @Input() label: string;

}
