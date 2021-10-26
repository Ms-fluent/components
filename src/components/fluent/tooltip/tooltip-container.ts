import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef, EventEmitter,
  Inject,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {OverlayRef} from '@angular/cdk/overlay';
import {MS_TOOLTIP_THEMES} from './tooltip-injectors';
import {MsTooltipTheme, MsTooltipThemeDeclaration, MsTooltipThemes} from './tooltip-theme';
import {MsTooltipOptions, MsTooltipPosition} from './tooltip-options';
import {MsMotionTimings} from '../../core';

import * as gsap from 'gsap';
import {MS_TOOLTIP_TARGET} from "./tooltip-target";

interface MsTooltipAnimationEvent {
  state: 'opened' | 'opening' | 'closing' | 'closed';
  totalTime?: number;
}

@Component({
  templateUrl: 'tooltip-container.html',
  selector: 'ms-tooltip-container',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ms-tooltip-container',
  }
})
export class MsTooltipContainer extends BasePortalOutlet implements AfterViewInit {
  /** The portal host inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, {static: true}) _portalHost: CdkPortalOutlet;


  @ViewChild('beakRef')
  beakRef: ElementRef<HTMLSpanElement>;

  get beakHost(): HTMLSpanElement {
    return this.beakRef.nativeElement;
  }

  @ViewChild('contentRef')
  contentRef: ElementRef<HTMLDivElement>;

  get contentHost(): HTMLDivElement {
    return this.contentRef.nativeElement;
  }


  @ViewChild('layoutRef')
  layoutRef: ElementRef<HTMLDivElement>;

  get layoutHost(): HTMLDivElement {
    return this.layoutRef.nativeElement;
  }

  @ViewChild('depthRef')
  depthRef: ElementRef<HTMLDivElement>;

  get depthHost(): HTMLDivElement {
    return this.depthRef.nativeElement;
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  /** Emits when an animation state changes. */
  _animationStateChanged: EventEmitter<MsTooltipAnimationEvent> = new EventEmitter<MsTooltipAnimationEvent>();

  constructor(private overlayRef: OverlayRef,
              @Inject(MS_TOOLTIP_TARGET)private target: HTMLElement,
              private options: MsTooltipOptions,
              private elementRef: ElementRef<HTMLElement>,
              @Inject(MS_TOOLTIP_THEMES) private themes: MsTooltipThemes) {
    super();
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    const componentRef = this._portalHost.attachComponentPortal(portal);

    Promise.resolve().then(() => this.overlayRef.overlayElement.getBoundingClientRect().x);

    return componentRef;
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this._portalHost.attachTemplatePortal(portal);
  }

  ngAfterViewInit(): void {
    this.setTheme();

    this.host.style.opacity = '0';


    setTimeout(() => {
      const position = this.position;
      this.setBeakDimensions();
      this.setContainerMargin(position);
      this.setDepthContainerPosition(position);
      this.setBeakPosition(position);

      this.animateEnter(position);
    }, 0)
  }



  private setBeakDimensions() {
    const width: number = +this.options.beakWidth;
    const beakWidth = Math.sqrt(2 * width * width);


    this.beakHost.style.width = `${beakWidth}px`;
    this.beakHost.style.height = `${beakWidth}px`;

  }

  private setDepthContainerPosition(dir: MsTooltipPosition) {
    const width: number = +this.options.beakWidth;
    if (dir === 'bottom') {
      this.depthHost.style.top = `${width}px`;
    }

    if (dir === 'top') {
      this.depthHost.style.bottom = `${width}px`;
    }

    if (dir === 'left') {
      this.depthHost.style.right = `${width}px`;
    }

    if (dir === 'right') {
      this.depthHost.style.left = `${width}px`;
    }
  }

  private setContainerMargin(dir: MsTooltipPosition) {
    const margin: number = +this.options.beakWidth;
    if (dir === 'bottom') {
      this.contentHost.style.marginTop = `${margin}px`;
    }

    if (dir === 'top') {
      this.contentHost.style.marginBottom = `${margin}px`;
    }

    if (dir === 'left') {
      this.contentHost.style.marginRight = `${margin}px`;
    }

    if (dir === 'right') {
      this.contentHost.style.marginLeft = `${margin}px`;
    }
  }

  private setBeakPosition(dir: MsTooltipPosition) {
    const rect = this.target.getBoundingClientRect();
    const x = rect.x + rect.width / 2 - this.overlayRef.overlayElement.getBoundingClientRect().x - this.beakWidth/2;
    const y = rect.y + rect.height / 2 - this.host.getBoundingClientRect().y - this.beakWidth/2;

    if (dir === 'top' || dir === 'bottom') {
      this.beakHost.style.left = x + 'px';
    } else {
      this.beakHost.style.top = y + 'px';
    }

    const pos = (this.beakWidth - this.options.beakWidth) + 'px';
    if (dir === 'top') {
      this.beakHost.style.bottom = pos;
    } else if (dir === 'bottom') {
      this.beakHost.style.top = pos;
    } else if (dir === 'left') {
      this.beakHost.style.right = pos;
    } else if (dir === 'right') {
      this.beakHost.style.left = pos;
    }
  }

  private animateEnter(dir: MsTooltipPosition) {
    this._animationStateChanged.emit({state: 'opening'});
    gsap.gsap.fromTo(this.host, 0.2, {transform: 'scale3d(0.9, 0.9, 1)', opacity: 0}, {
      transform: '',
      opacity: 1,
      ease: MsMotionTimings.decelerate
    }).then(() => {
      this.host.style.opacity = '1';
      this._animationStateChanged.emit({state: 'opened', totalTime: 200});
    })
  }

  async animateOut(): Promise<void> {
    this._animationStateChanged.emit({state: 'closing', totalTime: 0});
    await gsap.gsap.to(this.host, .3, {transform: 'scale3d(0.9, 0.9, 1)', opacity: 0});
    this._animationStateChanged.emit({state: 'closed', totalTime: 300});
  }

  getKeyframe(dir: MsTooltipPosition) {
    return {transform: 'scale3d(0.9, 0.9, 1)', opacity: 0}
  }

  get beakRect(): DOMRect {
    return this.beakHost.getBoundingClientRect();
  }

  get position(): MsTooltipPosition {
    const targetRect = this.target.getBoundingClientRect();
    const rect = this.overlayRef.overlayElement.getBoundingClientRect();

    if (rect.right <= targetRect.left) {
      return 'left'
    }
    if (rect.left >= targetRect.right) {
      return 'right';
    }

    if (rect.bottom <= targetRect.top) {
      return 'top';
    }

    if (rect.top >= targetRect.bottom) {
      return 'bottom';
    }

    return 'top';
  }

  private setTheme() {
    const themeName: MsTooltipTheme = this.options.theme || 'error';

    const theme: MsTooltipThemeDeclaration = this.themes.get(themeName) || {
      name: 'default',
      bgColor: 'green',
      fontColor: 'white'
    };

    this.contentHost.classList.add(`ms-fontColor-${theme.fontColor}`, `ms-bgColor-${theme.bgColor}`);
    this.beakHost.classList.add(`ms-bgColor-${theme.bgColor}`);
    // this.beakHost.classList.add(`ms-bgColor-blue`);
  }

  get beakWidth(): number {
    const width: number = +this.options.beakWidth;
    return Math.sqrt(2 * width * width);
  }
}
