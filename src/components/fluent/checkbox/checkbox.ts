import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef, Host,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgControl, NgModel} from '@angular/forms';
import {FocusMonitor} from '@angular/cdk/a11y';
import {MS_CHECKBOX_DEFAULT_OPTIONS, MsCheckboxDefaultOptions} from './checkbox-options';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DOCUMENT} from '@angular/common';
import * as gsap from 'gsap';


// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;


/**
 * Provider Expression that allows Checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MS_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsCheckbox),
  multi: true
};


/**
 * Change event object emitted by MsCheckbox.
 */
export class MsCheckboxChange {
  /**
   * Ctor
   * @param source The source MatCheckbox of the event.
   * @param nativeEvent The native html event that triggered event
   * @param checked The new `checked` value of the checkbox.
   */
  constructor(public source: MsCheckbox, public nativeEvent: Event, public checked: boolean) {
  }
}

const CHECKMARK_PATH = 'M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z';

@Component({
  templateUrl: 'checkbox.html',
  selector: 'MsCheckbox, msCheckbox, ms-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [MS_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  host: {
    'class': 'ms-checkbox',
    '[class.ms-checked]': 'checked',
    '[class.ms-indeterminate]': 'indeterminate',
    '[class.ms-disabled]': 'disabled',

    // Needs to be -1 so the `focus` event still fires.
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.id]': 'id',
    '[attr.disabled]': 'disabled',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-checked]': '_getAriaChecked()',
    '[attr.aria-disabled]': 'disabled',
    '[attr.role]': 'role'
  }
})

export class MsCheckbox implements OnDestroy, OnInit {

  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  private _indeterminate: boolean = false;

  private _uniqueId: string = `ms-checkbox-${++nextUniqueId}`;

  /**
   * Whether the checkbox is checked.
   */
  private _checked: boolean = false;

  /**
   * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
   * @docs-private
   */
  private _onTouched: () => any = () => {
  };
  private _controlValueAccessorChangeFn: (value: any) => void = () => {
  };


  /**
   * Attached to the aria-label attribute of the host element. In most cases, aria-labelledby will
   * take precedence so this may be omitted.
   */
  @Input()
  ariaLabel: string = '';

  /**
   * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
   */
  @Input()
  ariaLabelledby: string | null = null;

  @Input()
  id: string = this._uniqueId;


  readonly role: string = 'checkbox';

  /** Whether this checkbox button is disabled. */
  @Input()
  disabled: boolean = false;

  @Input()
  /** Whether the checkbox is required. */
  public required: boolean;

  /** The value attribute of the native input element */
  @Input()
  value: any;



  /** Event emitted when the checkbox's `checked` value changes. */
    // tslint:disable-next-line:no-output-native
  @Output()
  readonly change: EventEmitter<MsCheckboxChange> = new EventEmitter<MsCheckboxChange>();

  /** Event emitted when the checkbox's `indeterminate` value changes. */
  @Output() readonly indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('checkmarkPath')
  checkmarkPath: ElementRef<HTMLElement>;

  @ViewChild('background')
  background: ElementRef<HTMLDivElement>;

  @ViewChild('border')
  border: ElementRef<HTMLDivElement>;

  get touched(): boolean {return this._touched;}
  private _touched: boolean = false;
  get dirty(): boolean {return this._dirty;}
  private _dirty: boolean = false;

  constructor(public _elementRef: ElementRef<HTMLElement>,
              private _changeDetectorRef: ChangeDetectorRef,
              private _focusMonitor: FocusMonitor,
              @Inject(DOCUMENT) private _document: any,
              @Optional() @Inject(MS_CHECKBOX_DEFAULT_OPTIONS) private _defaultOptions: MsCheckboxDefaultOptions) {

    this._focusMonitor.monitor(_elementRef, false).subscribe(focusOrigin => {
      if (!focusOrigin) {
        // When a focused element becomes disabled, the browser *immediately* fires a blur event.
        // Angular does not expect events to be raised during change detection, so any state change
        // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
        // See https://github.com/angular/angular/issues/17793. To work around this, we defer
        // telling the form control it has been touched until the next tick.
        Promise.resolve().then(() => {
          this._onTouched();
          this._touched = true;
          _changeDetectorRef.markForCheck();
        });
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(state: boolean) {
    state = coerceBooleanProperty(state);
    if (state === this.checked) {
      return;
    }
    if (state) {
      this.animateIn().then();
    } else {
      this.animateOut().then();
    }
    this._checked = state;
    this._dirty = true;
    this._changeDetectorRef.markForCheck();
  }

  async animateIn(): Promise<void> {
    // const animation1 = gsap.gsap.to(this.background.nativeElement, 0.2, {scale: 1});
    const animation2 = gsap.gsap.to(this.border.nativeElement, 0.2, {borderWidth: 1});
    const animation3 = gsap.gsap.to(this.checkmarkPath.nativeElement, 0.2, {rotate: 0, scale: 1});

    await Promise.all([ animation2, animation3]);
    return Promise.resolve();
  }

  async animateOut(): Promise<void> {
    // const animation1 = gsap.gsap.to(this.background.nativeElement, 0.2, {scale: 0});
    const animation2 = gsap.gsap.to(this.border.nativeElement, 0.2, {borderWidth: 1});
    const animation3 = gsap.gsap.to(this.checkmarkPath.nativeElement, 0.2, {rotate: 180, scale: 0});


    await Promise.all([ animation2, animation3]);
    return Promise.resolve();
  }

  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }

  set indeterminate(value: boolean) {

    if (value !== this._indeterminate) {
      this._indeterminate = value;
      this.indeterminateChange.emit(this._indeterminate);
      this._changeDetector.markForCheck();
    }
  }

  markAsIndeterminate() {
    this.indeterminate = true;
  }

  @HostListener('blur')
  _onblur() {
    this._onTouched();
    this._changeDetector.markForCheck();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.stopPropagation();
    if (this.disabled) {
      return;
    }

    if (this.indeterminate) {
      this.indeterminate = false;
    }

    this.toggle();

    this._emitChangeEvent(event);
  }

  @HostListener('keyup', ['$event'])
  onkeyup(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.onClick(event);
    }
  }

  get element(): HTMLElement {
    return this._elementRef.nativeElement;
  }


  /** Dispatch change event with current value. */
  private _emitChangeEvent(event: Event): void {
    this.change.emit(new MsCheckboxChange(this, event, this._checked));
    this._controlValueAccessorChangeFn(this.checked);
  }


  registerOnChange(fn: any): void {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    this.checked = !!value;
  }

  _getAriaChecked(): 'true' | 'false' | 'mixed' {
    return this.checked ? 'true' : (this.indeterminate ? 'mixed' : 'false');
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;
  }

  get _changeDetector(): ChangeDetectorRef {
    return this._changeDetectorRef;
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  assertChecked(): boolean {
    return this.checked && this.host.classList.contains('ms-checked');
  }

  assertIndeterminate(): boolean {
    return this.indeterminate && this.host.classList.contains('ms-indeterminate')
      && this.host.getAttribute('aria-checked') === 'mixed';
  }

  assertDisabled(): boolean {
    return this.disabled && this.host.classList.contains('ms-disabled')
      && this.host.getAttribute('aria-disabled') === 'true';
  }
}
