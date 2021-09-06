import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceArray, coerceBooleanProperty} from '@angular/cdk/coercion';
import {MsCheckbox} from './checkbox';


// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

/**
 * Provider Expression that allows mat-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * @docs-private
 */
export const MS_CHECKBOX_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsCheckboxGroup),
  multi: true
};

@Component({
  templateUrl: 'checkbox-group.html',
  selector: 'MsCheckboxGroup',
  providers: [MS_CHECKBOX_GROUP_CONTROL_VALUE_ACCESSOR],
  host: {
    'role': 'checkboxgroup',
    'class': 'ms-checkbox-group',
    'tabindex': '0',
    '[class.ms-disabled]': 'disabled',
  }
})
export class MsCheckboxGroup implements AfterContentInit, ControlValueAccessor, OnDestroy {

  /** Whether the component is initialized. */
  private _isInitialized: boolean = false;

  private _uniqueId: string = `ms-checkbox-group-${nextUniqueId++}`;

  @Input()
  id: string = this._uniqueId;

  @Input()
  get checked(): boolean {
    return this.checkboxes?.every(c => c.checked) || false;
  }

  set checked(value: boolean) {
    value = coerceBooleanProperty(value);
    if (value) {
      this.selectAll();
    } else {
      this.unselectAll();
    }
  }

  /** Whether the radio group is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(state: boolean) {
    state = coerceBooleanProperty(state);
    if (this._isInitialized) {
      this._checkboxChildren.forEach(item => item.disabled = state);
    }

    this._disabled = state;
    this._changeDetector.markForCheck();
  }

  private _disabled: boolean = false;

  @Input()
  set values(values: any[]) {
    values = coerceArray(values);
    this._rawValues = values;
    if (this._checkboxChildren) {
      this._checkboxChildren.forEach(item => item.checked = values.indexOf(item.value) > -1);
    }
  }

  get values(): Array<any> {
    return this.checkboxes.filter(item => item.checked).map(item => item.value);
  }

  private _rawValues: any[];


  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a checkbox button (the same behavior as `<input type-"checkbox">`).
   */
    // tslint:disable-next-line:no-output-native
  @Output() readonly change: EventEmitter<MsCheckboxGroup> = new EventEmitter<MsCheckboxGroup>();

  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => MsCheckbox), {descendants: true})
  _checkboxChildren: QueryList<MsCheckbox>;

  get checkboxes(): Array<MsCheckbox> {
    return this._checkboxChildren?.toArray() || [];
  }


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
          _changeDetector.markForCheck();
        });
      }
    });
  }


  ngAfterContentInit(): void {
    this._checkboxChildren.forEach(item => {
      item.change.subscribe(() => {
        this._controlValueAccessorChangeFn(this.values);
        this.change.next(this);
      });
    });
    this._isInitialized = true;

    Promise.resolve().then(() => this.values = this._rawValues);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }


  get selected(): Array<MsCheckbox> {
    return this.checkboxes.filter(f => f.checked);
  }


  get ariaChecked(): 'true' | 'false' | 'mixed' {
    return this.checked ? 'true' : (this.indeterminate ? 'mixed' : 'false');
  }


  get indeterminate(): boolean {
    return this.checkboxes.some(c => c.checked) && this.checkboxes.some(c => !c.checked);
  }

  selectAll(): void {
    this.checkboxes.forEach(c => c.checked = true);
    this._controlValueAccessorChangeFn(this.values);
    this.change.emit();
  }

  unselectAll(): void {
    this.checkboxes.forEach(c => c.checked = false);
    this._controlValueAccessorChangeFn(this.values);
    this.change.emit();
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
    this.values = coerceArray(obj);
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

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
}
