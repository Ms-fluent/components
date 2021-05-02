import {Directive, ElementRef, HostListener, Input} from '@angular/core';


@Directive({
  selector: 'input[ms-input-field], input[MsInputField]',
  host: {
    'class': 'ms-inputField',
    '[class.ms-disabled]': 'disabled',
    '[attr.required]': 'required'
  }
})
export class MsInputField {
  @Input()
  id: string;

  @Input()
  disabled: boolean = false;

  @Input()
  required: boolean;

  private _focused: boolean = false;
  get focused(): boolean {
    return this._focused;
  }

  set focused(value: boolean) {
    this._focused = value;
  }

  constructor(private _elementRef: ElementRef<HTMLInputElement>) {
  }

  get host() {
    return this._elementRef.nativeElement;
  }


  @HostListener('focus')
  onfocus() {
    this.focused = true;
  }

  @HostListener('blur')
  onblur() {
    this.focused = false;
  }
}
