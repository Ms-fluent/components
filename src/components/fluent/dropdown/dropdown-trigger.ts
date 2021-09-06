import {Directive, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, ViewContainerRef} from '@angular/core';
import {MsDropdown} from './dropdown';
import {
  MS_DROPDOWN_DEFAULT_OPTIONS,
  MsDropdownDefaultOptions,
} from './dropdown-options';
import {FlexibleConnectedPositionStrategy, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {_setDropdownPosition, MsDropdownPositionX, MsDropdownPositionY} from './dropdown-positions';
import * as gsap from 'gsap'

@Directive({
  selector: '[MsDropdownTrigger], [ms-dropdown-trigger]',
  host: {
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'isOpen || null',
    '(click)': '_handleClick()'
  }
})
export class MsDropdownTrigger implements OnDestroy, OnInit {
  /** Position of the menu in the X axis. */
  @Input()
  xPosition: MsDropdownPositionX = this._defaultOptions.xPosition;


  @Input()
  yPosition: MsDropdownPositionY = this._defaultOptions.yPosition;

  @Input()
  overlapTrigger: boolean = this._defaultOptions.overlapTrigger;

  @Input()
  hasBackdrop: boolean | undefined = this._defaultOptions.hasBackdrop;

  @Input()
  backdropClass: string = this._defaultOptions.backdropClass;

  @Input('MsDropdownTrigger')
  _target1: MsDropdown;

  @Input('ms-dropdown-trigger')
  _target2: MsDropdown;

  get target(): MsDropdown {
    return this._target1 || this._target2;
  }

  private _overlayRef: OverlayRef | null = null;

  private _portal: TemplatePortal;

  /** Tells if the menu is open. */
  private _isOpen: boolean = false;
  get isOpen(): boolean {
    return this._isOpen;
  }

  constructor(@Inject(MS_DROPDOWN_DEFAULT_OPTIONS) private _defaultOptions: MsDropdownDefaultOptions,
              private _viewContainerRef: ViewContainerRef,
              @Optional() private _parent: MsDropdown,
              private _overlay: Overlay,
              private _elementRef: ElementRef<MsDropdown>) {

    if (this._parent) {
      this._parent.children.push(this);
    }
  }

  ngOnDestroy(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  ngOnInit(): void {
  }

  _handleClick() {
    this.open();
  }

  open() {
    if (this._isOpen) {
      return;
    }

    if (this._parent) {
      this._parent.close();
    }
    // let [originX, originFallbackX]: HorizontalConnectionPos[] = ['start', 'end'];
    const overlay = this._getOverlay();
    const portal = this._getPortal();
    const menu = overlay.attach(portal);
    menu.detectChanges();
    this._overlayRef = overlay;
    this._portal = portal;
    this.target.overlayRef = overlay;
    // this.target.onclose.subscribe(() => this._menuOpen = false);

    // if (this._parentMenu) {
    //   this._parentMenu.subMenu = this.menu;
    // }

    gsap.gsap.from(menu.rootNodes[0], {duration: .2, scale: 0.9});
    const positionStrategy = overlay.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;

    _setDropdownPosition(this.xPosition, this.yPosition, !!this._parent, positionStrategy);


    //  this.menu.items.forEach(item => item._checkbox ? item._checkbox.checkbox.id = item.for : '');
    // this.menu.items.forEach(item => item._click.subscribe(() => item._checkbox ? '' : overlay.detach()));


    overlay.backdropClick().subscribe(() => {
      this.close();
    });
    this._isOpen = true;
  }

  async close() {
    if (this.isOpen) {
      await gsap.gsap.to(this._overlayRef.hostElement, {scale: 0.95, opacity: 0, duration: .1});
      this._overlayRef.detach();
      this.target.close();
      this._isOpen = false;
    }

  }

  private _getOverlay(): OverlayRef {
    return this._createOverlay();
  }

  private _createOverlay(): OverlayRef {
    return this._overlay.create({
      hasBackdrop: !this._parent,
      backdropClass: this.backdropClass,
      positionStrategy: this._overlay.position().flexibleConnectedTo(this._elementRef)
        .withLockedPosition()
        .withTransformOriginOn('.ms-menu')

        .withPositions([{originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom'}])
    });
  }


  /** Gets the portal that should be attached to the overlay. */
  private _getPortal(): TemplatePortal {

    if (!this._portal || this._portal.templateRef !== this.target.templateRef) {
      this._portal = new TemplatePortal(this.target.templateRef, this._viewContainerRef);
    }

    return this._portal;
  }


}
