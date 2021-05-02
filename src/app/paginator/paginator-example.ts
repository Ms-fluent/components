import {Component} from '@angular/core';
import {LogicPaginator, MsPaginatorItemsFn} from '../../components/fluent/paginator';
import {ELEMENT_DATA, PeriodicElement} from '../../data/element';

@Component({
  templateUrl: 'paginator-example.html'
})
export class PaginatorExample {
  paginator: LogicPaginator<PeriodicElement>;

  itemsFn: MsPaginatorItemsFn<PeriodicElement> = (page: number, size: number) => {
    const start = page * size;
    const end = page * size + size;
    const data = ELEMENT_DATA.slice(start, end);
    console.log(start + ':' + end);
    console.log(data);
    return Promise.resolve(data);
  };

  constructor() {
    const paginator = new LogicPaginator();
    paginator.pageSize = 5;
    paginator.totalSize = 34;
    paginator.getItemFn = (page: number) => {
      const start = page * paginator.pageSize;
      let end = start + paginator.pageSize;
      if (end >= paginator.totalSize) {
        end = paginator.totalSize;
      }

      return ELEMENT_DATA.slice(start, end);
    };

    this.paginator = paginator;
  }
}
