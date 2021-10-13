import {Observable, Subject} from 'rxjs';

export interface MsCollectionSlideDescription<T> {
  length(): number;

  find(index: number): Promise<T>;

  change(): Observable<void>
}

export class MsCollectionSideArrayDescriptor<T> implements MsCollectionSlideDescription<T>{
  private _change = new Subject<void>();
  constructor(private _items: T[]) {}

  change(): Observable<void> {
    return this._change.asObservable();
  }

  find(index: number): Promise<T> {
    return Promise.resolve(this._items[index]);
  }

  length(): number {
    return this._items.length;
  }
}
