import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter, HostListener,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsPaginatorPage} from './page';
import {MsPaginatorItemsFn, MsPaginatorState} from './paginator-options';
import {MsPaginatorPageDef} from './page-def';
import {MsMotionTimings} from "../../core";

@Component({
  templateUrl: 'paginator.html',
  selector: 'ms-paginator, msPaginator, MsPaginator',
  exportAs: 'msPaginator',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-paginator'
  }
})
export class MsPaginator<T> implements AfterViewInit {
  private _initialized: boolean;

  @Input()
  get totalSize(): number {
    return this._totalSize;
  }

  set totalSize(value: number) {
    if (this._initialized) {
      this.changeTotalSize(value);
    }
    this._totalSize = +value;
  }

  private _totalSize: number;


  @Input()
  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    if (this._initialized) {
      this.changePageSize(value);
    }
    this._pageSize = +value;
  }

  private _pageSize: number;

  @Input()
  get currentPageIndex(): number {
    return this._currentPageIndex;
  }

  set currentPageIndex(value: number) {
    if (this._initialized) {
      this.changePage(+value);
    } else {
      this._currentPageIndex = +value;
    }
  }

  private _currentPageIndex: number = 0;

  private _currentPage: MsPaginatorPage<T>;

  get currentPage(): MsPaginatorPage<T> {
    return this._currentPage;
  }

  /** Function to get data items. */
  @Input()
  get itemsFn(): MsPaginatorItemsFn<T> {
    return this._itemsFn;
  }

  set itemsFn(value: MsPaginatorItemsFn<T>) {
    this._itemsFn = value;
  }


  private _itemsFn: MsPaginatorItemsFn<T>;

  private _pages: MsPaginatorPage<T>[] = [];
  get pages(): MsPaginatorPage<T>[] {
    return this._pages;
  }


  @Output()
  public readonly pageChange: EventEmitter<MsPaginatorPage<T>> = new EventEmitter<MsPaginatorPage<T>>();

  @Output()
  public readonly stateChange: EventEmitter<MsPaginatorState> = new EventEmitter<MsPaginatorState>();

  @ViewChild('pageContainer', {read: ViewContainerRef})
  pageContainer: ViewContainerRef;

  @ContentChild(MsPaginatorPageDef)
  pageDef: MsPaginatorPageDef<MsPaginatorPage<T>>;

  constructor(private _changeDetector: ChangeDetectorRef,
              private _elementRef: ElementRef<HTMLElement>) {
  }

  async ngAfterViewInit() {
    this.pageContainer.clear();
    this._initialized = true;

    this.changePage(this._currentPageIndex);
  }

  reset(index: number) {
    this.pageContainer.clear();
    this._pages = [];
    this._currentPage = null;
    this._currentPageIndex = 0;
    this.changePage(index);
  }

  @HostListener('swipeleft')
  swipeleft() {
    this.nextPage().then();
  }

  @HostListener('swiperight')
  swiperight() {
    this.previousPage().then();
  }

  nextPage(): Promise<MsPaginatorPage<T>> {
    if (this.currentPageIndex < this.lastPageIndex) {
      return this.changePage(this.currentPageIndex + 1);
    }
    return Promise.resolve(undefined);
  }

  previousPage(): Promise<MsPaginatorPage<T>> {
    if (this.currentPageIndex > 0) {
      return this.changePage(this.currentPageIndex - 1);
    }
    return Promise.resolve(undefined);
  }

  firstPage(): Promise<MsPaginatorPage<T>> {
    return this.changePage(0);
  }

  lastPage(): Promise<MsPaginatorPage<T>> {
    return this.changePage(this.lastPageIndex);
  }

  async changePage(index: number): Promise<MsPaginatorPage<T>> {
    if (index < 0) {
      index = 0;
    } else if (index > this.lastPageIndex) {
      index = this.lastPageIndex;
    }

    if (this.currentPage) {
      await this.fadeOut(this.currentPage.viewRef.rootNodes[0]);
      this.pageContainer.detach(0);
    }

    const forward = index > this._currentPageIndex;

    let page: MsPaginatorPage<T> = this._pages[index];

    if (!page) {
      page = this._createPage(index);
      page.items = await this.itemsFn(index, this.pageSize);
      page.viewRef = this.pageContainer.createEmbeddedView<MsPaginatorPage<T>>(this.pageDef.template, page);
    } else {
      this.pageContainer.insert(page.viewRef)
    }


    page.viewRef.detectChanges();
    this.moveCurrentPage(page.viewRef.rootNodes[0], forward);


    this._currentPage = page;
    this._currentPageIndex = index;

    this._pages[index] = page;

    this.pageChange.emit(page);
    return Promise.resolve(page);
  }

  private _createPage(index: number): MsPaginatorPage<T> {
    const page = new MsPaginatorPage<T>();
    const start = this.pageSize * index;
    page.index = index;
    page.start = start;
    page.previousPageIndex = index > 0 ? index - 1 : undefined;

    return page;
  }

  fadeOut(element: HTMLElement): Promise<void> {
    return new Promise<void>(resolve => {
      element.animate([
        {opacity: 1},
        {opacity: 0}
      ], {duration: 100})
        .onfinish = () => resolve();
    })
  }

  moveCurrentPage(element: HTMLElement, forward: boolean = true) {
    let width = this.host.getBoundingClientRect().width;
    if (!forward) {
      width = -width;
    }
    element.style.transform = `translateX(${width}px)`;

    element.animate([
      {transform: `translateX(${width}px)`, opacity: 0},
      {transform: `translateX(0)`, opacity: 1}
    ], {fill: 'both', duration: 100, easing: MsMotionTimings.decelerate})
  }

  get hasPreviousPage(): boolean {
    return this._currentPageIndex >= 1;
  }

  get hasNextPage(): boolean {
    const maxPageIndex = this.pageCount - 1;
    return this._currentPageIndex < maxPageIndex && this.pageSize !== 0;
  }

  get pageCount(): number {
    if (!this.pageSize) {
      return 0;
    }
    return Math.ceil(this.totalSize / this.pageSize);
  }

  get lastPageIndex(): number {
    return this.pageCount - 1;
  }

  get pageIndexes(): number[] {
    const pages = [];
    for (let i = 0; i < this.pageCount; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePageSize(size: number) {
  }

  changeTotalSize(size: number) {
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
