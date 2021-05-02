import {AfterContentInit, AfterViewInit, Directive} from '@angular/core';
import {MsFormField} from './form-field';
import {MsMotionTimings, Point} from '../../core';
import {MsLabel} from '../label';
import * as gsap from 'gsap';

@Directive({
  selector: '[msInlineFloatLabel], [MsInlineFloatLabel], [ms-inline-float-label]'
})
export class MsInlineFloatLabel implements AfterContentInit, AfterViewInit {
  private _tempPlaceholder: string;
  private labelWidth: number;
  private initialLabelLeft: number;

  margin: number = 8;

  private _labelClickEvent = () => this.activate();
  private _inputFocusEvent = () => this.onfocus();
  private _inputBlurEvent = () => this.onblur();

  constructor(private formField: MsFormField) {
    if (!formField) {
      throw new Error('The MsInlineFloatLabel must be used on MsFormField element.')
    }
    this.formField.host.classList.add('inline-float-label');
  }


  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {
    if (!this.formField.inline) {
      throw new Error('The MsInlineFloatLabel must be used on Inline MsFormField.')
    }

    if (!this.formField.hasLabel) {
      throw new Error('The MsFormField that uses the floatLabel must have a label element.')
    }
    Promise.resolve().then(() => {
      this.labelWidth = this.labelHost.offsetWidth + this.margin;
      this.initialLabelLeft = this.inputHost.getBoundingClientRect().x - this.formField.host.getBoundingClientRect().x +
        (!this.formField.underline && this.margin);
      this.hibernate();
    });

    this.inputHost.addEventListener('focus', this._inputFocusEvent);
    this.inputHost.addEventListener('blur', this._inputBlurEvent);
  }

  private onfocus() {
    if (!this.inputHost.value) {
      this.activate();
    }
  }

  private onblur() {
    if (!this.inputHost.value) {
      this.hibernate();
    }
  }

  private hibernate() {
    this.savePlaceHolder();
    this.translateLabelToInput();
    this.labelHost.classList.add('as-placeholder');
    this.labelHost.addEventListener('click', this._labelClickEvent);
  }

  private activate() {
    this.restorePlaceHolder();
    this.inputHost.focus();
    this.labelHost.classList.remove('as-placeholder');
    this.labelHost.removeEventListener('click', this._labelClickEvent);
    const left = this.labelHost.getBoundingClientRect().width + this.margin;
    gsap.gsap.to(this.labelHost, 0.2, {translateX: 0});
    gsap.gsap.to(this.inputLayoutHost, 0.2, {left: left, ease: MsMotionTimings.accelerate});
  }

  private translateLabelToInput() {
    gsap.gsap.to(this.labelHost, 0.2, {translateX: this.initialLabelLeft, ease: MsMotionTimings.decelerate});
    gsap.gsap.to(this.inputLayoutHost, 0.2, {left: 0, ease: MsMotionTimings.accelerate});
  }

  private savePlaceHolder() {
    if (this.inputHost.placeholder) {
      this._tempPlaceholder = this.inputHost.placeholder?.slice();
      this.inputHost.placeholder = '';
    }
  }

  private restorePlaceHolder() {
    if (this._tempPlaceholder) {
      this.inputHost.placeholder = this._tempPlaceholder?.slice();
    }
  }

  private getInputPoint(): Point {
    const rect = this.formField.inputFieldHost.getBoundingClientRect();
    return new Point(rect.x, rect.y);
  }

  private getLabelPoint(): Point {
    const rect = this.formField.labelLayoutHost.getBoundingClientRect();
    return new Point(rect.x, rect.y);
  }

  get inputHost(): HTMLInputElement {
    return this.formField.inputField.host;
  }

  get inputLayoutHost(): HTMLElement {
    return this.formField.inputLayoutRef.nativeElement;
  }

  get labelHost(): HTMLElement {
    return this.formField.labelLayoutHost;
  }

  get label(): MsLabel {
    return this.formField.label;
  }

  get labelLeft(): number {
    const rect = this.inputHost.getBoundingClientRect();
    const x = rect.x - this.labelHost.getBoundingClientRect().x;
    if (this.formField.underline) {
      return rect.x - this.formField.host.getBoundingClientRect().x;
    }
    const padding = parseInt(getComputedStyle(this.inputHost, null).paddingLeft, 0);
    return rect.x + padding;
  }
}
