import {Directive, ElementRef, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {LocalTime} from '@js-joda/core';
import Cleave from 'cleave.js';

export const LOCALTIME_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsCleaveLocalTimeMaskDirective),
  multi: true
};

@Directive({
  selector: 'input[MsLocalTimeMask], input[ms-local-time-mask]',
  providers: [LOCALTIME_CONTROL_VALUE_ACCESSOR],
  host: {
    'autocomplete': 'off'
  }
})
export class MsCleaveLocalTimeMaskDirective implements ControlValueAccessor, OnInit, OnDestroy {
  private _mask: Cleave;

  @Input()
  timePattern: string[] = ['h', 'm'];

  constructor(private _elementRef: ElementRef<HTMLInputElement>) { }

  ngOnInit(): void {
    this._mask = new Cleave(this._elementRef.nativeElement, {
      time: true,
      timePattern: this.timePattern,

      onValueChanged: (event: any): void => {
        const time: string = event.target.value;
        if (time.length !== 5) {
          this._onChange(null);
        } else {
          this._onChange(LocalTime.parse(time))
        }

      }
    });
  }

  ngOnDestroy(): void {
    this._mask.destroy();
  }

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {
  };

  /** `View -> model callback called when select has been touched` */
  _onTouched = () => {
  };

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: LocalTime): void {
    if(obj){
      this._mask.setRawValue(obj.toString());
    }
  }
}
