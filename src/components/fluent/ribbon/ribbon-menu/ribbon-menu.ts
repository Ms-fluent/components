import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MsRibbonMenuItem} from './ribbon-menu-item';
import {Observable, Subject} from 'rxjs';
import * as gsap from 'gsap';
import {coerceBooleanProperty, coerceNumberProperty} from '@angular/cdk/coercion';

@Component({
  templateUrl: 'ribbon-menu.html',
  selector: 'MsRibbonMenu',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-ribbon-menu',
    '[attr.role]': 'role',
    '[attr.aria-label]': 'ariaLabel',
    '[class.ms-collapsed]': 'collapsed'
  }
})
export class MsRibbonMenu implements AfterViewInit, AfterContentInit {
  private _isInitialized: boolean = false;
  @Input()
  id: string;

  @Input('aria-label')
  ariaLabel: string;

  @Input()
  label: string;

  @Input()
  role: 'tablist' | 'menubar';

  @Input()
  set selectedIndex(index: number) {
    if (this._isInitialized) {
      index = this._coarseIndex(index);
      this.selectIndex(index);
    } else {
      this._selectedIndex = coerceNumberProperty(index);
    }
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  private _selectedIndex: number = 0;

  @Input()
  set selectedLabel(label: string) {
    if (this._isInitialized) {
      this.selectLabel(label);
    } else {
      this._selectedLabel = label;
    }
  }

  get selectedLabel(): string {
    return this._selectedLabel;
  }

  private _selectedLabel: string;

  @Input()
  get collapsed(): boolean {
    return this._collapsed;
  }

  set collapsed(value: boolean) {
    value = coerceBooleanProperty(value);
    this._collapsed = value;
    this.changeDetector.markForCheck();
  }

  private _collapsed: boolean = false;

  @Output()
  get change(): Observable<MsRibbonMenuItem> {
    return this._change.asObservable();
  }

  private _change = new Subject<MsRibbonMenuItem>();

  @ContentChildren(forwardRef(() => MsRibbonMenuItem), {descendants: true})
  _items: QueryList<MsRibbonMenuItem>;
  get items(): MsRibbonMenuItem[] {
    return this._items.toArray();
  }

  @ViewChild('thumb')
  _thumb: ElementRef<HTMLElement>;

  get thumbHost(): HTMLElement {
    return this._thumb.nativeElement;
  }

  @ViewChild('layout')
  _layout: ElementRef<HTMLElement>;

  get layout():HTMLElement {
    return this._layout.nativeElement;
  }

  private _currentItem: MsRibbonMenuItem;
  get currentItem(): MsRibbonMenuItem {
    return this._currentItem;
  }

  _itemMouseenter = (event: MouseEvent) => {
    this._highlightThumb(this._currentItem);
  };

  _itemMouseleave = (event: MouseEvent) => {
    this._moveThumb(this._currentItem);
  };


  ngAfterContentInit(): void {
  }

  ngAfterViewInit(): void {
    this._attachItemClickEvent();
    this._items.changes.subscribe(() => this._attachItemClickEvent());

    Promise.resolve().then(() => {
      if (this._selectedLabel) {
        this.selectLabel(this._selectedLabel);
      } else {
        this.selectIndex(this._selectedIndex);
      }
      this.changeDetector.markForCheck();
    });
    this._isInitialized = true;
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  constructor(private _elementRef: ElementRef<HTMLElement>, public changeDetector: ChangeDetectorRef) {
  }

  _attachItemClickEvent() {
    this.items.forEach(item => {
      item.host.onclick = event => {
        const changed = item !== this._currentItem;
        this.activeItem(item);
        if (changed) {
          this._change.next(item);
        }
      }
    })
  }

  toggle(): boolean {
    this.collapsed = !this.collapsed;
    return this.collapsed;
  }

  activeItem(item: MsRibbonMenuItem) {
    if (this._currentItem) {
      this._currentItem.host.removeEventListener('mouseenter', this._itemMouseenter);
      this._currentItem.host.removeEventListener('mouseleave', this._itemMouseleave);
    }
    this._deactivateItems();
    this._activeItem(item);
    this._highlightThumb(item);

    item.host.addEventListener('mouseenter', this._itemMouseenter);
    item.host.addEventListener('mouseleave', this._itemMouseleave);
  }

  _activeItem(item: MsRibbonMenuItem) {
    this._currentItem = item;
    this._currentItem._isActive = true;
    this._selectedIndex = this.items.indexOf(item);
  }

  selectLabel(label: string): void {
    const item = this.items.find(i => i.label === label);

    if (!item) {
      throw new Error(`There are no menu item with '${label}' has label.`);
    }
    this.activeItem(item);
  }

  selectIndex(index: number): void {
    if (index < 0 && index > this.items.length - 1) {
      throw new Error(`There are no menu item with index=${index}.`);
    }
    const item = this.items[index];
    this.activeItem(item);
  }

  _deactivateItems() {
    this.items.forEach(item => {
      item._isActive = false;
    })
  }

  async _moveThumb(item: MsRibbonMenuItem): Promise<void> {
    const rect = item.iconContainer.getBoundingClientRect();
    await gsap.gsap.to(this.thumbHost, .3, {top: rect.y - this.host.getBoundingClientRect().y, height: rect.height});
    return Promise.resolve();
  }

  async _highlightThumb(item: MsRibbonMenuItem): Promise<void> {
    const rect = item.host.getBoundingClientRect();
    const top = rect.y - this.host.getBoundingClientRect().y + 6;
    const height = rect.height - 12;

    await gsap.gsap.to(this.thumbHost, .3, {top, height});
    return Promise.resolve();
  }

  /**
   * Opens submenu and moves focus to first item in the submenu.
   */
  _spaceKeyDown() {
  }

  _enterKeyDown() {
  }

  /**
   * Opens submenu and moves focus to first item in the submenu.
   * @private
   */
  _rightArrowKeyDown() {
  }


  /**
   * Opens submenu and moves focus to last item in the submenu.
   * @private
   */
  _leftArrowKeyDown() {
  }

  /**
   * - Moves focus to the previous item in the menubar.
   * - If focus is on the first item, moves focus to the last item.
   * @private
   */
  _upArrowKeyDown() {
  }


  /**
   * - Moves focus to the next item in the menubar.
   * - If focus is on the last item, moves focus to the first item.
   * @private
   */
  _downArrowKeyDown() {
  }

  /**
   * Opens submenu and moves focus to first item in the submenu.
   * @private
   */
  _homeKeyDown() {

  }

  /**
   * Moves focus to last item in the menubar.
   */
  _endKeyDown() {
  }

  /**
   * - Moves focus to next item in the menubar having a name that starts with the typed character.
   * - If none of the items have a name starting with the typed character, focus does not move.
   * @param char The key pressed by the user.
   * @private
   */
  _characterKeyDown(char: string) {
  }

  private _coarseIndex(index: number): number {
    index = coerceNumberProperty(index, 0);
    if (index < 0) {
      return 0;
    } else if (index >= this.items.length) {
      return this.items.length - 1;
    }
    return index;
  }

  get rect(): DOMRect {
    return this.host.getBoundingClientRect();
  }
}

