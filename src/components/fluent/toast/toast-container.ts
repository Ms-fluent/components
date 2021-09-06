import {
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MsToastOptions} from './toast-options';
import {BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import * as gsap from 'gsap';
import {OverlayRef} from "@angular/cdk/overlay";

interface MsToastAnimationEvent {
  state: 'opened' | 'opening' | 'closing' | 'closed';
  totalTime: number;
}

@Component({
  templateUrl: 'toast-container.html',
  selector: 'MsTooltipContainer',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ms-toast-container',
    'tabindex': '-1',
    'aria-model': 'true',
    '[attr.role]': '_config.role',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null'
  }

})
export class MsToastContainer extends BasePortalOutlet {

  /** The portal host inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, {static: true}) _portalHost: CdkPortalOutlet;

  /** ID of the element that should be considered as the dialog's label. */
  _ariaLabelledBy: string | null;

  /** Emits when an animation state changes. */
  _animationStateChanged: EventEmitter<MsToastAnimationEvent> = new EventEmitter<MsToastAnimationEvent>();


  constructor(public _config: MsToastOptions,
              private overlayRef: OverlayRef,
              private elementRef: ElementRef<HTMLElement>) {
    super();
    this._ariaLabelledBy = _config.ariaLabelledBy;
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalHost.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this._portalHost.attachTemplatePortal(portal);
  }

  attach(portal: any): any {
    const result = super.attach(portal);

    this.afterAttach();
    return result;
  }

  afterAttach() {
    this.animateToastEnter();
  }

  async animateToastEnter(): Promise<void> {
    const height = this.host.getBoundingClientRect().height;

    this._animationStateChanged.emit({state: 'opening', totalTime: 50});
    await gsap.gsap.fromTo(this.host, .3, {translateY: height}, {translateY: 0, opacity: 1, delay: 0.05});
    this._animationStateChanged.emit({state: 'opened', totalTime: 350});
  }

  async animateToastOut(): Promise<void> {
    this._animationStateChanged.emit({state: 'closing', totalTime: 0});
    await gsap.gsap.to(this.overlayRef.hostElement, .3, {translateY: 20, opacity: 0});
    this._animationStateChanged.emit({state: 'closed', totalTime: 350});
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
