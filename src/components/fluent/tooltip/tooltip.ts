import {Injectable, Injector, Optional, StaticProvider, TemplateRef} from '@angular/core';
import {
  ComponentType,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import {MsTooltipRef} from './tooltip-ref';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {MsTooltipOptions} from './tooltip-options';
import {MsTooltipTitleContent} from './tooltip-title-content';
import {MsTooltipContainer} from './tooltip-container';
import {setOverlayPosition} from './tooltip-positions';
import {MS_TOOLTIP_TARGET} from './tooltip-target';
import {MS_TOOLTIP_DATA} from './tooltip-injectors';
import {filter} from 'rxjs/operators';
import {NavigationStart, Router} from '@angular/router';


@Injectable()
export class MsTooltip {

  constructor(private overlay: Overlay,
              @Optional() private _router: Router,
              private parentInjector: Injector) {
  }

  open<T, R = any>(content: ComponentType<T> | TemplateRef<T>,
                   target: HTMLElement,
                   options: MsTooltipOptions = {}): MsTooltipRef<T, R> {
    options = this._applyOptionsDefaults(options);
    const overlayRef = this._createOverlay(options, target);
    const container = this.createTooltipContainer(overlayRef, target, options);

    const toastRef = this._attachTooltipContent<T, R>(content, overlayRef, container, options);

    overlayRef.backdropClick().subscribe(() => toastRef.close());

    if(this._router && options.closeOnNavigation) {
      this._router.events.pipe(filter(event => event instanceof NavigationStart))
        .subscribe(() => toastRef.close())
    }

    return toastRef;
  }

  private _attachTooltipContent<T, R>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
                                      overlayRef: OverlayRef,
                                      container: MsTooltipContainer, options: MsTooltipOptions) {
    const tooltipRef = new MsTooltipRef<T, R>(overlayRef, options, container);

    if (componentOrTemplateRef instanceof TemplateRef) {
      const context = <any>{$implicit: options.data, tooltipRef};
      const portal = new TemplatePortal<T>(componentOrTemplateRef, null!, context);
      container.attach(portal);
    } else {
      const injector = this._createInjector<T, R>(tooltipRef, container, options);
      const portal = new ComponentPortal(componentOrTemplateRef, options.viewContainerRef, injector);
      const contentRef = container.attach(portal);
      tooltipRef.componentInstance = contentRef.instance;
    }
    setOverlayPosition(options, overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy);

    return tooltipRef;

  }

  info(target: HTMLElement, content: string, options?: MsTooltipOptions): MsTooltipRef<MsTooltipTitleContent> {
    if (!options) {
      options = new MsTooltipOptions<any>();
    }
    options.data = {content};
    return this.open(MsTooltipTitleContent, target, options);
  }

  private createTooltipContainer(overlayRef: OverlayRef, target: HTMLElement, options: MsTooltipOptions): MsTooltipContainer {
    const userInjector = options && options.viewContainerRef && options.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this.parentInjector,
      providers: [
        {provide: MsTooltipOptions, useValue: options},
        {provide: OverlayRef, useValue: overlayRef},
        {provide: MS_TOOLTIP_TARGET, useValue: target}
      ]
    });
    const portal = new ComponentPortal(MsTooltipContainer, options.viewContainerRef, injector);
    const componentRef = overlayRef.attach(portal);

    return componentRef.instance;
  }

  private _createInjector<T, R>(ref: MsTooltipRef<T, R>,
                                container: MsTooltipContainer,
                                options: MsTooltipOptions): Injector {

    const userInjector = options && options.viewContainerRef && options.viewContainerRef.injector;

    const providers: StaticProvider[] = [
      {provide: MsTooltipRef, useValue: ref},
      {provide: MsTooltipOptions, useValue: options},
      {provide: MsTooltipContainer, useValue: container},
      {provide: MS_TOOLTIP_DATA, useValue: options.data}
    ];
    return Injector.create({parent: userInjector || userInjector, providers});
  }

  private _createOverlay(options: MsTooltipOptions, target: HTMLElement): OverlayRef {
    const overlayConfig: OverlayConfig = {
      positionStrategy: this.getPosition(target),
      panelClass: options.panelClass,
      direction: options.direction,
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      hasBackdrop: options.hasBackdrop
    };

    if (options.backdropClass) {
      overlayConfig.backdropClass = options.backdropClass;
    }
    const overlayRef = this.overlay.create(overlayConfig);

    return overlayRef;
  }

  private getPosition(target: HTMLElement) {
    const position = this.overlay.position().flexibleConnectedTo(target).withPositions(
      [{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: 0,
        offsetY: 0
      }]);

    return position;
  }

  /**
   * Expands the provided configuration object to include the default values for properties which
   * are undefined.
   */
  private _applyOptionsDefaults(options?: MsTooltipOptions): MsTooltipOptions {
    return {...new MsTooltipOptions(), ...options};
  }


}
