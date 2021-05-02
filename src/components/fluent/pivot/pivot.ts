import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ContentChild,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnInit,
  Optional,
  Output,
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

export class MsPivotChangeEvent {
  label: MsPivotLabel;
  content: MsPivotContent;
}

let _uniqueId = 0;

@Component({
  template: `
      <ng-content></ng-content>`,
  selector: 'ms-pivot, msPivot',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,

  host: {
    'class': 'ms-pivot',
    '[attr.role]': '\'tab\'',
    '[attr.id]': 'id'
  }
})
export class MsPivot implements AfterViewInit, AfterContentInit, OnInit {
  private _isInitialized: boolean = false;
  private _uniqueId = `ms-label-${_uniqueId++}`;

  private _animationDuration: number = 200;

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
    this.labels.forEach(label => label.click.subscribe(() => this.select(label, true)));

    Promise.resolve().then(() => {
      if (this.selectedId) {
        this.selectLabel(this.selectedId, false);
      } else {
        this.activeAt(this._selectedIndex != null ? this._selectedIndex : 0, false);
      }

    });
    this._isInitialized = true;
  }

  selectIndex(index: number, clickEvent: boolean) {
    return this.activeAt(index, clickEvent);
  }

  activeAt(index: number, clickEvent: boolean) {

    if (index < 0) {
      index = 0;
    } else if (index >= this.header.labels.length) {
      index = this.header.labels.length - 1;
    }

    const label = this.labels[index];
    const content = this.contents[index];
    const container = this.body.containers.toArray()[index];

    this.header.selectLabel(label, clickEvent).then();

    this.labels.forEach(item => {
      item._isActive = false;
      item.markForCheck();
    });
    label._isActive = true;
    label.host.blur();

    this._selectedIndex = index;
    this._selectedLabel = label;

    const injector: Injector = this._createInjector(index, content);

    if (this._selectedLabel._contentRef) {
      // this._selectedContentRef.destroy();
    } else {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MsPivotContent);
      this._selectedLabel._contentRef = container.createComponent<MsPivotContent>(componentFactory, 0, injector);
      this._selectedLabel._contentRef.changeDetectorRef.detectChanges();
    }

    this.body.moveAt(index);
    this.change.emit({label: this._selectedLabel, content: this._selectedLabel._contentRef.instance});

    this.pivotState.setActiveLabel(this.id, this._selectedLabel.id);

    return Promise.resolve();
  }

  private _createInjector(index: number, content: MsPivotContentDef): Injector {
    const context = new MsPivotContentContext(index, this.body.contents.length);
    const parentInjector = this.parentInjector;
    return {
      get(token: any, notFoundValue?: any): any {
        const customTokens = new WeakMap<any, any>([
          [MsPivotContentContext, context],
          [MsPivotContentDef, content]
        ]);
        const value = customTokens.get(token);

        if (typeof value !== 'undefined') {
          return value;
        }

        return parentInjector.get(token, notFoundValue);
      }

    };
  }

  selectLabel(id: string, clickEvent: boolean) {
    const label = this.labels.find(l => l.id === id);
    if (!label) {
      throw new Error(`There are no label with id=${id}.`);
    }

    return this.select(label, clickEvent);
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
