import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {MsPivotContentDef} from './pivot-content';

@Component({
  templateUrl: 'pivot-body.html',
  selector: 'ms-pivotBody, msPivotBody, MsPivotBody',
  host: {
    'class': 'ms-pivotBody',
    'role': ' tabpanel'
  }
})
export class MsPivotBody implements AfterContentInit, AfterViewInit, OnDestroy {

  /** Event emitted when the body animation has completed. */
  @Output()
  animationDone: EventEmitter<void>;

  @ContentChildren(forwardRef(() => MsPivotContentDef))
  contents: QueryList<MsPivotContentDef>;

  @ViewChild('container', {read: ViewContainerRef})
  container: ViewContainerRef;

  @ViewChild('layout')
  layout: ElementRef<HTMLDivElement>;

  private _translateX: number = 0;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  ngAfterContentInit(): void {
  }

  ngAfterViewInit(): void {
    // this.flexLayout.nativeElement.style.width = `${this.width * this.containers.length}px`;


  }

  ngOnDestroy(): void {

  }

  moveAt(index: number, duration: number = 300) {

  }

  get width(): number {
    return this.host.offsetWidth;
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
