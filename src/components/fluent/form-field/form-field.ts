import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MsFormFieldAppearance} from './form-field-options';
import {MsLabel} from '../label';
import {MsInputField} from './input-field';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

let nextUniqueId = 0;

@Component({
  selector: 'ms-formField, msFormField, MsFormField',
  templateUrl: 'form-field.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-formField',
    '[class.ms-disabled]': 'disabled',
    '[class.ms-formField-active]': 'focused',
    '[class.ms-form-field-inline]': 'inline',
    '[class.appearance-underline]': 'underline',
  }
})
export class MsFormField implements AfterViewInit, AfterContentInit, OnDestroy {
  private _initialized: boolean = false;

  get label(): MsLabel {
    return this.viewLabelRef || this.contentLabel;
  }

  get invalid(): boolean {
    return undefined;
  }

  get hasLabel(): boolean {
    return !!this.label;
  }

  private _focused: boolean = false;
  get focused(): boolean {
    return this._focused;
  }

  set focused(value: boolean) {
    this._focused = value;
    this._markForCheck();
  }

  get untouched(): boolean {
    return undefined;
  }

  @Input()
  id: string = `ms-form-field-${nextUniqueId++}`;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    value = coerceBooleanProperty(value);
    if (this._initialized) {
      if (this.hasLabel) {
        this.label.disabled = value;
      }
      this.inputField.disabled = value;
      this._markForCheck();
    }
    this._disabled = value;
  }

  private _disabled: boolean = false;

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    value = coerceBooleanProperty(value);
    if (this._initialized) {
      if (this.hasLabel) {
        this.label.required = value;
        this.label._markForCheck();
      }
      this.inputField.required = value;
      this._markForCheck();
    }
    this._required = value;
  }

  private _required: boolean = false;

  @Input()
  appearance: MsFormFieldAppearance = 'standard';

  get underline(): boolean {
    return this.appearance === 'underline'
  }

  @Input()
  set inline(value: boolean) {
    value = coerceBooleanProperty(value);
    this._inline = value;
    this._markForCheck();
  }

  get inline(): boolean {
    return this._inline;
  }

  private _inline: boolean = false;

  @Input()
  hideRequiredMarker: boolean;

  @Input()
  set floatLabel(value: boolean) {
    value = coerceBooleanProperty(value);
    this._floatLabel = value;
  }

  get floatLabel(): boolean {
    return this._floatLabel;
  }

  private _floatLabel: boolean;

  @Input('label')
  labelText: string;

  @ViewChild('viewLabelRef')
  viewLabelRef: MsLabel;

  @ViewChild('labelLayoutRef')
  labelLayoutRef: ElementRef<HTMLElement>;

  @ViewChild('inputLayoutRef')
  inputLayoutRef: ElementRef<HTMLElement>;

  @ContentChild(forwardRef(() => MsLabel))
  contentLabel: MsLabel;

  @ContentChild(forwardRef(() => MsInputField))
  inputField: MsInputField;


  constructor(private _elementRef: ElementRef<HTMLElement>,
              private changeDetectorRef: ChangeDetectorRef) {
  }


  private _inputFocusEvent = () => this.focused = true;
  private _inputBlurEvent = () => this.focused = false;

  ngAfterViewInit(): void {
    this._initialized = true;

    Promise.resolve().then(() => {
      this.disabled = this._disabled;
      this.required = this._required;
    });
  }

  ngAfterContentInit(): void {
    if(!this.inputField) {
      throw new Error('The FormField must contains a MsInputField');
    }
    this.inputField.host.addEventListener('focus', this._inputFocusEvent);
    this.inputField.host.addEventListener('blur', this._inputBlurEvent);
  }

  ngOnDestroy(): void {
    this.inputField.host.removeEventListener('focus', this._inputFocusEvent);
    this.inputField.host.removeEventListener('blur', this._inputBlurEvent);
  }


  getHtmlFor(): string {
    return this.id;
  }

  private _markForCheck(): void {
    this.changeDetectorRef.markForCheck();
  }

  get labelLayoutHost(): HTMLElement {
    return this.labelLayoutRef.nativeElement;
  }

  get inputFieldHost(): HTMLElement {
    return this.inputField.host;
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
