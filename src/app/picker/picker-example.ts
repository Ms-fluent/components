import {Component} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../../data/element';
import {MsPickerSearchFn} from '../../components';

@Component({
  templateUrl: 'picker-example.html'
})
export class PickerExample {
  searchFn: MsPickerSearchFn<PeriodicElement> = (key: string) => Promise.resolve(
    ELEMENT_DATA.filter(i => i.name.toLowerCase().indexOf(key.toLowerCase()) > -1).slice(0, 7));
  mapFn = (item: PeriodicElement) => item.name;
}

