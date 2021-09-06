import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive, ElementRef, Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsPivotContentContext} from './pivot-content-context';

@Directive({
  selector: '[ms-pivotContentDef], [msPivotContentDef], [MsPivotContentDef]'
})
export class MsPivotContentDef {
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

  constructor(private _contentDef: MsPivotContentDef,
              private _elementRef: ElementRef<HTMLElement>,
              private _context: MsPivotContentContext) {
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
}
