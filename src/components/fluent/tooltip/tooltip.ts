import {Injectable, Injector, TemplateRef} from '@angular/core';
import {
  ComponentType,
  FlexibleConnectedPositionStrategy, HorizontalConnectionPos,
  Overlay,
  OverlayConfig,
  OverlayRef, VerticalConnectionPos
} from '@angular/cdk/overlay';
import {MsTooltipRef} from './tooltip-ref';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {MsTooltipOptions, MsTooltipPosition} from './tooltip-options';
import {MsTooltipInjector} from './tooltip-injector';
import {MsTooltipContentComponent} from './content-component';
import {MsTooltipContainer} from './tooltip-container';
import {MS_TOOLTIP_CONTAINER} from './tooltip-injectors';

@Injectable()
export class MsTooltip {

  constructor(private overlay: Overlay,
              private parentInjector: Injector) {
  }

  open<T, R = any>(target: HTMLElement, content: ComponentType<T> | TemplateRef<T> | string, options: MsTooltipOptions = {}): MsTooltipRef<T, R> {

    options = this._applyOptionsDefaults(options);
    if (typeof content === 'string') {
      return this.openFromString(target, content, options);
    } else if (content instanceof TemplateRef) {
      return this.openFromTemplate(target, content, options);
    } else {
      return this.openFromComponent(target, content, options);
    }
  }


  openFromComponent<T, R = any>(target: HTMLElement, content: ComponentType<T>, options: MsTooltipOptions): MsTooltipRef<T, R> {
    const overlayRef = this._createOverlay(options, target);

    const tooltipRef = new MsTooltipRef<T, R>();
    tooltipRef.overlayRef = overlayRef;
    tooltipRef.target = target;

    const container = this.createTooltipContainer(overlayRef, tooltipRef, options);

    const injector = new MsTooltipInjector(this.parentInjector, tooltipRef, options);

    const portal = new ComponentPortal(content as ComponentType<T>, null, injector);
    const componentRef = container.attachComponentPortal(portal);

    this.setOverlayPosition(options, overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy);
    return tooltipRef;
  }

  openFromTemplate<T, R = any>(target: HTMLElement, template: TemplateRef<T>, options: MsTooltipOptions): MsTooltipRef<T, R> {
    const overlayRef = this._createOverlay(options, target);
    const tooltipRef = new MsTooltipRef<T, R>();
    tooltipRef.overlayRef = overlayRef;
    tooltipRef.target = target;

    const container = this.createTooltipContainer(overlayRef, tooltipRef, options);

    const injector = new MsTooltipInjector(this.parentInjector, tooltipRef, options);

    // tslint:disable-next-line:no-non-null-assertion
    const portal = new TemplatePortal(template, null!, {$implicit: options.data, tooltipRef} as any);
    const componentRef = container.attachTemplatePortal(portal);
    this.setOverlayPosition(options, overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy);

    return tooltipRef;
  }

  openFromString<T, R = void>(target: HTMLElement, content: string, options: MsTooltipOptions): MsTooltipRef<T, R> {
    options.data = {content};
    // @ts-ignore
    return this.openFromComponent<T, R>(target, MsTooltipContentComponent, options);
  }

  private createTooltipContainer(overlayRef: OverlayRef, tooltipRef: MsTooltipRef<any>, options: MsTooltipOptions): MsTooltipContainer {
    const containerType = options.containerComponent || this.parentInjector.get(MS_TOOLTIP_CONTAINER);
    const userInjector = options && options.viewContainerRef && options.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this.parentInjector,
      providers: [
        {provide: MsTooltipOptions, useValue: options},
        {provide: OverlayRef, useValue: overlayRef},
        {provide: MsTooltipRef, useValue: tooltipRef}
      ]
    });
    const portal = new ComponentPortal(containerType, options.viewContainerRef, injector);
    const componentRef = overlayRef.attach(portal);

    return componentRef.instance;
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

  private setOverlayPosition(options: MsTooltipOptions, positionStrategy: FlexibleConnectedPositionStrategy) {
    const position = options.position;
    const align = options.align;
    let [originX, originFallbackX]: HorizontalConnectionPos[] = ['start', 'end'];
    let [overlayX, overlayFallbackX]: HorizontalConnectionPos[] = ['end', 'start'];

    let [overlayY, overlayFallbackY]: VerticalConnectionPos[] = ['top', 'bottom'];
    let [originY, originFallbackY]: VerticalConnectionPos[] = ['bottom', 'top'];

    if (position === 'left') {
      [originX, originFallbackX] = ['start', 'end'];
      [overlayX, overlayFallbackX] = ['end', 'start']
    } else if (position === 'right') {
      [originX, originFallbackX] = ['end', 'start'];
      [overlayX, overlayFallbackX] = ['start', 'end']
    } else if (position === 'top') {
      [originY, originFallbackY] = ['top', 'bottom'];
      [overlayY, overlayFallbackY] = ['bottom', 'top']
    } else if (position === 'bottom') {
      [originY, originFallbackY] = ['bottom', 'top'];
      [overlayY, overlayFallbackY] = ['top', 'bottom'];
    }

    if (position === 'left' || position === 'right') {
      if (align === 'start') {
        [originY, originFallbackY] = ['top', 'bottom'];
        [overlayY, overlayFallbackY] = ['top', 'bottom']
      } else if (align === 'end') {
        [originY, originFallbackY] = ['bottom', 'top'];
        [overlayY, overlayFallbackY] = ['bottom', 'top'];
      } else {
        [originY, originFallbackY] = ['center', 'top'];
        [overlayY, overlayFallbackY] = ['center', 'top'];
      }
    }

    if (position === 'bottom' || position === 'top') {
      if (align === 'start') {
        [originX, originFallbackX] = ['start', 'end'];
        [overlayX, overlayFallbackX] = ['start', 'end'];
      } else if (align === 'end') {
        [originX, originFallbackX] = ['end', 'start'];
        [overlayX, overlayFallbackX] = ['end', 'start'];
      } else if (align === 'center') {
        [originX, originFallbackX] = ['center', 'start'];
        [overlayX, overlayFallbackX] = ['center', 'start'];
      }
    }

    const offsetY = 0;

    positionStrategy.withPositions([
      {originX, originY, overlayX, overlayY, offsetY},
      {originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY},
      {
        originX,
        originY: originFallbackY,
        overlayX,
        overlayY: overlayFallbackY,
        offsetY: -offsetY
      },
      {
        originX: originFallbackX,
        originY: originFallbackY,
        overlayX: overlayFallbackX,
        overlayY: overlayFallbackY,
        offsetY: -offsetY
      }
    ]);
  }

  /**
   * Expands the provided configuration object to include the default values for properties which
   * are undefined.
   */
  private _applyOptionsDefaults(options?: MsTooltipOptions): MsTooltipOptions {
    return {...new MsTooltipOptions(), ...options};
  }
}
