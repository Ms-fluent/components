import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BasePortalOutlet, CdkPortalOutlet, ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {AnimationEvent} from '@angular/animations';
import {msModalAnimations} from './modal-animations';
import {FocusTrap, FocusTrapFactory} from '@angular/cdk/a11y';
import {DOCUMENT} from '@angular/common';
import {MsModalOptions} from './modal-options';


@Component({
  templateUrl: 'modal-portal.html',
  encapsulation: ViewEncapsulation.None,
  animations: [ msModalAnimations.modalPortal],
  host: {
    'class': 'ms-modal-portal ms-depth-8',
    'tabindex': '-1',
    'aria-modal': 'true',
    '[attr.id]':'_id',
    '[attr.role]': '_options.role',
    '[attr.aria-labelledby]': '_options.ariaLabel || null',
    '[attr.aria-label]': '_options.ariaLabel || null',
    '[attr.aria-describedby]': '_options.ariaDescribedBy || null',
    '[@modalPortal]': '_state',
    '(@modalPortal.start)': '_onAnimationStart($event)',
    '(@modalPortal.done)': '_onAnimationDone($event)',

  }
})
export class MsModalPortal extends BasePortalOutlet{
  /** ID for the container DOM element. */
  _id: string;

  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, {static: true}) _portalOutlet: CdkPortalOutlet;

  /** The class that traps and manages focus within the dialog. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  /** State of the dialog animation. */
  _state: 'void' | 'enter' | 'exit' = 'enter';

  /** Emits when an animation state changes. */
  _animationStateChanged = new EventEmitter<AnimationEvent>();



  constructor(private _elementRef: ElementRef<HTMLElement>,
              private _changeDetectorRef: ChangeDetectorRef,
              private _focusTrapFactory: FocusTrapFactory,
              @Optional() @Inject(DOCUMENT) private _document: any,
              public readonly _options: MsModalOptions) {
    super();

    this._id = _options.id;
  }

  /**
   * Attach a ComponentPortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if(this._portalOutlet.hasAttached() ){
      throw Error('Attempting to attach dialog content after content is already attached');
    }
    this._savePreviouslyFocusedElement();
    return this._portalOutlet.attachComponentPortal(portal);
  }


  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if(this._portalOutlet.hasAttached() ){
      throw Error('Attempting to attach dialog content after content is already attached');
    }
    this._savePreviouslyFocusedElement();
    return this._portalOutlet.attachTemplatePortal(portal);
  }



  /** Moves the focus inside the focus trap. */
  private _trapFocus() {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }

    // If were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this._options.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    } else {
      // Otherwise ensure that focus is on the dialog container. It's possible that a different
      // component tried to move focus while the open animation was running. See:
      // https://github.com/angular/components/issues/16215
      this._elementRef.nativeElement.focus();
    }
  }


  /** Restores focus to the element that was focused before the dialog opened. */
  private _restoreFocus() {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (this._options.restoreFocus && toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /** Saves a reference to the element that was focused before the dialog was opened. */
  private _savePreviouslyFocusedElement() {
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;

      // Note that there is no focus method when rendering on the server.
      if (this._elementRef.nativeElement.focus) {
        // Move focus onto the dialog immediately in order to prevent the user from accidentally
        // opening multiple dialogs at the same time. Needs to be async, because the element
        // may not be focusable immediately.
        Promise.resolve().then(() => this._elementRef.nativeElement.focus());
      }
    }
  }


  /** Callback, invoked whenever an animation on the host completes. */
  _onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'enter') {
      this._trapFocus();
    } else if (event.toState === 'exit') {
      this._restoreFocus();
    }

    this._animationStateChanged.emit(event);
  }

  /** Callback, invoked when an animation on the host starts. */
  _onAnimationStart(event: AnimationEvent) {
    this._animationStateChanged.emit(event);
  }


  /** Starts the dialog exit animation. */
  _startExitAnimation(): void {
    this._state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorRef.markForCheck();
  }
}
