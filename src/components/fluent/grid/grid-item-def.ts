import {
  ChangeDetectorRef,
  Directive,
  DoCheck,
  Input, IterableChanges, IterableDiffer,
  IterableDiffers,
  OnInit, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {MsGridItemContext} from './grid-item';

@Directive({
  selector: '[ms-grid-item-def], [MsGridItemDef]'
})
export class MsGridItemDef<T> implements DoCheck, OnInit {
  @Input('MsGridItemDefOf')
  _data1: Array<T>;

  @Input('MsGridItemDefOf')
  _data2: Array<T>;

  get data(): Array<T> {
    return this._data1 || this._data2;
  }

  doCheckEvent = new ReplaySubject<IterableChanges<any>>();

  private differ: IterableDiffer<any>;

  constructor(public container: ViewContainerRef,
              private differs: IterableDiffers,
              public changeDetector: ChangeDetectorRef,
              public template: TemplateRef<MsGridItemContext<T>>) {
  }

  ngDoCheck(): void {
    const changes = this.differ.diff(this.data);
    if (changes != null) {
      console.log('data change');
      let add = 0;
      let removed = 0;
      let moved = 0;
      changes.forEachAddedItem(() => add++);
      changes.forEachRemovedItem(() => removed++);
      changes.forEachMovedItem(() => moved++);
      console.log('removed: ' + removed);
      console.log('added: ' + add);
      console.log('moved: ' + moved);
      this.doCheckEvent.next(changes);
    }

  }

  ngOnInit(): void {
    this.differ = this.differs.find(this.data).create();
  }
}
