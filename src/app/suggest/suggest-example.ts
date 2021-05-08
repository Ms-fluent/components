import {Component} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../../data/element';
import {MsSuggestSearchFn} from '../../components/fluent/suggest';

@Component({
  templateUrl: 'suggest-example.html'
})
export class SuggestExample {
  searchFn: MsSuggestSearchFn<PeriodicElement> = (key: string) => Promise.resolve(
    ELEMENT_DATA.filter(i => i.name.toLowerCase().indexOf(key.toLowerCase()) > -1).slice(0, 7));
  mapFn = (item: PeriodicElement) => item.name;
}

