import {Injectable, Injector} from '@angular/core';
import {MsToastRef} from './toast-ref';
import {MsToastOptions} from './toast-options';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {StringToastComponent} from './string-toast-component';
import * as gsap from 'gsap';

const TOAST_CLASSNAME = 'ms-toast-item';

@Injectable()
export class MsToast {
  private _items: MsToastRef[] = [];
  get items(): MsToastRef[] {
    return this._items.slice();
  }

  constructor(private overlay: Overlay, private parentInjector: Injector) {
  }

  async launch(message: string, options?: MsToastOptions) {
    const toastRef = new MsToastRef(this);
    const position = this.overlay.position().global().bottom('0');

    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: position,
      panelClass: TOAST_CLASSNAME,
    });

    toastRef.overlayRef = overlayRef;
    const portal = new ComponentPortal(StringToastComponent, null, this._createInjector(toastRef));


    const componentRef = overlayRef.attach(portal);

    componentRef.instance.message = message;

    componentRef.changeDetectorRef.detectChanges();

    const height = overlayRef.overlayElement.getBoundingClientRect().height;

    this.moveVisibleToasts(height);

    this._items.push(toastRef);



    gsap.gsap.from(overlayRef.hostElement, {duration: 0.2, translateY: height})

  }

  moveVisibleToasts(height: number): Promise<void[]> {
   return Promise.all(this.items.map(i => this.moveToast(i, height)));
  }

  moveToast(ref: MsToastRef, height: number): Promise<void> {
    return new Promise<void>(resolve => {
      const element = ref.overlayRef.overlayElement;
      const y = element.getBoundingClientRect().y;

      element.animate([
        {transform: `translateY(${ref.y}px)`}, {transform: `translateY(${ref.y - height}px)`}
      ], {fill: 'both', duration: 200}).onfinish = () => {
        ref.y = ref.y - height;
        resolve();
      };
    })
  }

  close(ref: MsToastRef) {
    const height = ref.overlayRef.overlayElement.getBoundingClientRect().height;
    this._items = this._items.filter(i => i !== ref);
    ref.overlayRef.dispose();
    this.moveVisibleToasts(-height);
  }

  private _createInjector(ref: MsToastRef): Injector {

    const parentInjector = this.parentInjector;
    return {
      get(token: any, notFoundValue?: any): any {
        const customTokens = new WeakMap<any, any>([
          [MsToastRef, ref]
        ]);
        const value = customTokens.get(token);

        if (typeof value !== 'undefined') {
          return value;
        }

        return parentInjector.get(token, notFoundValue);
      }

    };
  }
}
