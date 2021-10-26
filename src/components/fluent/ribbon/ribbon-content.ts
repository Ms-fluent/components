import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, OnDestroy,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsRibbonContentContext, MsRibbonContentDef} from './ribbon-content-def';

@Component({
  template: `
      <div class="ms-ribbon-content-layout" #layout>
          <ng-container #element></ng-container>
      </div>`,
  selector: 'MsRibbonContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-ribbon-content',
    role: 'tabpanel'
  }
})
export class MsRibbonContent implements AfterViewInit, OnDestroy {
  @ViewChild('element', {read: ViewContainerRef})
  view: ViewContainerRef;

  @ViewChild('layout')
  layoutRef: ElementRef<HTMLElement>;

  isActive: boolean = false;

  constructor(private _contentDef: MsRibbonContentDef,
              private _elementRef: ElementRef<HTMLElement>,
              private _context: MsRibbonContentContext) {
  }

  ngAfterViewInit(): void {
    this.view.clear();
    this.view.createEmbeddedView(this._contentDef.template, this._context, 0);
  }

  ngOnDestroy(): void {
    this.view.clear();
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  get layoutHost(): HTMLElement {
    return this.layoutRef.nativeElement;
  }

  get context(): MsRibbonContentContext {
    return this._context;
  }
}
