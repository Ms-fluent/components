import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {MsActionMenuDefaultOptions, msActionMenuSize} from './action-menu-options';
import {msActionMenuTheme} from './action-menu-theme';
import {MsRipple} from './ripple';

@Directive()
export abstract class MsActionMenuButtonBase implements OnInit, AfterViewInit {
  @Input()
  disabled: boolean | string = false;

  @Input()
  type: string = 'button';

  @Input()
  secondaryIcon: string | undefined;

  @Input()
  get size(): msActionMenuSize {
    return this._size;
  }

  set size(value: msActionMenuSize) {
    this.host.classList.remove(`size--${this._size}`);
    this.host.classList.add(`size--${value}`);
    this._size = value;
  }

  private _size: msActionMenuSize;

  @Input()
  get bgColor(): string {
    return this._bgColor;
  }

  set bgColor(value: string) {
    this.host.classList.remove(`ms-bgColor-${this._bgColor}`);
    this.host.classList.add(`ms-bgColor-${value}`);
    this._bgColor = value;
  }

  private _bgColor: string;


  @Input()
  get fontColor(): string {
    return this._fontColor;
  }

  set fontColor(value: string) {
    this.host.classList.remove(`ms-fontColor-${this._fontColor}`);
    this.host.classList.add(`ms-fontColor-${value}`);
    this._fontColor = value;
  }

  private _fontColor: string;

  @Input()
  get focusBorderColor(): string {
    return this._focusBorderColor;
  }

  set focusBorderColor(value: string) {
    this._focusBorderColor = value;
  }

  private _focusBorderColor: string;

  @Input()
  get hoverBgColor(): string {
    return this._hoverBgColor;
  }

  set hoverBgColor(value: string) {
    this.host.classList.remove(`ms-bgColor-${this._hoverBgColor}--hover`);
    this.host.classList.add(`ms-bgColor-${value}--hover`);
    this._hoverBgColor = value;
  }

  private _hoverBgColor: string;

  @Input()
  get hoverFontColor(): string {
    return this._hoverFontColor;
  }

  set hoverFontColor(value: string) {
    this.host.classList.remove(`ms-fontColor-${this._hoverFontColor}--hover`);
    this.host.classList.add(`ms-fontColor-${value}--hover`);
    this._hoverFontColor = value;
  }

  private _hoverFontColor: string;


  @Input()
  get theme(): msActionMenuTheme | string {
    return this._theme;
  }

  set theme(value: msActionMenuTheme | string) {
    const themeColor = this._defaultOptions.colorThemes[value];
    if (!themeColor) {
      throw new Error(`There is no theme with name: ${value}`);
    }
    this.fontColor = themeColor.fontColor;
    this.bgColor = themeColor.bgColor;
    this.hoverBgColor = themeColor.hoverBgColor;
    this.hoverFontColor = themeColor.hoverFontColor;
    this.focusBorderColor = themeColor.focusBorderColor;

    this._theme = value;
  }

  private _theme: msActionMenuTheme | string;

  @ViewChild('focusBorder')
  private focusBorder: ElementRef<HTMLDivElement>;

  @HostListener('click', ['$event'])
  onclick(event: MouseEvent) {
    const ripple = new MsRipple(event);
    ripple.attach();
  }

  @HostListener('focus')
  focus() {
    this.focusBorder.nativeElement.classList.remove(`ms-borderColor-transparent`);
    this.focusBorder.nativeElement.classList.add(`ms-borderColor-${this.focusBorderColor}`);
  }

  @HostListener('blur')
  blur() {
    this.focusBorder.nativeElement.classList.remove(`ms-borderColor-${this.focusBorderColor}`);
    this.focusBorder.nativeElement.classList.add(`ms-borderColor-transparent`);
  }

  ngOnInit(): void {
    if (!this._theme && this._defaultOptions?.theme) {
      this.theme = this._defaultOptions.theme;
    }

    if (!this._size && this._defaultOptions?.size) {
      this.size = this._defaultOptions.size;
    }
  }

  ngAfterViewInit(): void {
    this.focusBorder.nativeElement.classList.add(`ms-borderColor-transparent`);
  }

  get host(): HTMLButtonElement {
    return this._elementRef.nativeElement;
  }

  constructor(private _elementRef: ElementRef<HTMLButtonElement>, private _defaultOptions: MsActionMenuDefaultOptions) {
  }
}
