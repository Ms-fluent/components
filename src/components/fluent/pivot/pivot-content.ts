import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsPivotContentContext} from './pivot-content-context';
import ResizeObserver from 'resize-observer-polyfill';
import {Observable, Subject} from 'rxjs';

@Directive({
  selector: '[ms-pivotContentDef], [msPivotContentDef], [MsPivotContentDef]'
})
export class MsPivotContentDef {
  @Output()
  onCreate: EventEmitter<void>;

  @Output()
  onActivate: EventEmitter<void>;

  @Output()
  onDeactivate: EventEmitter<void>;

  constructor(public template: TemplateRef<MsPivotContentContext>) {
  }
}


@Component({
  template: `
      <div class="ms-pivot-content-layout" #layout>
          <ng-container #element></ng-container>
      </div>`,
  selector: 'ms-pivotContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-pivotContent'
  }
})
export class MsPivotContent implements AfterViewInit, OnDestroy {

  @ViewChild('element', {read: ViewContainerRef})
  view: ViewContainerRef;

  @ViewChild('layout')
  layoutRef: ElementRef<HTMLElement>;

  isActive: boolean = false;

  get resize(): Observable<DOMRect> {
    return this._resize.asObservable();
  }

  private _resize: Subject<DOMRect> = new Subject<DOMRect>();


  private _resizeObserver = new ResizeObserver(entries => {
    const rect = (entries[0].target as HTMLElement).getBoundingClientRect();
    this._resize.next(rect);
  });

  constructor(private _contentDef: MsPivotContentDef,
              private _elementRef: ElementRef<HTMLElement>,
              private _context: MsPivotContentContext) {
  }

  ngAfterViewInit(): void {
    this._resizeObserver.observe(this.layoutHost);
    this.view.clear();
    this.view.createEmbeddedView(this._contentDef.template, this._context, 0);
  }

  ngOnDestroy(): void {
    this.view.clear();
    this._resizeObserver.disconnect();
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  get layoutHost(): HTMLElement {
    return this.layoutRef.nativeElement;
  }
}
