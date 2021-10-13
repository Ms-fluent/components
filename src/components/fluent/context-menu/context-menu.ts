import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import {MsContextMenuItem} from './context-menu-item';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

let _uniqueId = 0;

@Component({
  templateUrl: 'context-menu.html',
  selector: 'msContextMenu, ms-context-menu, MsContextMenu',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-contextMenu ms-depth-4',
    '[class.selectable]': 'selectable',
    role: 'menu'
  }
})
export class MsContextMenu<T = any> implements AfterContentInit {
  _initialized: boolean = false;
  _uniqueId = `ms-context-menu-${_uniqueId++}`;

  @ContentChildren(forwardRef(() => MsContextMenuItem))
  _items: QueryList<MsContextMenuItem>;

  get items(): MsContextMenuItem[] {
    return this._items.toArray();
  }

  get isAllSelected(): boolean {
    return this.items.every(t => t.checked);
  }

  @Input()
  id: string = this._uniqueId;

  @Input()
  selectable: boolean = false;

  @Input()
  set selectedIndexes(indexes: number[]) {
  }

  get selectedIndexes(): number[] {
    return this.items.filter(t => t.checked).map(value => value._index);
  }

  @Input()
  set selectedKeys(keys: string[]) {
  }

  get selectedKeys(): string[] {
    return this.items.filter(t => t.checked).map(value => value.key);
  }

  get selectedItems(): MsContextMenuItem[] {
    return this.items.filter(item => item.checked);
  }

  _change = new Subject<MsContextMenuItem[]>();

  @Output()
  valuesChange = this._change.pipe(map(item => item.map(i => i.value)));
  @Output()
  valueChange = this._change.pipe(map(item => item.map(i => i.value)[0]));

  @Output()
  selectedKeysChange = this._change.pipe(map(item => item.map(i => i.key)));


  @Input()
  get values(): T[] {
    return this.items.filter(t => t.checked).map(t => t.value);
  }

  set values(values: T[]) {
    if (this._initialized) {
      if (values) {
        this._selectValues(...values);
      }
    } else {
      this._initialValues = values;
    }
  }

  private _initialValues: T[];

  @Input()
  get value(): T {
    return this.values.length > 1 ? this.values[0] : undefined;
  }

  set value(value: T) {
    if (this._initialized) {
      this._selectValues(value);
    }
    this._initialValue = value;
  }

  _initialValue: T;

  constructor(private _changeDetector: ChangeDetectorRef) {
  }

  ngAfterContentInit(): void {
    this.items.forEach((item, index) => item._index = index);
    this._items.forEach(toggle => {
      this._attachItemClick(toggle);
    });

    this._items.changes.subscribe(changes => {
      this.items.forEach((item, index) => item._index = index);
      this._items.forEach(toggle => {
        this._attachItemClick(toggle);
      });
    });

    Promise.resolve().then(() => {
      if (this._initialValues) {
        this._selectValues(...this._initialValues);
      }
      if (this._initialValue) {
        this._selectValues(this._initialValue);
      }
    });

    this._initialized = true;
  }

  _attachItemClick(toggle: MsContextMenuItem) {
    if (!toggle._attachedClickEvent) {
      toggle.host.addEventListener('click', () => {
        toggle.toggle();
        this._emitValuesChange();
      });
      toggle._attachedClickEvent = true;
    }
  }

  _emitValuesChange() {
    this._change.next(this.items.filter(c => c.checked));
  }

  isIndexSelected(...indexes: number[]): boolean {
    const items = indexes.map(i => this.items[i]).filter(t => !!t);
    return items.every(t => t.checked);
  }

  isKeySelected(...key: string[]): boolean {
    const items = this.items.filter(t => key.indexOf(t.key) > -1);
    return items.every(t => t.checked);
  }

  isRangeSelected(fromIndex: number, count: number): boolean {
    const items = this.items.slice(fromIndex, count);
    return items.every(t => t.checked);
  }

  isValueSelected(...values: T[]): boolean {
    const items = this.items.filter(t => values.indexOf(t.value) > -1);
    return items.every(t => t.checked);
  }

  selectAll(): void {
    this.items.forEach(t => t.checked = true);
    this._emitValuesChange();
  }

  selectIndexes(...indexes: number[]): void {
    const items = indexes.map(i => this.items[i]);
    this.selectItem(...items);
  }

  selectKeys(...keys: string[]): void {
    const items = keys.map(k => this.items.find(t => t.key === k));
    this.selectItem(...items);
  }

  selectValues(...values: T[]): void {
    const items = values.map(v => this.items.find(t => t.value === v));
    this.selectItem(...items);
  }

  selectRange(fromIndex: number, count: number): void {
    const items = this.items.slice(fromIndex, count);
    this.selectItem(...items);
  }

  _selectValues(...values: T[]): void {
    const items = values.map(v => this.items.find(t => t.value === v));
    this._selectItem(...items);
  }

  _selectRange(fromIndex: number, count: number): void {
    const items = this.items.slice(fromIndex, count);
    items.forEach(item => item.checked = true);
  }

  selectItem(...items: MsContextMenuItem[]) {
    items.forEach(item => {
      if (item) {
        item.checked = true;
      }
    });
    this._emitValuesChange();
  }

  _selectItem(...items: MsContextMenuItem[]) {
    items.forEach(item => item.checked = true);
  }

  toggleIndex(...indexes: number[]): void {
    const items = indexes.map(i => this.items[i]);
    this.toggleItem(...items);
  }

  toggleKeys(...keys: string[]): void {
    const items = keys.map(k => this.items.find(t => t.key === k));
    this.toggleItem(...items);
  }

  toggleRange(fromIndex: number, count: number): void {
    this.toggleItem(...this.items.slice(fromIndex, count));
  }

  toggleAll(): void {
    this.toggleItem(...this.items);
  }

  toggleValue(...values: any[]): void {
    const items = values.map(v => this.items.find(t => t.value === v));
    this.toggleItem(...items);
  }

  toggleItem(...items: MsContextMenuItem[]) {
    items.forEach(item => item.toggle());
    this._emitValuesChange();
  }


  deselectAll(): void {
    this._deselectItem(...this.items);
  }

  deselectIndex(...indexes: number[]): void {
    const items = indexes.map(i => this.items[i]);
    this._deselectItem(...items);
  }

  deselectKeys(...keys: string[]): void {
    const items = keys.map(k => this.items.find(t => t.key === k));
    this._deselectItem(...items);
  }

  deselectValue(...values: T[]): void {
    const items = values.map(k => this.items.find(t => t.value === k));
    this._deselectItem(...items);
  }

  deselectRange(fromIndex: number, count: number): void {
    this._deselectItem(...this.items.slice(fromIndex, count));
  }

  _deselectRange(fromIndex: number, count: number): void {
    this.items.slice(fromIndex, count)
      .forEach(item => item.checked = false);
  }

  _deselectItem(...items: MsContextMenuItem[]) {
    items.forEach(item => item.checked = false);
    this._emitValuesChange();
  }
}
