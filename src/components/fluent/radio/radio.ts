import {
  AfterContentInit, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener, Inject,
  Input, OnDestroy, OnInit, Optional,
  Output,
  ViewChild
} from '@angular/core';
import {FocusMonitor} from '@angular/cdk/a11y';


import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {MS_RADIO_DEFAULT_OPTIONS, MsRadioDefaultOptions} from './radio-options';
import * as gsap from "gsap";
import {Subject} from "rxjs";

let nextUniqueId = 0;

/** Change event object emitted by MatRadio and MatRadioGroup. */
export class MsRadioChange {
  /**
   * The constructor.
   * @param source he MatRadioButton that emits the change event.
   * @param value The value of the MatRadioButton.
   */
  constructor(public source: MsRadio, public value: any) {
  }
}

class MsRadioInputBase {
  constructor(public _elementRef: ElementRef) {
  }
}

@Component({
  templateUrl: 'radio.html',
  selector: 'MsRadio, MsRadio, ms-radio',
  host: {
    'class': 'ms-radio',
    '[class.ms-checked]': 'checked',
    '[class.ms-disabled]': 'disabled',

    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.id]': 'id',
    '[attr.disabled]': 'disabled',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-describedby]': 'ariaDescribedby',
    '[attr.aria-label]': 'ariaLabel'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * The radio input component.
 * Code inspired by Angular Material.
 * Design inspired by Microsoft Fabric.
 *
 * @author Chendjou Caleb deGrace
 * @version 1.
 */
export class MsRadio implements AfterContentInit, OnInit, OnDestroy {
  /**
   * ID of the native input element inside `<MsRadioInput>`
   * This Id should be different to id property which is used for the MsRadioInput
   */
  @Input()
  inputId: string = '';


  /** Used to set the 'aria-label' attribute on the underlying input element. */
  @Input() ariaLabel: string;

  /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
  @Input() ariaLabelledby: string;

  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  @Input() ariaDescribedby: string;

  /** Whether this radio button is disabled. */
  @Input()
  disabled: boolean = false;

  /**
   * Event emitted when the checked state of this radio button changes.
   * Change events are only emitted when the value changes due to user interaction with
   * the radio button (the same behavior as `<input type-"radio">`).
   */
  @Output()
  readonly change: EventEmitter<MsRadioChange> = new EventEmitter<MsRadioChange>();

  readonly onactivate = new Subject<boolean>();

  @ViewChild('thumb')
  thumb: ElementRef<HTMLElement>;

  /**
   * Tells whether the component is initialised.
   */
  private _isInitialized: boolean = false;

  private _uniqueId: string = `ms-radio-${++nextUniqueId}`;


  /** The unique ID for the radio button. */
  @Input()
  id: string = this._uniqueId;


  /** Whether this radio is checked. */
  private _checked: boolean = false;


  /** Value assigned to this radio. */
  private _value: any = null;


  constructor(public _elementRef: ElementRef<HTMLElement>,
              private _changeDetector: ChangeDetectorRef,
              private _focusMonitor: FocusMonitor,
              @Optional() @Inject(MS_RADIO_DEFAULT_OPTIONS)
              private _providerOverride?: MsRadioDefaultOptions
  ) {
  }


  ngOnInit() {
  }


  ngOnDestroy() {
  }

  @HostListener('click')
  onClick() {

    if (this.disabled) {
      return;
    }
    if (!this._checked) {
      this.checked = true;
      this._emitChangeEvent();
    }
  }


  ngAfterContentInit(): void {
    this._isInitialized = true;
  }

  @Input()
  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }


  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    value = coerceBooleanProperty(value);
    if (value) {
      this.onactivate.next(value);
    }
    this._checked = value;
    if (value) {
      this.activate();
    } else {
      this.deactivate();
    }
    this._changeDetector.markForCheck();
  }

  activate() {
    gsap.gsap.to(this.thumb.nativeElement, 0.2, {scale: 1});
  }

  deactivate() {
    gsap.gsap.to(this.thumb.nativeElement, 0.2, {scale: 0});
  }

  get element(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  get changeDetector(): ChangeDetectorRef {
    return this._changeDetector;
  }


  /**
   * Marks the radio button as needing checking for change detection.
   * This method is exposed because the parent radio group will directly
   * update bound properties of the radio button.
   */
  _markForCheck() {
    // When group value changes, the button will not be notified. Use `markForCheck` to explicit
    // update radio button's status
    this._changeDetector.markForCheck();
  }

  /** Dispatch change event with current value. */
  private _emitChangeEvent(): void {
    this.change.emit(new MsRadioChange(this, this._value));
  }


}
