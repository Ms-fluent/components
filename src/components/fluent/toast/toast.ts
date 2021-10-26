import {Inject, Injectable, InjectionToken, Injector, Optional, StaticProvider, TemplateRef} from '@angular/core';
import {MsToastRef} from './toast-ref';
import {
  MS_TOAST_DEFAULT_OPTIONS,
  MS_TOAST_GLOBAL_DEFAULT_OPTIONS,
  MsToastAlign,
  MsToastGlobalOptions,
  MsToastOptions,
  MsToastPosition
} from './toast-options';
import {ComponentType, Overlay, OverlayConfig, OverlayRef, PositionStrategy} from '@angular/cdk/overlay';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {MsToastContainer} from './toast-container';
import {StringToastComponent} from './string-toast-component';
import * as gsap from 'gsap';
import {MsAlertTheme} from '../alert';

/** Injection token that can be used to access the data that was passed in to a dialog. */
export const MS_TOAST_DATA = new InjectionToken<any>('MsToastData');


export abstract class MsToastBase {
  /**
   *
   * @param component
   * @param options
   * @type T The component type.
   * @type D Data type.
   * @type R Result data type.
   */
  abstract launch<T, D = any, R = any>(component: ComponentType<T>, options?: MsToastOptions<D>): MsToastRef<T, R>;

  abstract launch<T, D = any, R = any>(template: TemplateRef<T>, options?: MsToastOptions<D>): MsToastRef<T, R>;

  abstract log(message: string, theme: MsAlertTheme, options?: MsToastOptions<undefined>): MsToastRef<any, any>;
}

@Injectable()
export class MsToast extends MsToastBase {
  private _items: MsToastRef<any>[] = [];
  get items(): MsToastRef<any>[] {
    return this._items.slice();
  }

  constructor(private overlay: Overlay,
              private parentInjector: Injector,
              @Inject(MS_TOAST_GLOBAL_DEFAULT_OPTIONS) private _globalOptions: MsToastGlobalOptions,
              @Optional() @Inject(MS_TOAST_DEFAULT_OPTIONS) private _defaultOptions: MsToastOptions) {
    super();
  }


  launch<T, D = any, R = any>(target: TemplateRef<T> | ComponentType<T>, options?: MsToastOptions<D>): MsToastRef<T, R> {
    options = this._getDefaultOptions(options);
    const overlayRef = this._createOverlayRef(options);
    const container = this._createToastContainer(overlayRef, options);
    const toastRef = this._attachToastContent<T, R>(target, overlayRef, container, options);

    toastRef.updateSize(options.width, options.height);

    setTimeout(() => {
      const height = container.host.getBoundingClientRect().height;
      this.moveVisibleToasts(height + this._globalOptions.spaceBetween).then();
      this._items.push(toastRef);
    });

    toastRef.afterClosed().subscribe(() => {
      this._items = this._items.filter(i => i !== toastRef);
      this.animateToastsOnClose();
    });
    return toastRef;
  }

  log(message: string, theme: MsAlertTheme, options?: MsToastOptions<undefined>): MsToastRef<any, any> {
    return this.launch(StringToastComponent, {data: {message, theme}})
  }

  info(message: string, options?: MsToastOptions<undefined>): MsToastRef<any, any> {
    return this.log(message, 'standard', options);
  }

  infoAlt(message: string, options?: MsToastOptions<undefined>): MsToastRef<any, any> {
    return this.log(message, 'standardDark', options);
  }

  error(message: string, options?: MsToastOptions<undefined>): MsToastRef<any, any> {
    return this.log(message, 'error', options);
  }

  warning(message: string, options?: MsToastOptions<undefined>): MsToastRef<any, any> {
    return this.log(message, 'severeWarning', options);
  }

  moveVisibleToasts(height: number): Promise<void[]> {
    return Promise.all(this.items.map(i => this.moveToast(i, height)));
  }

  animateToastsOnClose() {
    const items = this.items.reverse();
    let y = 0;
    for (const toastRef of items) {
      gsap.gsap.to(toastRef._containerInstance.host, 0.3, {translateY: -y});
      y += toastRef.height + this._globalOptions.spaceBetween;
    }
  }


  async moveToast(ref: MsToastRef<any>, height: number): Promise<void> {
    const element = ref._containerInstance.host;
    const y = ref.y - height;

    await gsap.gsap.to(element, 0.3, {translateY: y});
    ref.y = ref.y - height;
  }

  private _createOverlayRef(options: MsToastOptions): OverlayRef {
    const overlayOptions = this._getOverlayConfig(options);
    return this.overlay.create(overlayOptions);
  }

  /**
   * Creates an overlay config from a toast config.
   * @param options The toast configuration.
   * @returns The overlay configuration.
   */
  private _getOverlayConfig(options: MsToastOptions): OverlayConfig {
    const state = new OverlayConfig({
      positionStrategy: this._getPositionStrategy(this._globalOptions.position, this._globalOptions.align),
      panelClass: options.panelClass,
      hasBackdrop: options.hasBackdrop,
      direction: options.direction,
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      disposeOnNavigation: options.closeOnNavigation
    });

    if (options.backdropClass) {
      state.backdropClass = options.backdropClass;
    }

    return state;
  }

  private _getPositionStrategy(position: MsToastPosition, align: MsToastAlign): PositionStrategy {
    let strategy = this.overlay.position().global();
    const gap: string = '0';

    if (position === 'top') {
      strategy = strategy.top(gap);
    } else {
      strategy = strategy.bottom(gap)
    }

    if (align === 'left') {
      strategy = strategy.left();
    } else if (align === 'right') {
      strategy = strategy.right();
    } else {
      strategy = strategy.centerHorizontally();
    }

    return strategy;
  }

  private _getDefaultOptions(options: MsToastOptions): MsToastOptions {
    options = options || this._defaultOptions;
    const newOptions = new MsToastOptions();

    return {...newOptions, ...options};
  }

  private _createToastContainer(overlayRef: OverlayRef, config: MsToastOptions): MsToastContainer {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    const injector = Injector.create({
      parent: userInjector || this.parentInjector,
      providers: [
        {provide: MsToastOptions, useValue: config},
        {provide: OverlayRef, useValue: overlayRef}
      ]
    });

    const portal = new ComponentPortal(MsToastContainer, config.viewContainerRef, injector, config.componentFactoryResolver);

    const container = overlayRef.attach(portal);

    return container.instance;
  }

  private _attachToastContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    overlayRef: OverlayRef,
    container: MsToastContainer,
    config: MsToastOptions): MsToastRef<T, R> {

    const toastRef = new MsToastRef<T, R>(overlayRef, config, container);

    if (componentOrTemplateRef instanceof TemplateRef) {
      const context = <any>{$implicit: config.data, toastRef};
      const portal = new TemplatePortal<T>(componentOrTemplateRef, null!, context);

      container.attach(portal);
    } else {
      const injector = this._createInjector<T, R>(toastRef, container, config);
      const contentRef = container.attach(
        new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector));
      toastRef.componentInstance = contentRef.instance;
    }


    return toastRef;
  }

  private _createInjector<T, R>(ref: MsToastRef<T, R>,
                                container: MsToastContainer,
                                options: MsToastOptions): Injector {

    const userInjector = options && options.viewContainerRef && options.viewContainerRef.injector;

    const providers: StaticProvider[] = [
      {provide: MsToastGlobalOptions, useValue: this._globalOptions},
      {provide: MsToastRef, useValue: ref},
      {provide: MsToastOptions, useValue: options},
      {provide: MsToastContainer, useValue: container},
      {provide: MS_TOAST_DATA, useValue: options.data}
    ];

    return Injector.create({parent: userInjector || userInjector, providers});
  }
}
