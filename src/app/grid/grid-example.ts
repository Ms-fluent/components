import {Component, ViewChild} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from "../../data/element";
import {MsGrid} from "../../components";

@Component({
  selector: 'grid-example',
  templateUrl: './grid-example.html'
})
export class GridExample {
  title = 'fluent-grid';
  data = ELEMENT_DATA.slice();
  elements: PeriodicElement[] = ELEMENT_DATA;
  of: any;

  @ViewChild('msGrid')
  msGrid: MsGrid<PeriodicElement>;


  getFilterFn(type: string): (x: PeriodicElement) => boolean {
    return (x: PeriodicElement) => x.type === type;
  }

  filter(category: string) {
    this.msGrid.filter(this.getFilterFn(category))
  }
}
