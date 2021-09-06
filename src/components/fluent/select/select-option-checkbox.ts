import {Directive, OnInit} from '@angular/core';
import {MsSelectOption} from './select-option';
import {MsCheckbox, MsCheckboxChange} from '../checkbox';

@Directive({
  selector: '[MsSelectOptionCheckbox], [ms-select-option-checkbox]'
})
export class MsfSelectOptionCheckbox implements OnInit{
  constructor(public checkbox: MsCheckbox, private selectOption: MsSelectOption) {
    if(!checkbox) {
      throw new Error('A MsSelectOptionCheckbox must be inside a msCheckbox')
    }
  }

  ngOnInit(): void {
    this.checkbox.change.subscribe((event:MsCheckboxChange) => {
      if(event.checked){
        this.selectOption.select();
      }else {
        this.selectOption.deselect();
      }
    })
  }
}
