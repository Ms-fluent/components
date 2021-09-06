import {Component} from '@angular/core';
import {PeriodicElement} from '../../data/element';

@Component({
  templateUrl: 'radio-example.html'
})
export class RadioExample {
  value = 'Hydrogen';
  disabled: boolean = false;
  checked: any;
  elements: PeriodicElement[] = [
    {id: 0, position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', type: 'Reactive nonmetal'},
    {id: 1, position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', type: 'Noble gas'},
    {id: 2, position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', type: 'Alkali metal'},
    {id: 3, position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', type: 'Alkaline earth metal'},
    {id: 4, position: 5, name: 'Boron', weight: 10.811, symbol: 'B', type: 'Metalloid'}
  ]
}

