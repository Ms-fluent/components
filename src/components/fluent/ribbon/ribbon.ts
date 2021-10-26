import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChild,
  ContentChildren,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  QueryList,
  StaticProvider,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsRibbonMenu} from './ribbon-menu/ribbon-menu';
import {MsRibbonContentContext, MsRibbonContentDef} from './ribbon-content-def';
import {MsRibbonContent} from './ribbon-content';
import {MsRibbonMenuItem} from './ribbon-menu/ribbon-menu-item';
import {coerceNumberProperty} from '@angular/cdk/coercion';
import {
  MS_MOTION_SLIDE_DOWN_IN_FROM,
  MS_MOTION_SLIDE_DOWN_OUT_TO,
  MS_MOTION_SLIDE_UP_IN_FROM,
  MS_MOTION_SLIDE_UP_OUT_TO
} from '../../core';
import * as gsap from 'gsap';


@Component({
  selector: 'MsRibbon',
  templateUrl: 'ribbon.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-ribbon',
    role: 'tab'
  }
})
export class MsRibbon implements AfterViewInit {
  private _initialized: boolean = false;

  @Input('aria-label')
  ariaLabel: string = '';

  @Input()
  menuWidth: number = 176;

  @Input()
  collapseBehaviour: 'resize' | 'move' = this.isMobile ? 'move' : 'resize';

  @Input()
  get collapsed(): boolean {
    return this._collapsed;
  }

  set collapsed(value: boolean) {
    if (this._initialized) {
      this.collapse(value);
    } else {
      this._collapsed = value;
    }
  }

  private _collapsed: boolean = this.isMobile;

  get expanded(): boolean {
    return !this._collapsed;
  }

  @ContentChild(forwardRef(() => MsRibbonMenu))
  menu: MsRibbonMenu;

  @ContentChildren(forwardRef(() => MsRibbonContentDef))
  _contentDefs: QueryList<MsRibbonContentDef>;
  get contentDefs(): Array<MsRibbonContentDef> {
    return this._contentDefs.toArray();
  }

  @ViewChild('container', {read: ViewContainerRef})
  container: ViewContainerRef;

  @ViewChild('layoutContainer')
  layout: ElementRef<HTMLDivElement>;

  get layoutHost(): HTMLDivElement {
    return this.layout.nativeElement;
  }

  private _contents: ComponentRef<MsRibbonContent>[] = [];

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  private _selectedIndex: number = 0;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private parentInjector: Injector,
              private _elementRef: ElementRef<HTMLElement>,
              private _changeDetector: ChangeDetectorRef) {
  }


  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.menu.role = 'tablist';
      this.menu.host.style.width = this.menuWidth + 'px';
      this.menu.layout.style.width = this.menuWidth + 'px';
      this.layoutHost.style.width = this.layoutWidth(this.expanded) + 'px';
      this.selectIndex(1);
    });

    if (this.contentDefs.length !== this.menu.items.length) {
      throw new Error(`${this.contentDefs.length} contents defs or ${this.menu.items.length} menu item`);
    }

    this.menu.change.subscribe(item => {
      const index = this.menu.items.indexOf(item);
      this.selectIndex(index);
    });

    this.collapse(this._collapsed);
    this._initialized = true;
  }

  collapse(state: boolean) {
    if (state) {
      this.collapseHide()
    } else {
      this.collapseShow();
    }
  }

  toggle() {
    this.menu.toggle();
    if (this.menu.collapsed) {
      this.collapseHide();
    } else {
      this.collapseShow();
    }
  }

  collapseHide() {
    this.menu.host.style.width = '48px';
    this.layoutHost.style.left = '48px';
    this.layoutHost.style.width = this.layoutWidth(false) + 'px';
    this._collapsed = true;
  }

  collapseShow() {
    this.menu.host.style.width = `${this.menuWidth}px`;
    this.layoutHost.style.left = `${this.menuWidth}px`;
    this.layoutHost.style.width = this.layoutWidth(true) + 'px';
    this._collapsed = false;
  }

  selectIndex(index: number): Promise<void> {
    index = this._coarseIndex(index);
    const item = this.menu.items[index];
    this.menu.activeItem(item);
    this._activateContent(item);

    this._selectedIndex = index;

    return Promise.resolve();
  }

  private _activateContent(item: MsRibbonMenuItem) {
    const index = this.menu.items.indexOf(item);
    const dir = this.selectedIndex > index ? 'down' : 'up';
    const currentContent = this._contents.find(c => c.instance.context.index === this.selectedIndex);

    const content = this._findRibbonContent(item);

    if (currentContent) {
      this._animateContentOut(currentContent.instance.host, dir);
    }
    this._animateContentIn(content.instance.host, dir);
  }

  selectNext(): Promise<void> {
    if (this.hasNext()) {
      return this.selectIndex(this.selectedIndex + 1);
    }
    return Promise.resolve();
  }

  selectPrev(): Promise<void> {
    if (this.hasPrev()) {
      return this.selectIndex(this.selectedIndex - 1);
    }
    return Promise.resolve();
  }


  hasNext(): boolean {
    return this.selectedIndex < this.length() - 1;
  }

  hasPrev(): boolean {
    return this.selectedIndex > 0;
  }

  length(): number {
    return this.menu.items.length;
  }

  private _findRibbonContent(item: MsRibbonMenuItem): ComponentRef<MsRibbonContent> {
    const index = this.menu.items.indexOf(item);
    const componentRef = this._contents.find(c => c.instance.context.index === index);
    if (componentRef) {
      return componentRef;
    }
    return this._createRibbonContent(item);
  }

  private _createRibbonContent(item: MsRibbonMenuItem): ComponentRef<MsRibbonContent> {
    const injector = this._createInjector(item);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MsRibbonContent);
    const contentRef = this.container.createComponent<MsRibbonContent>(componentFactory, 0, injector);
    contentRef.instance.host.classList.add('ms-hidden');
    contentRef.changeDetectorRef.detectChanges();
    this._contents.push(contentRef);
    return contentRef;
  }

  private _createInjector(item: MsRibbonMenuItem): Injector {
    const index = this.menu.items.indexOf(item);
    const context = new MsRibbonContentContext(index, item.label);
    const content = this.contentDefs[index];

    const providers: StaticProvider[] = [
      {provide: MsRibbonContentContext, useValue: context},
      {provide: MsRibbonContentDef, useValue: content}
    ];

    return Injector.create({parent: this.parentInjector, providers});
  }

  private async _animateContentOut(host: HTMLElement, dir: 'up' | 'down'): Promise<void> {
    const keyframe = dir === 'up' ? MS_MOTION_SLIDE_UP_OUT_TO : MS_MOTION_SLIDE_DOWN_OUT_TO;
    await gsap.gsap.to(host, .3, {...keyframe});
    host.classList.add('ms-hidden');
  }

  private async _animateContentIn(host: HTMLElement, dir: 'up' | 'down'): Promise<void> {
    const keyframe = dir === 'up' ? MS_MOTION_SLIDE_UP_IN_FROM : MS_MOTION_SLIDE_DOWN_IN_FROM;
    await gsap.gsap.fromTo(host, {...keyframe}, {translateY: 0, opacity: 1, duration: .3, delay: .2});
    host.classList.remove('ms-hidden');
  }

  private _coarseIndex(index: number): number {
    index = coerceNumberProperty(index, 0);
    if (index < 0) {
      return 0;
    } else if (index >= this.menu.items.length) {
      return this.menu.items.length - 1;
    }
    return index;
  }

  layoutWidth(expanded: boolean): number {
    if (this.collapseBehaviour === 'move') {
      return this.host.getBoundingClientRect().width - 48;
    }
    if (expanded) {
      return this.host.getBoundingClientRect().width - this.menuWidth;
    }
    return this.host.getBoundingClientRect().width - 48;
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}
