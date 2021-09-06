import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver, ComponentRef,
  ContentChild,
  EventEmitter,
  Inject,
  Injector,
  Input, OnDestroy,
  OnInit,
  Optional,
  Output, StaticProvider,
  ViewEncapsulation
} from '@angular/core';
import {MsPivotHeader} from './header/pivot-header';
import {MsPivotBody} from './pivot-body';
import {MsPivotLabel} from './label/pivot-label';
import {MsPivotContent, MsPivotContentDef} from './pivot-content';
import {MsPivotContentContext} from './pivot-content-context';
import {ActivatedRoute, Router} from '@angular/router';
import {MS_PIVOT_DEFAULT_OPTIONS, MsPivotDefaultOptions} from './pivot-options';
import {PivotState} from './pivot-state';
import ResizeObserver from 'resize-observer-polyfill';
import {MsMotionFunction, MsMotionSlideDir, MsMotionTimings} from "../../core";

export class MsPivotChangeEvent {
  label: MsPivotLabel;
  content: MsPivotContent;
}

let _uniqueId = 0;

@Component({
  template: `
      <ng-content></ng-content>`,
  selector: 'ms-pivot, msPivot, MsPivot',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,

  host: {
    'class': 'ms-pivot',
    'role': 'tab',
    '[attr.id]': 'id'
  }
})
export class MsPivot implements AfterViewInit, AfterContentInit, OnInit, OnDestroy {
  private _isInitialized: boolean = false;
  private _uniqueId = `ms-label-${_uniqueId++}`;

  @Input()
  id: string = this._uniqueId;

  @Input()
  useRouting: boolean = this._defaultOptions.useRouting;

  @Input()
  paramName: string = this._defaultOptions.paramName;

  @Output()
  change = new EventEmitter<MsPivotChangeEvent>();

  /** The index of the active tab. */
  @Input()
  get selectedIndex(): number | null {
    return this._selectedIndex;
  }

  set selectedIndex(index: number) {
    if (this._isInitialized) {
      this.activeAt(index, false).then();
    } else {
      this._selectedIndex = index;
    }
  }

  private _selectedIndex: number | null = null;


  /** The id of the active tab. */
  @Input()
  get selectedId(): string | null {
    return this._selectedId;
  }

  set selectedId(id: string) {
    if (this._isInitialized) {
      this.selectLabel(id, false).then();
    } else {
      this._selectedId = id;
    }
  }

  private _selectedId: string | null = null;

  private _selectedLabel: MsPivotLabel = null;
  get selectedLabel(): MsPivotLabel {
    return this._selectedLabel;
  }

  @ContentChild(MsPivotHeader)
  header: MsPivotHeader;


  @ContentChild(MsPivotBody)
  body: MsPivotBody;

  pivotState = new PivotState();

  private _resizeObserver = new ResizeObserver(entries => {
    const width = (entries[0].target as HTMLElement).offsetWidth;
    // this.body.flexLayout.nativeElement.style.width = `${width * this.body.containers.length}px`;
    // this.body.moveAt(this.selectedIndex);
  });

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              @Inject(MS_PIVOT_DEFAULT_OPTIONS) private _defaultOptions: MsPivotDefaultOptions,
              private parentInjector: Injector,
              @Optional() private _router: Router,
              private _route: ActivatedRoute) {

  }

  ngAfterContentInit(): void {
  }

  ngOnInit(): void {
  }

  getInitialLabel(): string {
    if (this._selectedId) {
      return this._selectedId;
    }
    return this.pivotState.getActiveLabel(this.id);
  }

  ngAfterViewInit(): void {
    this._selectedId = this.getInitialLabel();
    console.log('SelectedId: ' + this._selectedId);
    if (this.header.labels.length !== this.body.contents.length) {
      throw new Error(`The pivot should have the same number of labels and contents.`);
    }


    this.labels.forEach((label, index) => label._index = index);
    this.labels.forEach(label => label.host.addEventListener('click', () => this.select(label, true)));

    Promise.resolve().then(() => {
      if (this.selectedId) {
        this.selectLabel(this.selectedId, false);
      } else {
        this.activeAt(this._selectedIndex != null ? this._selectedIndex : 0, false);
      }

    });
    this._resizeObserver.observe(this.body.host);
    this._isInitialized = true;
  }

  ngOnDestroy(): void {
    this._resizeObserver.disconnect();
  }

  selectIndex(index: number, clickEvent: boolean) {
    return this.activeAt(index, clickEvent);
  }

  activeAt(index: number, clickEvent: boolean) {
    index = this._coarseIndex(index);

    const contentDef = this.contents[index];

    const selectedLabel = this._selectLabel(index, clickEvent);

    if (!selectedLabel._contentRef) {
      selectedLabel._contentRef = this._createPivotContent(index, contentDef);
    }

    if (this.selectedLabel) {
      const dir = index < this.selectedLabel._index ? 'ltr' : 'rtl';

      this._animateContentOut(this.selectedLabel.contentHost, dir).then(() => {
        this._animateContentIn(selectedLabel.contentHost, dir).then();
      });

    } else {
      selectedLabel._contentRef.instance.host.classList.remove('ms-hidden');
    }

    this.body.host.style.height = selectedLabel._contentRef.instance.layoutHost.getBoundingClientRect().height + 'px';

    this._selectedIndex = index;
    this._selectedLabel = selectedLabel;

    this.change.emit({label: this._selectedLabel, content: this._selectedLabel._contentRef.instance});

    this.pivotState.setActiveLabel(this.id, this._selectedLabel.id);

    return Promise.resolve();
  }

  private _selectLabel(index: number, extended: boolean): MsPivotLabel {
    const label = this.labels[index];
    this.header.selectLabel(label, extended).then();

    this.labels.filter(l => l !== label)
      .forEach(item => {
        item._isActive = false;
        item.markForCheck();
      });

    label._isActive = true;

    return label;
  }

  private _coarseIndex(index: number): number {
    if (index < 0) {
      return 0;
    } else if (index >= this.header.labels.length) {
      return this.header.labels.length - 1;
    }
    return index;
  }

  private _createPivotContent(index: number, content: MsPivotContentDef): ComponentRef<MsPivotContent> {
    const injector = this._createInjector(index, content);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MsPivotContent);
    const contentRef = this.body.container.createComponent<MsPivotContent>(componentFactory, 0, injector);
    contentRef.instance.host.classList.add('ms-hidden');
    contentRef.changeDetectorRef.detectChanges();
    return contentRef;
  }

  private _createInjector(index: number, content: MsPivotContentDef): Injector {
    const context = new MsPivotContentContext(index, this.body.contents.length);

    const providers: StaticProvider[] = [
      {provide: MsPivotContentContext, useValue: context},
      {provide: MsPivotContentDef, useValue: content}
    ];

    return Injector.create({parent: this.parentInjector, providers});
  }

  selectLabel(id: string, clickEvent: boolean) {
    const label = this.labels.find(l => l.id === id);
    if (!label) {
      throw new Error(`There are no label with id=${id}.`);
    }

    return this.select(label, clickEvent);
  }

  private _animateContentOut(host: HTMLElement, dir: MsMotionSlideDir): Promise<void> {
    return MsMotionFunction.slideOut(host, {
      dir,
      duration: 300,
      delay: 0,
      easing: MsMotionTimings.decelerate
    });
  }

  private _animateContentIn(host: HTMLElement, dir: MsMotionSlideDir): Promise<void> {
    return MsMotionFunction.slideIn(host, {
      dir,
      duration: 300,
      delay: 50,
      easing: MsMotionTimings.decelerate
    });
  }

  select(label: MsPivotLabel, clickEvent: boolean) {
    const index = this.labels.indexOf(label);
    return this.activeAt(index, clickEvent);
  }

  selectNext(): Promise<void> {
    if (this.hasNext()) {
      return this.selectIndex(this.selectedIndex + 1, false);
    }
    return Promise.resolve();
  }

  selectPrev(): Promise<void> {
    if (this.hasPrev()) {
      return this.selectIndex(this._selectedIndex - 1, false);
    }
    return Promise.resolve();
  }


  hasNext(): boolean {
    return this._selectedIndex < this.length() - 1;
  }

  hasPrev(): boolean {
    return this.selectedIndex > 0;
  }

  get labels(): Array<MsPivotLabel> {
    return this.header.labels.toArray();
  }


  get contents(): Array<MsPivotContentDef> {
    return this.body.contents.toArray();
  }

  length(): number {
    return this.header.labels.length;
  }
}
