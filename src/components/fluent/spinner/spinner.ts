import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MsSpinnerCircle} from './spinner-circle';

@Component({
  templateUrl: 'spinner.html',
  selector: 'ms-spinner, MsSpinner',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-spinner'
  }
})
export class MsSpinner implements OnInit {
  @Input()
  width: number;

  @Input()
  count: number = 7;

  circles: MsSpinnerCircle[] = [];

  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    this.createElement();
    this.applyAnimationDelay();
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private createElement() {
    for (let i = 0; i < this.count; i++) {
      this.circles.push(new MsSpinnerCircle(this));
    }
  }

  private applyAnimationDelay() {
    this.circles.forEach((circle, index) => {
      circle.host.style.animationDelay = `${240 * index}ms`;
    })
  }
}
