import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {MsActionMenuDefaultOptions} from './action-menu-options';
import {MsActionMenuColorTheme, msActionMenuTheme} from './action-menu-theme';
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
  get theme(): msActionMenuTheme | string {
    return this._theme;
  }

  set theme(value: msActionMenuTheme | string) {
    const themeColor = this._defaultOptions.colorThemes[value];
    if (!themeColor) {
      throw new Error(`There is no theme with name: ${value}`);
    }

    this._theme = value;
    this.changeDetector.markForCheck();
  }

  private _theme: msActionMenuTheme | string = 'standard';

  @ViewChild('focusBorder')
  private focusBorder: ElementRef<HTMLDivElement>;

  @HostListener('click', ['$event'])
  onclick(event: MouseEvent) {
    const ripple = new MsRipple(event);
    ripple.attach();
  }

  ngOnInit(): void {
    if (!this._theme && this._defaultOptions?.theme) {
      this.theme = this._defaultOptions.theme;
    }
  }

  ngAfterViewInit(): void {
    this.focusBorder.nativeElement.classList.add(`ms-borderColor-transparent`);
  }

  get host(): HTMLButtonElement {
    return this._elementRef.nativeElement;
  }

  constructor(private _elementRef: ElementRef<HTMLButtonElement>,
              private changeDetector: ChangeDetectorRef,
              private _defaultOptions: MsActionMenuDefaultOptions) {
  }

  get themeColor(): MsActionMenuColorTheme {
    return this._defaultOptions.colorThemes[this._theme];
  }
}
