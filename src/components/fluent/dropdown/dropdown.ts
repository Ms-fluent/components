import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {OverlayRef} from '@angular/cdk/overlay';
import {DropdownClose} from './dropdown-close';


@Component({
  selector: 'ms-dropdown, MsDropdown',
  templateUrl: 'dropdown.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MsDropdown {

  @ViewChild(TemplateRef, {static: false})
  public templateRef: TemplateRef<any>;

  @Output()
  onclose: EventEmitter<void> = new EventEmitter<void>();

  public overlayRef: OverlayRef | null = null;

  children: DropdownClose[] = [];

  constructor() {
  }

  close() {
    this.children.forEach(child => child.close());
  }

}
