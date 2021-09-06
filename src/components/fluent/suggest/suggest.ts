import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  OnDestroy, TemplateRef,
  ViewChild, ViewContainerRef,
  ViewEncapsulation, ViewRef
} from '@angular/core';
import {MS_SUGGEST_DEFAULT_INTL, MsSuggestIntl} from './suggest-intl';
import {MS_SUGGEST_DEFAULT_OPTIONS, MsSuggestOptions} from './suggest-options';
import {MsSuggestPanelContext, MsSuggestPanelDef} from './suggest-panel-def';
import {MsSuggestItemDef} from './suggest-item-def';
import {MsSuggestOrigin} from './suggest-origin';
import {CdkConnectedOverlay} from '@angular/cdk/overlay';

import * as tween from 'gsap';
import {MsMotionTimings, PropertyValueObserver} from '../../core';

export type MsSuggestSearchFn<T> = (key: string) => Promise<Array<T>>
export type MsSuggestMapFn<T> = (item: T) => string

@Component({
  selector: 'ms-suggest, msSuggest, MsSuggest',
  exportAs: 'msSuggest',
  templateUrl: 'suggest.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-suggest',
    '[class.ms-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled'
  }
})
export class MsSuggest<T> implements AfterViewInit, AfterContentInit, OnDestroy {
  @Input()
  disabled: boolean = false;

  @Input()
  searchFn: MsSuggestSearchFn<T>;

  @Input()
  mapFn: MsSuggestMapFn<T>;

  @Input()
  itemField: string;

  @Input()
  maxItem: number = 10;

  @Input()
  intl: MsSuggestIntl = this.defaultIntl;

  @Input()
  openOnFocus: boolean = true;

  @Input()
  autoFill: boolean = true;


  @ViewChild(MsSuggestPanelDef)
  _defaultPanelTemplate: MsSuggestPanelDef<T>;

  @ViewChild(MsSuggestItemDef)
  _defaultItemTemplate: MsSuggestItemDef<T>;

  @ContentChild(MsSuggestPanelDef)
  _contentPanelTemplate: MsSuggestPanelDef<T>;

  @ContentChild(MsSuggestItemDef)
  _contentItemTemplate: MsSuggestItemDef<T>;

  @ContentChild(MsSuggestOrigin)
  _originInput: MsSuggestOrigin;

  @ViewChild(CdkConnectedOverlay)
  overlay: CdkConnectedOverlay;

  @ViewChild('suggestContainer')
  suggestContainer: ElementRef<HTMLElement>;

  @ViewChild('panelContainer', {read: ViewContainerRef})
  panelContainer: ViewContainerRef;

  context = new MsSuggestPanelContext<T>([], '');
  view: ViewRef;

  openPanel: boolean = false;
  active: boolean = false;

  items: Array<T> = [];
  key: string = '';

  userInputValue: string = '';
  previousInputValue = '';

  inputValueObserver: PropertyValueObserver;

  _inputKeyUpEvent = (event: KeyboardEvent) => this.onkeyup(event);
  _beforeInputEvent = (event: InputEvent) => this.onbeforeInput(event);

  _inputFocusEvent = () => {
    if (this.openOnFocus) {
      this.open();
    }
  };

  _inputBlurEvent = () => this.close();

  constructor(private elementRef: ElementRef<HTMLElement>,
              private changeDetectorRef: ChangeDetectorRef,
              @Inject(MS_SUGGEST_DEFAULT_OPTIONS) private defaultOptions: MsSuggestOptions,
              @Inject(MS_SUGGEST_DEFAULT_INTL) private defaultIntl: MsSuggestIntl) {
  }

  ngAfterContentInit(): void {
  }


  ngAfterViewInit(): void {
    if (!this.searchFn) {
      throw new Error('The suggest component must have a searchFn function.')
    }

    if (!this._originInput) {
      throw new Error('The suggest component must contains a MsSuggestOrigin on a input element.')
    }

    if (!this.getMapFn) {
      throw new Error('The suggest component must have a mapFn function or a itemField.')
    }

    this.inputValueObserver = new PropertyValueObserver(this.input, 'value');

    this.inputValueObserver.change.subscribe((change) => {
      // this.key = change.value;
      // this.search();
    });

    this.input.addEventListener('keyup', this._inputKeyUpEvent);
    this.input.addEventListener('focus', this._inputFocusEvent);
    // this.input.addEventListener('blur', this._inputBlurEvent);
    this.input.addEventListener('beforeinput', this._beforeInputEvent);
  }

  ngOnDestroy(): void {
    this.input.removeEventListener('keyup', this._inputKeyUpEvent);
    this.input.removeEventListener('focus', this._inputFocusEvent);
    this.input.removeEventListener('blur', this._inputBlurEvent);
    this.input.removeEventListener('beforeinput', this._beforeInputEvent);
    this.inputValueObserver?.unobserve();
  }


  async close() {
    await this.animatePanelOut();
    this.openPanel = false;
    this.active = false;
    this.changeDetectorRef.markForCheck();
  }

  async open() {
    if (this.active) {
      return Promise.resolve();
    }
    this.active = true;
    this.context.$implicit = this.items;
    this.openPanel = true;
    this.changeDetectorRef.markForCheck();
    setTimeout(() => {
      this.createPanelView();
      this.animatePanelEnter();
    })
  }

  filled: boolean = false;

  async onbeforeInput(event: InputEvent) {
  }

  async onkeyup(event?: KeyboardEvent) {
    this.key = this.input.value;
    await this.search();
  }

  async search() {
    if (!this.active) {
      this.open();
    }
    const items = await this.searchFn(this.key);
    setTimeout(() => {
      this.updatePanelView(items, this.key);
    }, 0);
    this.items = items;
    this.changeDetectorRef.markForCheck();
  }

  createPanelView() {
    this.panelContainer.clear();
    this.view = this.panelContainer.createEmbeddedView(this.getTemplate().template, this.context, 0);
    this.view.detectChanges();
  }

  updatePanelView(items: T[], key: string) {
    this.context.$implicit = items;
    this.context.keyword = key;
    this.view?.detectChanges();
  }

  getTemplate(): MsSuggestPanelDef<T> {
    if (this._contentPanelTemplate) {
      return this._contentPanelTemplate;
    }

    return this._defaultPanelTemplate;
  }

  toggle(): Promise<void> {
    if (this.active) {
      return this.close();
    } else {
      return this.open();
    }
  }

  fillInput(): void {
    const firstItem = this.items[0];
    if (firstItem) {
      const value = this.getMapFn()(firstItem);
      this.input.value = value;
      this.input.setSelectionRange(this.key.length, value.length);
      this.filled = true;
    }
  }

  updateFill(): void {
    const firstItem = this.items[0];
    if (firstItem) {
      const value = this.getMapFn()(firstItem);
      this.input.setSelectionRange(this.key.length, value.length);
    }
  }

  overlayAttach() {
  }

  async animatePanelEnter(): Promise<void> {
    await tween.gsap.fromTo(this.suggestContainer.nativeElement, {
      opacity: 0,
      translateY: -48,
    }, {translateY: 0, opacity: 1, duration: 0.3, ease: MsMotionTimings.decelerate});

    return Promise.resolve();
  }

  async animatePanelOut(): Promise<void> {
    if (this.suggestContainer) {
      await tween.gsap.to(this.suggestContainer.nativeElement, {opacity: 0, translateY: -48, duration: 0.3});
    }
    return Promise.resolve();
  }


  public getMapFn(): MsSuggestMapFn<T> {
    if (this.mapFn) {
      return this.mapFn;
    }

    if (this.itemField) {
      return (item: T) => item[this.itemField];
    }

    return item => item?.toString() || 'null';
  }

  private panelDef(): MsSuggestPanelDef<T> {
    return this._contentPanelTemplate || this._defaultPanelTemplate;
  }

  private itemDef(): MsSuggestItemDef<T> {
    return this._contentItemTemplate || this._defaultItemTemplate;
  }

  get input(): HTMLInputElement {
    return this._originInput.host;
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  get _elementWidth(): number {
    return this.host.offsetWidth;
  }

  get visibleItems(): Array<T> {
    return this.items.slice(0, this.maxItem);
  }
}
