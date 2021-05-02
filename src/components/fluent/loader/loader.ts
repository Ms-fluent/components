import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MsLoaderCircle} from './loader-circle';

@Component({
  templateUrl: 'loader.html',
  selector: 'ms-loader, MsLoader',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-loader'
  }
})
export class MsLoader implements OnInit {
  @Input()
  width: number;

  @Input()
  count: number = 7;

  circles: MsLoaderCircle[] = [];

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
      this.circles.push(new MsLoaderCircle(this));
    }
  }

  private applyAnimationDelay() {
    this.circles.forEach((circle, index) => {
      circle.host.style.animationDelay = `${240 * index}ms`;
    })
  }
}
