import {Component, ViewChild} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../../data/element';
import {MsSelection} from '../../components';

@Component({
  templateUrl: 'selection-example.html'
})
export class SelectionExample {
  items: PeriodicElement[] = ELEMENT_DATA.slice(0, 10);

  values: PeriodicElement[] = this.items.slice(0, 5);

  @ViewChild(MsSelection)
  selection: MsSelection;

  addItem(start: number, end: number) {
    this.items.push(...ELEMENT_DATA.slice(start, end));
  }

}

