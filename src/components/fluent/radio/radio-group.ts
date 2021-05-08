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
    'class': 'ms-radio-group'
  }

})
export class MsRadioGroup implements AfterContentInit, ControlValueAccessor, OnDestroy {

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized: boolean = false;


  /** The HTML name attribute applied to radio buttons in this group. */
  private _name: string = `ms-radio-group-${nextUniqueId++}`;


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
  _radios: QueryList<MsRadio>;


  constructor(private _changeDetector: ChangeDetectorRef,
              private _elementRef: ElementRef<HTMLElement>,
              private _focusMonitor: FocusMonitor) {

  }


  ngAfterContentInit(): void {


    this._radios.forEach(item => {
      item.changeDetector.detach();
      item.change.subscribe((data) => this.change.next(data));
      item.changeDetector.detectChanges();
      item.changeDetector.reattach();
    });

    this._radios.forEach(radio => {
      radio.onactivate.subscribe(() => this.unselectOthers(radio));
    });

    this._focusMonitor.monitor(this._elementRef.nativeElement, true)
      .subscribe(() => {
        this._touch();
      });

    this._isInitialized = true;
  }


  @Input()
  get value(): any {
    return this.selected.value;
  }

  set value(_value: any) {
    if (!this._radios) {
      return;
    }

    if (!_value) {
      this._radios.forEach(item => item.checked = false);
    } else {

      const _selected = this._radios.find(item => item.value === _value);
      this.selectRadio(_selected);
    }
  }

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
    return this._radios.find(r => r.checked);
  }

  /** Whether the radio group is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(state: boolean) {
    if (this._isInitialized) {
      state = coerceBooleanProperty(state);
      this._radios.forEach(radio => radio.disabled = state);
    }
    this._disabled = state;
  }

  private _disabled: boolean = false;

  selectRadio(radio: MsRadio) {
    if (radio) {
      radio.checked = true;
    }
    this.unselectOthers(radio);
  }

  unselectOthers(radio: MsRadio) {
    const unselectedRadios = this._radios.filter(r => r !== radio);
    unselectedRadios.forEach(r => r.checked = false);
  }

  /** The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: any) => void = () => {
  };

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   * @docs-private
   */
  onTouched: () => any = () => {
  };

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this.onTouched) {
      this.onTouched();
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
    this.onTouched = fn;
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
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
