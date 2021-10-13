import {Component} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../../data/element';
import {MsCollectionSideArrayDescriptor, MsCollectionSlideDescription} from '../../components/fluent/collection-slide';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'collection-slide-example',
  templateUrl: './collection-slide-example.html'
})
export class CollectionSlideExample {
  title = 'fluent-grid';
  data = ELEMENT_DATA.slice();
  elements: PeriodicElement[] = ELEMENT_DATA;
  of: any;

  description = new MsCollectionSideArrayDescriptor(ELEMENT_DATA);
}

export class SlideDescription implements MsCollectionSlideDescription<PeriodicElement> {
  private _change: Subject<void>;

  length(): number {
    return ELEMENT_DATA.length;
  }

  find(index: number): Promise<PeriodicElement> {
    return Promise.resolve(ELEMENT_DATA[index]);
  }

  change(): Observable<void> {
    return this._change.asObservable();
  }
}

