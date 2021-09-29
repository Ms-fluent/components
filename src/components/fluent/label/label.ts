import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, HostListener, Inject,
  Input, OnDestroy, OnInit,
  ViewEncapsulation
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'ms-label, MsLabel, msLabel',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'label.html',
  host: {
    'class': 'ms-label',
    '[class.ms-disabled]': 'disabled'
  }
})
export class MsLabel implements OnInit, OnDestroy {
  @Input()
  disabled: boolean = false;

  @Input()
  required: boolean = false;

  @Input()
  htmlFor: string;

  target: HTMLElement;

  _targetClickEvent = () => this.target?.click();

  constructor(private elementRef: ElementRef<HTMLElement>,
              @Inject(DOCUMENT) private document,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    Promise.resolve().then(() => {
      if (this.htmlFor) {
        this.target = this.document.getElementById(this.htmlFor);
      }
    })
  }

  ngOnDestroy(): void {

  }

  @HostListener('click', ['$event'])
  _onclick(event: MouseEvent) {
    if (this.target) {
      const trigger = new Event('click', event);
      this.target.dispatchEvent(trigger);
    }
  }


  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }
}
