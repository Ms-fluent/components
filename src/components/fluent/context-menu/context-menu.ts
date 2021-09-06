import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Output,
  TemplateRef,
  ViewChild, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {OverlayRef} from '@angular/cdk/overlay';

@Component({
  templateUrl: 'context-menu.html',
  selector: 'msContextMenu, ms-context-menu, MsContextMenu',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-contextMenu ms-depth-4'
  }
})
export class MsContextMenu {

  @ViewChild(TemplateRef, {static: false})
  public templateRef: TemplateRef<any>;

  constructor(public _viewContainerRef: ViewContainerRef) {
  }
}
