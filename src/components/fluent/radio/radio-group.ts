import {
  AfterContentInit, ChangeDetectorRef,
  Component,
  ContentChildren, ElementRef,
  EventEmitter,
  forwardRef,
  Input, OnDestroy,
  Output,
  QueryList
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MsRadioChange, MsRadio} from './radio';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Assert} from '../../helpers';

// Increasing integer for generating unique ids for radio components.
let nextUniqueId = 0;

/**
 * Provider Expression that allows mat-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * @docs-private
 */
export const MS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsRadioGroup),
  multi: true
};

@Component({
  templateUrl: 'radio-group.html',
  selector: 'MsRadioGroup',
  providers: [MS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
  host: {
    'role': 'radiogroup',
    'class': 'ms-radio-group',
    '[class.ms-disabled]': 'disabled',
    '[attr.aria-checked]': 'ariaChecked.toString()'
  }

})
export class MsRadioGroup implements AfterContentInit, ControlValueAccessor, OnDestroy {

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized: boolean = false;


  @Input()
  /** The HTML name attribute applied to radio buttons in this group. */
  private name: string = `ms-radio-group-${nextUniqueId++}`;


  /** Whether the radio group is required. */
  private _required: boolean = false;

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).
   */
    // tslint:disable-next-line:no-output-native
  @Output() readonly change: EventEmitter<MsRadioChange> = new EventEmitter<MsRadioChange>();

  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => MsRadio), {descendants: true})
  _radioChildren: QueryList<MsRadio>;

  get radios(): MsRadio[] {
    return this._radioChildren?.toArray() || [];
  }

  private _touched: boolean = false;

  constructor(private _changeDetector: ChangeDetectorRef,
              private _elementRef: ElementRef<HTMLElement>,
              private _focusMonitor: FocusMonitor) {
    this._focusMonitor.monitor(_elementRef, false).subscribe(focusOrigin => {
      if (!focusOrigin) {
        // When a focused element becomes disabled, the browser *immediately* fires a blur event.
        // Angular does not expect events to be raised during change detection, so any state change
        // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
        // See https://github.com/angular/angular/issues/17793. To work around this, we defer
        // telling the form control it has been touched until the next tick.
        Promise.resolve().then(() => {
          this._touch();
          this._touched = true;
          _changeDetector.markForCheck();
        });
      }
    });

  }


  ngAfterContentInit(): void {
    this.radios.forEach(radio => {
      radio.onactivate.subscribe(() => {
        this._onRadioChange(radio);
      });
    });

    Promise.resolve().then(() => {
      if (this._initialValue) {
        this.value = this._initialValue;
      }
    });
    this._isInitialized = true;
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }


  @Input()
  get value(): any {
    return this.selected.value;
  }

  set value(_value: any) {
    if (!this.radios || this.radios.length === 0) {
      this._initialValue = _value;
      return;
    }

    if (!_value) {
      this.radios.forEach(item => item.checked = false);
    } else {

      const _selected = this.radios.find(item => item.value === _value);
      this.selectRadio(_selected);
    }
  }

  private _initialValue: any;

  /** Whether the radio group is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = value;
  }

  /**
   * Gets the selected radio of the group.
   */
  get selected(): MsRadio {
    return this.radios.find(r => r.checked);
  }

  get ariaChecked(): boolean {
    return !!this.selected;
  }

  /** Whether the radio group is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(state: boolean) {
    if (this._isInitialized) {
      state = coerceBooleanProperty(state);
      this.radios.forEach(radio => radio.disabled = state);
    }
    this._disabled = state;
  }

  private _disabled: boolean = false;

  _onRadioChange(radio: MsRadio) {
    this._controlValueAccessorChangeFn(radio.value);
    this.unselectOthers(radio);
    this._changeDetector.markForCheck();
    this.change.next();
  }

  selectRadio(radio: MsRadio) {
    Assert.isNotNull(radio, 'Cannot select null radio');
    if (!radio.checked) {
      radio.checked = true;
    }
    this._controlValueAccessorChangeFn(radio.value);
    this.unselectOthers(radio);
    this._changeDetector.markForCheck();
    this.change.next();
  }

  unselectOthers(radio: MsRadio) {
    const unselectedRadios = this.radios.filter(r => r !== radio);
    unselectedRadios.forEach(r => r.checked = false);
  }

  clear() {
    this.radios.forEach(r => r.checked = false);
    this._controlValueAccessorChangeFn(null);
    this._changeDetector.markForCheck();
    this.change.next();
  }

  /** The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: any) => void = () => {
  };

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   * @docs-private
   */
  _onTouched: () => any = () => {
  };

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this._onTouched) {
      this._onTouched();
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnChange(fn: any): void {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
}
