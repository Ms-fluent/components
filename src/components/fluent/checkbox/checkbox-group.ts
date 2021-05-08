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
    '[class.ms-disabled]': 'disabled'
  }
})
export class MsCheckboxGroup implements AfterContentInit, ControlValueAccessor, OnDestroy {

  /** Whether the component is initialized. */
  private _isInitialized: boolean = false;

  private _uniqueId: string = `ms-checkbox-group-${nextUniqueId++}`;


  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a checkbox button (the same behavior as `<input type-"checkbox">`).
   */
  @Output() readonly change: EventEmitter<MsCheckboxGroup> = new EventEmitter<MsCheckboxGroup>();

  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => MsCheckbox), {descendants: true})
  _checkboxChildren: QueryList<MsCheckbox>;

  get checkboxes(): Array<MsCheckbox> {
    return this._checkboxChildren.toArray();
  }


  constructor(private _changeDetector: ChangeDetectorRef,
              private _elementRef: ElementRef<HTMLElement>,
              private _focusMonitor: FocusMonitor) {

  }


  ngAfterContentInit(): void {


    this._checkboxChildren.forEach(item => {
      item._changeDetector.detach();
      item.change.subscribe(() => {
        this.change.next(this);
        this._controlValueAccessorChangeFn(this.values);
      });
      item._changeDetector.detectChanges();
      item._changeDetector.reattach();
    });

    this._focusMonitor.monitor(this._elementRef.nativeElement, true)
      .subscribe(() => {
        this._touch();
      });

    this._isInitialized = true;
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }


  get values(): Array<any> {
    return this.checkboxes.map(item => item.value);
  }

  get selected(): Array<MsCheckbox> {
    return this.checkboxes.filter(f => f.checked);
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
  }

  private _disabled: boolean = false;

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
    const values = coerceArray(obj);

    this._checkboxChildren.forEach(item => item.checked = values.indexOf(item.value) > -1);
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
