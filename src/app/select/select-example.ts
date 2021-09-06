import {Component} from '@angular/core';
import {ELEMENT_DATA} from '../../data/element';
import {groupBy} from '../../components/helpers';

@Component({
  templateUrl: 'select-example.html'
})
export class SelectExample {
  itemGroups = groupBy(ELEMENT_DATA, v => v.type);
}


