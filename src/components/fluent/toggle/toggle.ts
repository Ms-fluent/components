import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter, forwardRef, HostListener,
  Inject,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {MS_SLIDE_DEFAULT_OPTIONS, MsToggleDefaultOptions} from './toggle.options';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

let uniqueId = 0;

/** Change event object emitted by a MsToggle. */
export class MsToggleChange {
  constructor(
    /** The source MatSlideToggle of the event. */
    public source: MsToggle,
    /** The new `checked` value of the MsToggle. */
    public checked: boolean) {
  }
}

/** @docs-private */
export const MS_TOGGLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsToggle),
  multi: true
};

@Component({
  templateUrl: 'toggle.html',
  selector: 'ms-toggle, msToggle, MsToggle',
  exportAs: 'msToggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MS_TOGGLE_VALUE_ACCESSOR],
  host: {
    'class': 'ms-toggle',
    '[id]': 'id',
    '[attr.role]': '"switch"',
    '[attr.tabindex]': 'disabled? -1 : 0',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[class.ms-checked]': 'checked',
    '[class.ms-disabled]': 'disabled',
    '[class.ms-toggle-label-before]': 'labelPosition == "before"'
  }
})
export class MsToggle {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  private _uniqueId = `ms-toggle-${uniqueId++}`;

  @Input()
  id: string = this._uniqueId;

  /** Text for screen-reader to announce as the name of the toggle. */
  @Input('aria-label')
  ariaLabel: string | null;

  @Input('aria-labelledby')
  ariaLabelledby: string | null;

  /** Whether the component is disabled. */
  @Input()
  disabled: boolean;

  /** Whether the slide-toggle is required. */
  @Input()
  get required(): boolean { return this._required; }
  set required(value) {
    this._required = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _required: boolean;

  /** Whether the toggle element is checked or not. */
  @Input()
  get checked(): boolean { return this._checked; }
  set checked(value: boolean) {
    value = coerceBooleanProperty(value);
    this._checked = value;
    this._changeDetectorRef.markForCheck();
  }
  private _checked: boolean;

  @Input()
  labelPosition: 'before' | 'after' = this._defaultOptions.labelPosition;

  /** An event will be dispatched each time the  toggle changes its value. */
  @Output()
  readonly change: EventEmitter<MsToggleChange> = new EventEmitter<MsToggleChange>();


  constructor(@Inject(MS_SLIDE_DEFAULT_OPTIONS) private _defaultOptions: MsToggleDefaultOptions,
              private _changeDetectorRef: ChangeDetectorRef,
              private _elementRef: ElementRef<HTMLElement>) {
  }

  @HostListener('click')
  _onclick() {
    this.checked = !this.checked;
    console.log('click: ' + this.assertIsChecked());
    this._emitChangeEvent();
  }

  @HostListener('focus')
  _onfocus() {
    this._onTouched();
  }

  /** Toggles the checked state of the slide-toggle. */
  toggle(): void {
    this.checked = !this.checked;
    this._onChange(this.checked);
  }

  /**
   * Emits a change event on the `change` output. Also notifies the FormControl about the change.
   */
  private _emitChangeEvent() {
    this.change.emit(new MsToggleChange(this, this.checked));
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: any): void {
    this.checked = !!value;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  // For test.
  assertIsDisabled(): boolean {
    return this.disabled
      && this.host.classList.contains('ms-disabled')
      && this.host.getAttribute('aria-disabled') === 'true';
  }

  // For test.
  assertIsChecked(): boolean {
    return this.checked
      && this.host.classList.contains('ms-checked')
      && this.host.getAttribute('aria-checked') === 'true';
  }
}
