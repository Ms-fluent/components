import {Observable} from 'rxjs';

export interface MsCollectionSlideDescription<T> {
  length(): number;

  find(index: number): Promise<T>;

  change(): Observable<void>
}
