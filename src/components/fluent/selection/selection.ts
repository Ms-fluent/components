import {IMsSelection} from './ISelection';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import {MsSelectionToggle} from './selection-toggle';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: '[MsSelection], MsSelection',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-selection-zone',
    '[class.ms-unselectable]': '_shiftKey'
  }
})
export class MsSelection<T = any> implements IMsSelection<T>, AfterContentInit, OnDestroy {

  _lastShiftSelectedItem: MsSelectionToggle;

  _unselectable: boolean = false;
  _shiftKey: boolean = false;

  _initialized: boolean = false;

  @ContentChildren(forwardRef(() => MsSelectionToggle), {descendants: true})
  _toggleChildren: QueryList<MsSelectionToggle>;

  get toggleChildren(): Array<MsSelectionToggle> {
    return this._toggleChildren.toArray();
  }

  _selectionModel: SelectionModel<T>;

  get isAllSelected(): boolean {
    return this.toggleChildren.every(t => t.checked);
  }

  get selectedIndexes(): number[] {
    return this.toggleChildren.filter(t => t.checked).map((value, index) => index);
  }

  get selectedKeys(): string[] {
    return this.toggleChildren.filter(t => t.checked).map(value => value.key);
  }

  get value(): T {
    return this.values[0] || undefined;
  }

  @Output()
  valuesChange = new EventEmitter<T[]>();

  @Input()
  get values(): T[] {
    return this.toggleChildren.filter(t => t.checked).map(t => t.value);
  }

  set values(values: T[]) {
    if (this._initialized) {
      if (values) {
        this.selectValues(...values);
      }
    } else {
      this._initialValues = values;
    }
  }

  private _initialValues: T[];

  _keydownEvent = (event: KeyboardEvent) => {
    if (event.shiftKey) {
      this._shiftKey = true;
    }
  };

  _keyup = () => {
    this._shiftKey = false;
  };

  _itemClickEvent = (toggle) => {
    this._onItemClick(toggle);
  };

  ngAfterContentInit(): void {
    document.addEventListener('keydown', this._keydownEvent);
    document.addEventListener('keyup', this._keyup);

    this._toggleChildren.forEach(toggle => {
      this._attachItemClick(toggle);
    });

    this._toggleChildren.changes.subscribe(changes => {
      this._toggleChildren.forEach(toggle => {
        this._attachItemClick(toggle);
      });
    });

    Promise.resolve().then(() => {
      if (this._initialValues) {
        this.selectValues(...this._initialValues);
      }
    });

    this._initialized = true;
  }

  _attachItemClick(toggle: MsSelectionToggle) {
    if (!toggle._attachedEvent) {
      toggle.host.addEventListener('click', () => {
        this._onItemClick(toggle);
      });
      toggle._attachedEvent = true;
    }
  }

  _onItemClick(toggle: MsSelectionToggle) {
    if (this._shiftKey) {
      const range = this._getShiftSelectRange(this._lastShiftSelectedItem, toggle);
      this.uniqueSelectRange(range[0], range[1]);
    } else {
      toggle.toggle();
      if (toggle.checked) {
        this._lastShiftSelectedItem = toggle;
      }
    }

    this.valuesChange.emit(this.values);
  }

  _getShiftSelectRange(fromToggle: MsSelectionToggle, toToggle: MsSelectionToggle): [number, number] {
    let _fromIndex = this.toggleChildren.indexOf(fromToggle);
    if (_fromIndex < 0) {
      _fromIndex = 0;
    }
    const _to = this.toggleChildren.indexOf(toToggle) + 1;

    let fromIndex = _fromIndex;
    let to = _to;

    if (_fromIndex > _to) {
      fromIndex = _to - 1;
      to = _fromIndex + 1;
    }
    return [fromIndex, to];
  }

  ngOnDestroy(): void {
  }

  isIndexSelected(...indexes: number[]): boolean {
    const items = indexes.map(i => this.toggleChildren[i]).filter(t => !!t);
    return items.every(t => t.checked);
  }

  isKeySelected(...key: string[]): boolean {
    const items = this.toggleChildren.filter(t => key.indexOf(t.key) > -1);
    return items.every(t => t.checked);
  }

  isRangeSelected(fromIndex: number, count: number): boolean {
    const items = this.toggleChildren.slice(fromIndex, count);
    return items.every(t => t.checked);
  }

  isValueSelected(...values: T[]): boolean {
    const items = this.toggleChildren.filter(t => values.indexOf(t.value) > -1);
    return items.every(t => t.checked);
  }


  uniqueSelectRange(from: number, to: number): void {
    this._deselectRange(0, from);
    this._selectRange(from, to);
    this._deselectRange(to, this.toggleChildren.length);
    this.valuesChange.emit(this.values);
  }

  selectAll(): void {
    this.toggleChildren.forEach(t => t.checked = true);
    this.valuesChange.emit(this.values);
  }

  selectIndexes(...indexes: number[]): void {
    const items = indexes.map(i => this.toggleChildren[i]);
    this.selectItem(...items);
  }

  selectKeys(...keys: string[]): void {
    const items = keys.map(k => this.toggleChildren.find(t => t.key === k));
    this.selectItem(...items);
  }

  selectValues(...values: T[]): void {
    const items = values.map(v => this.toggleChildren.find(t => t.value === v));
    this.selectItem(...items);
  }

  selectRange(fromIndex: number, count: number): void {
    const items = this.toggleChildren.slice(fromIndex, count);
    this.selectItem(...items);
  }

  _selectRange(fromIndex: number, count: number): void {
    const items = this.toggleChildren.slice(fromIndex, count);
    items.forEach(item => item.checked = true);
  }

  selectItem(...items: MsSelectionToggle[]) {
    items.forEach(item => {
      if (item) {
        item.checked = true;
      }
    });
    this.valuesChange.emit(this.values);
  }

  toggleIndex(...indexes: number[]): void {
    const items = indexes.map(i => this.toggleChildren[i]);
    this.toggleItem(...items);
  }

  toggleKeys(...keys: string[]): void {
    const items = keys.map(k => this.toggleChildren.find(t => t.key === k));
    this.toggleItem(...items);
  }

  toggleRange(fromIndex: number, count: number): void {
    this.toggleItem(...this.toggleChildren.slice(fromIndex, count));
  }

  toggleAll(): void {
    this.toggleItem(...this.toggleChildren);
  }

  toggleValue(...values: T[]): void {
    const items = values.map(v => this.toggleChildren.find(t => t.value === v));
    this.toggleItem(...items);
  }

  toggleItem(...items: MsSelectionToggle[]) {
    items.forEach(item => item.toggle());
    this.valuesChange.emit(this.values);
  }


  deselectAll(): void {
    this._deselectItem(...this.toggleChildren);
  }

  deselectIndex(...indexes: number[]): void {
    const items = indexes.map(i => this.toggleChildren[i]);
    this._deselectItem(...items);
  }

  deselectKeys(...keys: string[]): void {
    const items = keys.map(k => this.toggleChildren.find(t => t.key === k));
    this._deselectItem(...items);
  }

  deselectValue(...values: T[]): void {
    const items = values.map(k => this.toggleChildren.find(t => t.value === k));
    this._deselectItem(...items);
  }

  deselectRange(fromIndex: number, count: number): void {
    this._deselectItem(...this.toggleChildren.slice(fromIndex, count));
  }

  _deselectRange(fromIndex: number, count: number): void {
    this.toggleChildren.slice(fromIndex, count)
      .forEach(item => item.checked = false);
  }

  _deselectItem(...items: MsSelectionToggle[]) {
    items.forEach(item => item.checked = false);
    this.valuesChange.emit(this.values);
  }
}
