import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation
} from '@angular/core';

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
export class MsLabel {
  @Input()
  disabled: boolean = false;

  @Input()
  required: boolean = false;

  @Input()
  htmlFor: string;

  constructor(private elementRef: ElementRef<HTMLElement>,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }
}
