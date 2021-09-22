import {Directive, ElementRef, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import Cleave from 'cleave.js';
import moment from 'moment';

export const DATE_MASK_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsCleaveDateMaskDirective),
  multi: true
};

@Directive({
  selector: 'input[MsDateMask], input[ms-date-mask]',
  providers: [DATE_MASK_CONTROL_VALUE_ACCESSOR],
  host: {
    'autocomplete': 'off'
  }

})
export class MsCleaveDateMaskDirective implements ControlValueAccessor, OnInit, OnDestroy {
  private _mask: Cleave;

  @Input()
  dateFormat: string = 'DD-MM-YYYY';

  @Input()
  datePattern: string[] = ['d', 'm', 'Y'];

  @Input()
  delimiter: string = '/';

  constructor(private _elementRef: ElementRef<HTMLInputElement>) {

  }

  ngOnInit(): void {
    this._mask = new Cleave(this._elementRef.nativeElement, {
      date: true,
      delimiter: this.delimiter,
      datePattern: this.datePattern,

      onValueChanged: (event: any): void => {
        const time: string = event.target.value;
        const date = moment(time, this.dateFormat);
        this._onChange(date.toDate());
      }
    });
  }

  ngOnDestroy(): void {
    this._mask.destroy();
  }

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => { };

  /** `View -> model callback called when select has been touched` */
  _onTouched = () => { };

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: Date): void {
    if(obj) {
      const value = obj.toLocaleDateString();
      this._mask.setRawValue(value);
    }
  }
}
