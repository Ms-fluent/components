import {AfterContentInit, AfterViewInit, Directive} from '@angular/core';
import {MsFormField} from './form-field';
import {Point} from '../../core';
import {MsLabel} from '../label';
import * as gsap from 'gsap';

@Directive({
  selector: '[msFloatLabel], [MsFloatLabel], [ms-float-label]'
})
export class MsFloatLabel implements AfterContentInit, AfterViewInit {
  private _tempPlaceholder: string;

  private _labelClickEvent = () => this.restoreLabel();
  private _inputFocusEvent = () => this.onfocus();
  private _inputBlurEvent = () => this.onblur();

  constructor(private formField: MsFormField) {
    if (!formField) {
      throw new Error('The MsFloatLabel must be used on MsFormField element.')
    }

    formField.host.classList.add('floating-label');
  }


  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {
    if (!this.formField.hasLabel) {
      throw new Error('The MsFormField that uses the floatLabel must have a label element.')
    }
    Promise.resolve().then(() => {
      this.moveLabelToBottom();
    });

    this.inputHost.addEventListener('focus', this._inputFocusEvent);
    this.inputHost.addEventListener('blur', this._inputBlurEvent);
  }

  private onfocus() {
    if (!this.inputHost.value) {
      this.restoreLabel();
    }
  }

  private onblur() {
    if (!this.inputHost.value) {
      this.moveLabelToBottom();
    }
  }

  private moveLabelToBottom() {
    this.savePlaceHolder();
    this.translateLabelToInput();
    this.labelHost.classList.add('as-placeholder');
    this.labelHost.addEventListener('click', this._labelClickEvent);
  }

  private restoreLabel() {
    // this.labelHost.style.transform = `translate(0,0)`;


    this.restorePlaceHolder();
    this.inputHost.focus();
    this.labelHost.classList.remove('as-placeholder');
    this.labelHost.removeEventListener('click', this._labelClickEvent);
    gsap.gsap.to(this.labelHost, 0.2, {translateX: 0, translateY: 0, scale: 0.9});
  }

  private translateLabelToInput() {
    const range = this.getInputPoint().minus(this.getLabelPoint());
    const inputPadding = parseInt(getComputedStyle(this.inputHost, null).paddingLeft);
    range.x = range.x + inputPadding;


    gsap.gsap.to(this.labelHost, 0.2, {translateX: range.x, translateY: range.y, scale: 1});
  }

  private savePlaceHolder() {
    this._tempPlaceholder = this.inputHost.placeholder?.slice();
    this.inputHost.placeholder = '';
  }

  private restorePlaceHolder() {
    this.inputHost.placeholder = this._tempPlaceholder.slice();
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

  get labelHost(): HTMLElement {
    return this.formField.labelLayoutHost;
  }

  get label(): MsLabel {
    return this.formField.label;
  }
}
