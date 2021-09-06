import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MS_ALERT_DEFAULT_ICON, MS_ALERT_DEFAULT_OPTIONS, MsAlertOptions} from './alert-options';
import {MsAlertTheme} from './alert-theme';
import {Assert} from '../../helpers';
import {MsAlertFooter} from './alert-footer';
import {MsAlertTitle} from './alert-title';

@Component({
  templateUrl: 'alert.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ms-alert, MsAlert',
  host: {
    'class': 'ms-alert'
  }
})
export class MsAlert implements OnInit, AfterContentInit, AfterViewInit {
  private _initialized: boolean = false;

  @Input()
  title: string;

  @Input()
  content: string;

  @Input()
  theme: MsAlertTheme = this.defaultOptions.theme;

  @Input()
  showCloseButton: boolean = false;

  @Input()
  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    Assert.isNotNull(value);

    if (this._initialized) {
      if (this._icon) {
        this.iconElementRef.nativeElement.classList.remove(`ms-Icon--${this._icon}`);
      }
      this.iconElementRef.nativeElement.classList.add(`ms-Icon--${value}`);
    }

    this._icon = value;
  }

  private _icon: string;

  @ViewChild('iconRef')
  iconElementRef: ElementRef<HTMLElement>;

  @ViewChild('titleRef')
  titleElementRef: ElementRef<HTMLElement>;

  @ViewChild('footerRef')
  footerElementRef: ElementRef<HTMLElement>;

  @ContentChild(forwardRef(() => MsAlertFooter))
  footerContent: MsAlertFooter;

  @ContentChild(forwardRef(() => MsAlertTitle))
  titleContent: MsAlertTitle;

  getIcon(): string {
    return this.icon || this.defaultOptions.themeDeclarations.get(this.theme)?.icon || MS_ALERT_DEFAULT_ICON;
  }

  constructor(private _elementRef: ElementRef<HTMLElement>,
              @Inject(MS_ALERT_DEFAULT_OPTIONS) private defaultOptions: MsAlertOptions) {
  }

  ngOnInit(): void {
    this._initialized = true;

    this.applyTheme(this.theme);
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }


  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {
    if (!this.footerContent) {
      this.footerElementRef.nativeElement.classList.add('ms-display-none');
    }
  }

  hasFooter(): boolean {
    return !!this.footerContent;
  }

  hasTitle(): boolean {
    return !!(this.title || this.titleContent);
  }

  applyTheme(theme: string) {
    const declaration = this.defaultOptions.themeDeclarations.get(theme);

    if (!declaration) {
      return;
    }

    this.host.classList.add(`ms-fontColor-${declaration.fontColor}`);
    this.host.classList.add(`ms-bgColor-${declaration.bgColor}`);
  }
}
