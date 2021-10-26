import {Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output} from '@angular/core';


export class MouseStayEvent {
  target: HTMLElement;
}

const DELAY = 800;

@Directive({
  selector: '[MsMouseStay]'
})
export class MsMouseStay implements OnDestroy {
  private _timer: any;
  private _fired = false;

  @Output('MsMouseStay')
  event = new EventEmitter<MouseStayEvent>();

  constructor(private _elementRef: ElementRef) {
  }

  fire(sourceEvent: MouseEvent) {
    const event = new MouseStayEvent();
    event.target = this.host;

    this.event.emit(event);
    this._fired = true;
  }

  @HostListener('mouseover', ['$event'])
  _mouseenter(event: MouseEvent) {
    this._fired = false;
  }

  @HostListener('mousemove', ['$event'])
  _mousemove(event: MouseEvent) {
    window.clearTimeout(this._timer);
    if (!this._fired) {
      this._timer = setTimeout(() => {
        this.fire(event);
      }, DELAY);
    }
  }

  @HostListener('mouseleave')
  _mouseleave() {
    window.clearTimeout(this._timer);
  }

  ngOnDestroy(): void {
    window.clearTimeout(this._timer);
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
