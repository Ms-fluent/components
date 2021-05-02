import {Observable, Subject} from 'rxjs';

export interface PropertyValueChange {
  previousValue: string;
  value: string;
}

export class PropertyValueObserver {
  private _previousValue: string;
  private _change: Subject<PropertyValueChange> = new Subject<PropertyValueChange>();
  private intervalId: any;

  constructor(private value: any, private property: string) {
    this._previousValue = value[property];
    this.observe();
  }

  observe() {
    this.intervalId = setInterval(() => {
      const value = this.value[this.property];
      if (this._previousValue !== value) {
        this._change.next({value, previousValue: this._previousValue});
        this._previousValue = value;
      }
    }, 100);
  }

  unobserve() {
    clearInterval(this.intervalId);
    this._change.unsubscribe();
  }

  get change(): Observable<PropertyValueChange> {
    return this._change.asObservable();
  }
}
