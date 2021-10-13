import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit, Output,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {msPickerAnimations} from './picker-animations';
import {MsPersonaSize} from '../persona/public-api';

export type MsPickerSearchFn<T> = (key: string) => Promise<Array<T>>;
export type MsPickerFormatFn<T> = (item: T) => string

/**
 * Provider Expression that allows Checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MS_PICKER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsPicker),
  multi: true
};


let uniqueId = 0;

@Component({
  templateUrl: 'picker.html',
  selector: 'ms-picker, MsPicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [MS_PICKER_CONTROL_VALUE_ACCESSOR],
  animations: [
    msPickerAnimations.transformPanelWrap,
    msPickerAnimations.transformPanel
  ],
  host: {
    class: 'ms-picker'
  }
})
export class MsPicker<T> implements OnInit, ControlValueAccessor {
  @Input()
  searchFn: MsPickerSearchFn<T>;

  @Input()
  formatFn: MsPickerFormatFn<T> = (item: T) => item ? item.toString() : 'null';

  @Input()
  maxSize: number;

  @Input()
  itemSize: number = 6;

  @Input()
  personaSize: MsPersonaSize = 'size32';

  @Input()
  name: string = `ms-picker-${uniqueId++}`;

  @Output()
  change: EventEmitter<T[]> = new EventEmitter<T[]>();

  values: T[] = [];


  _items: T[] = [];

  _openPanel: boolean = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (!this.searchFn) {
      throw new Error('You must provide a non null searchFn');
    }

    Promise.resolve().then(() => {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
    });
  }


  close() {
    this._openPanel = false;
    this._changeDetectorRef.markForCheck();
  }

  async _inputFocus() {
    await this.searchItems('');
    this._openPanel = true;
    this._changeDetectorRef.markForCheck();
  }

  _keypress(value: string) {
    this.searchItems(value);
  }

  async searchItems(value: string) {
    const _result = await this.searchFn(value);
    this._items = _result;

    this._changeDetectorRef.markForCheck();
  }

  select(item: T) {
    if (this.maxSize && this.values.length >= this.maxSize) {
      return;
    }
    if (this.values.find(i => i === item)) {
      return;
    }

    this.values.push(item);
    this.change.emit(this.values);
    this._controlValueAccessorChangeFn(this.getValue());
    this._changeDetectorRef.markForCheck();
    this.close();
  }

  removeValue(value: T) {
    this.values = this.values.filter(item => item !== value);
    this.change.emit(this.values);
    this._controlValueAccessorChangeFn(this.getValue());
    this._changeDetectorRef.markForCheck();
  }

  blur() {
    this._openPanel = false;
  }

  get openPanel() {
    return this._openPanel;
  }

  private _onTouched: () => any = () => {
  };
  private _controlValueAccessorChangeFn: (value: any) => void = () => {
  };

  registerOnChange(fn: any): void {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.values = obj;
    }
  }

  get value(): T {
    if (this.values.length > 0) {
      return this.values[0];
    }
    return null;
  }

  getValue(): T | T[] | null {
    if (this.maxSize === 1) {
      return this.value;
    }
    return this.values;
  }

  getInitial(name: string) {
    const values = name.trim().split(' ');
    let initial = values[0][0] || '';
    if (values.length > 1) {
      initial += values[1][0] || '';
    }
    return initial.toUpperCase();
  }
}
