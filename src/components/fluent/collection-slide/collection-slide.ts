import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import {MsCollectionSlideDescription} from './collection-slide-description';
import {MsCollectionSlideItemContext, MsCollectionSlideItemDef} from './collection-slide-item-def';
import {MsMotionFunction, MsMotionTimings} from '../../core';

@Component({
  templateUrl: 'collection-slide.html',
  selector: 'MsCollectionSlide',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-collection-slide',
    '[class.ms-active]': 'focused',
    '[tabindex]': 'tabindex'
  }
})
export class MsCollectionSlide<T = any> implements AfterViewInit, OnDestroy {
  @Input()
  tabindex: number = 0;

  @Input()
  description: MsCollectionSlideDescription<T>;

  @Input()
  defaultControls: boolean = true;

  @Input()
  index: number = 0;

  @Output()
  get change(): EventEmitter<void> {
    return this._change;
  }

  private _change = new EventEmitter<void>();

  @ContentChild(MsCollectionSlideItemDef)
  templateRef: MsCollectionSlideItemDef<T>;

  @ViewChild('container', {read: ViewContainerRef})
  container: ViewContainerRef;

  @ViewChild('layout')
  layout: ElementRef<HTMLElement>;

  private _focused: boolean = false;
  get focused(): boolean {
    return this._focused;
  }

  get layoutHost(): HTMLElement {
    return this.layout.nativeElement;
  }

  /** Id of timeout used to hide slide buttons. */
  private _hideButtonTimeOutId: any;

  /** The index of the active slide */
  get activeIndex(): number {
    return this._activeIndex;
  }

  private _activeIndex: number = 0;

  get length(): number {
    return this.description?.length() || 0;
  }

  private _resizeObserver = new ResizeObserver(entries => {
    const width = (entries[0].target as HTMLElement).offsetWidth;
  });

  private _viewRefs: EmbeddedViewRef<MsCollectionSlideItemContext<T>>[] = [];
  private _currentViewRef: EmbeddedViewRef<MsCollectionSlideItemContext<T>>;

  get currentHost(): HTMLElement {
    return this._currentViewRef.rootNodes[0];
  }

  ngAfterViewInit(): void {
    if (!this.description) {
      throw new Error('You must provide a description of the slide.');
    }

    if (!this.templateRef) {
      throw new Error('You must provide a MsCollectionSlideDef template.');
    }

    this.activateIndex(this.index);
  }

  ngOnDestroy(): void {
    this._resizeObserver.disconnect();
  }

  async activateIndex(index: number): Promise<void> {
    const item = await this.description.find(index);

    const dir = this._getDir(index);

    if (this._currentViewRef) {
      this.animateItemOut(this.currentHost, dir);
    }

    const viewRef = this._getCurrentView(index, item);
    viewRef.detectChanges();

    if (this._currentViewRef) {
      this._animateItemIn(viewRef.rootNodes[0], dir);
    }

    this._currentViewRef = viewRef;
    this._activeIndex = index;
  }

  private _getDir(index: number): 'rtl' | 'ltr' {
    return this._currentViewRef?.context.index < index ? 'rtl' : 'ltr';
  }

  private _getCurrentView(index, item: T): EmbeddedViewRef<MsCollectionSlideItemContext<T>> {
    const viewRef = this._viewRefs.find(v => v.context.index === index);
    if (viewRef) {
      return viewRef;
    }
    return this._createItemView(index, item);
  }

  private _createItemView(index: number, item: T): EmbeddedViewRef<MsCollectionSlideItemContext<T>> {
    const context = new MsCollectionSlideItemContext<T>(item, index);
    const viewRef = this.container.createEmbeddedView(this.templateRef.template, context, 0);
    viewRef.rootNodes[0].classList.add('ms-collection-slide-item');

    if (this._currentViewRef) {
      viewRef.rootNodes[0].classList.add('ms-hidden');
    }

    this._viewRefs.push(viewRef);
    return viewRef;
  }

  private animateItemOut(host: HTMLElement, dir: 'rtl' | 'ltr'): Promise<void> {
    return MsMotionFunction.slideOut(host, {dir, duration: 300, easing: MsMotionTimings.decelerate});
  }

  private _animateItemIn(host: HTMLElement, dir: 'rtl' | 'ltr'): Promise<void> {
    return MsMotionFunction.slideIn(host, {dir, duration: 300, delay: 200, easing: MsMotionTimings.decelerate});
  }

  next(): Promise<void> {
    if (this.hasNext()) {
      return this.activateIndex(this._activeIndex + 1);
    }
    return Promise.resolve();
  }

  prev(): Promise<void> {
    if (this.hasPrev()) {
      return this.activateIndex(this._activeIndex - 1);
    }
    return Promise.resolve();
  }


  hasNext(): boolean {
    return this._activeIndex < this.description?.length() - 1;
  }

  hasPrev(): boolean {
    return this._activeIndex > 0;
  }


  @HostListener('keyup', ['$event'])
  onkeyup(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'Right') {
      this.next().then();
    } else if (event.key === 'ArrowLeft' || event.key === 'Left') {
      this.prev().then();
    }
  }

  @HostListener('focus')
  onfocus() {
    this._focused = true;
  }

  @HostListener('blur')
  onblur() {
    this._focused = false;
  }

  buttonClick(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      this.prev().then();
    } else {
      this.next().then();
    }
  }


}
