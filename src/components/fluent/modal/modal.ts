import {Inject, Injectable, Injector, OnDestroy, Optional, SkipSelf, TemplateRef} from '@angular/core';
import {
  ComponentType,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  ScrollStrategy
} from '@angular/cdk/overlay';
import {MsModalRef} from './modal-ref';
import {MsModalOptions} from './modal-options';
import {ComponentPortal, PortalInjector, TemplatePortal} from '@angular/cdk/portal';
import {MsModalPortal} from './modal-portal';
import {MS_MODAL_DEFAULT_OPTIONS} from './modal-default-options';
import {MS_MODAL_SCROLL_STRATEGY} from './modal-scrool-strategy';
import {defer, Observable, Subject} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {Directionality} from '@angular/cdk/bidi';

@Injectable()
export class MsModal implements OnDestroy {
  private _openModalsAtThisLevel: MsModalRef<any>[] = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenedAtThisLevel = new Subject<MsModalRef<any>>();
  private _ariaHiddenElements = new Map<Element, string | null>();

  private _scrollStrategy: () => ScrollStrategy;

  /** Keeps track of the currently-open modals. */
  get openModals(): MsModalRef<any>[] {
    return this._parentModal ? this._parentModal.openModals : this._openModalsAtThisLevel;
  }

  /** Stream that emits when a modal has been opened. */
  get afterOpened(): Subject<MsModalRef<any>> {
    return this._parentModal ? this._parentModal.afterOpened : this._afterOpenedAtThisLevel;
  }

  get _afterAllClosed(): Subject<void> {
    const parent = this._parentModal;
    return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
  }

  /**
   * Stream that emits when all open modal have finished closing.
   * Will emit on subscribe if there are no open modals to begin with.
   */
  readonly afterAllClosed: Observable<void> = defer(() => this.openModals.length ?
    this._afterAllClosed :
    this._afterAllClosed.pipe(startWith(undefined))) as Observable<any>;

  constructor(private _overlay: Overlay,
              private _injector: Injector,
              @Optional() @Inject(MS_MODAL_DEFAULT_OPTIONS) private _defaultOptions: MsModalOptions,
              @Inject(MS_MODAL_SCROLL_STRATEGY) scrollStrategy: any,
              @Optional() @SkipSelf() private _parentModal: MsModal,
              private _overlayContainer: OverlayContainer) {

    this._scrollStrategy = scrollStrategy;
  }

  /**
   * Opens a modal modal containing the given component.
   * @param targetRef Type of the component to load into the modal,
   *     or a TemplateRef to instantiate as the modal content.
   * @param options Extra optionsuration options.
   *
   * @typeparam T the type of the target component or templateRef.
   * @typeparam D The type of data passed into the modal injector.
   * @typeparam R The type of data returned by the modal closing result.
   *
   * @returns Reference to the newly-opened modal.
   */
  open<T, D = any, R = any>(targetRef: ComponentType<T> | TemplateRef<T>, options?: MsModalOptions): MsModalRef<T, R> {
    options = _applyOptionsDefaults(options, this._defaultOptions || new MsModalOptions());

    if (options.id && this.getModalById(options.id)) {
      throw Error(`Modal with id "${options.id}" exists already. The modal id must be unique.`);
    }

    const overlayRef = this._createOverlay(options);

    const modalPortal = this._createModalPortal(options);
    const modalPortalRef = overlayRef.attach(modalPortal);



    return this._attachModalContent<T, R>(targetRef, modalPortalRef.instance, overlayRef, options);
  }

  /**
   * Creates a MsModalPortal to a modal.
   *
   * @param options The modal configuration.
   * @returns A modalPortal.
   */
  private _createModalPortal(options: MsModalOptions): ComponentPortal<MsModalPortal> {
    const userInjector = options && options.viewContainerRef && options.viewContainerRef.injector;

    const injector = new PortalInjector(userInjector || this._injector, new WeakMap([[MsModalOptions, options]]))

    return new ComponentPortal(MsModalPortal, options.viewContainerRef, injector);
  }

  /**
   * Attaches the user-provided component to the already-created MsModalContainer.
   * @param componentOrTemplateRef The type of component being loaded into the modal,
   *     or a TemplateRef to instantiate as the content.
   * @param modalPortal Reference to the wrapping MsModalPortal.
   * @param overlayRef Reference to the overlay in which the modal resides.
   * @param options The modal configuration.
   * @returns A promise resolving to the MsModalRef that should be returned to the user.
   */
  private _attachModalContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    modalPortal: MsModalPortal,
    overlayRef: OverlayRef,
    options: MsModalOptions): MsModalRef<T, R> {

    // Create a reference to the modal we're creating in order to give the user a handle
    // to modify and close it.
    const modalRef =
      new MsModalRef<T, R>(overlayRef, modalPortal, options.id);

    // When the modal backdrop is clicked, we want to close it.
    if (options.hasBackdrop) {
      overlayRef.backdropClick().subscribe(() => {
        if (!modalRef.disableClose) {
          modalRef.close();
        }
      });
    }

    if (componentOrTemplateRef instanceof TemplateRef) {
      modalPortal.attachTemplatePortal(
        // tslint:disable-next-line:no-non-null-assertion
        new TemplatePortal<T>(componentOrTemplateRef, null!,
          { $implicit: modalRef } as any));
    } else {
      const injector = this._createInjector<T>(options, modalRef, modalPortal);
      const contentRef = modalPortal.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, undefined, injector));
      modalRef.componentInstance = contentRef.instance;
    }

    modalRef
      .updateSize(options.width, options.height)
      .updatePosition(options.position);

    return modalRef;
  }


  /**
   * Creates a custom injector to be used inside the modal. This allows a component loaded inside
   * of a modal to close itself and, optionally, to return a value.
   * @param options Config object that is used to construct the modal.
   * @param modalRef Reference to the modal.
   * @param modalPortal Modal container element that wraps all of the contents.
   * @returns The custom injector that can be used inside the modal.
   */
  private _createInjector<T>(
    options: MsModalOptions,
    modalRef: MsModalRef<T>,
    modalPortal: MsModalPortal): PortalInjector {
    const userInjector = options && options.viewContainerRef && options.viewContainerRef.injector;


    const injectionTokens = new WeakMap<any, any>([
      [MsModalOptions, options],
      [MsModalRef, modalRef],
      [MsModalPortal, modalPortal]]);

    if(options.direction && (!userInjector || !userInjector.get<Directionality | null>(Directionality, null))) {
      injectionTokens.set(Directionality, {
        value: options.direction
      });
    }
    return new PortalInjector(userInjector || this._injector, injectionTokens);
  }

  /**
   * Closes all of the currently-open modals.
   */
  closeAll(): void {
    this._closeModals(this.openModals);
  }

  /**
   * Finds an open modal by its id.
   * @param id ID to use when looking up the modal.
   */
  getModalById(id: string): MsModalRef<any> | undefined {
    return this.openModals.find(modal => modal.id === id);
  }

  /**
   * Creates the overlay into which the modal will be loaded.
   * @param options The modal options.
   * @returns A promise resolving to the OverlayRef for the created overlay.
   */
  private _createOverlay(options: MsModalOptions): OverlayRef {
    const overlayOptions = this._getOverlayOptions(options);
    return this._overlay.create(overlayOptions);
  }

  /**
   * Creates an overlay options from a modal options.
   * @param modalOptions The modal options.
   * @returns The overlay options.
   */

  private _getOverlayOptions(modalOptions: MsModalOptions): OverlayConfig {
    const state = new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      scrollStrategy: modalOptions.scrollStrategy || this._scrollStrategy(),
      panelClass: modalOptions.panelClass,
      hasBackdrop: modalOptions.hasBackdrop,
      direction: modalOptions.direction,
      minWidth: modalOptions.minWidth,
      minHeight: modalOptions.minHeight,
      maxWidth: modalOptions.maxWidth,
      maxHeight: modalOptions.maxHeight,
      disposeOnNavigation: modalOptions.closeOnNavigation
    });

    if (modalOptions.backdropClass) {
      state.backdropClass = modalOptions.backdropClass;
    }

    return state;
  }

  ngOnDestroy() {
    // Only close the modals at this level on destroy
    // since the parent service may still be active.
    this._closeModals(this._openModalsAtThisLevel);
    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
  }

  /**
   * Removes a modal from the array of open modals.
   * @param modalRef Modal to be removed.
   */
  _removeOpenModal(modalRef
                     :
                     MsModalRef<any>
  ) {
    const index = this.openModals.indexOf(modalRef);

    if (index > -1) {
      this.openModals.splice(index, 1);

      // If all the modals were closed, remove/restore the `aria-hidden`
      // to a the siblings and emit to the `afterAllClosed` stream.
      if (!this.openModals.length) {
        this._ariaHiddenElements.forEach((previousValue, element) => {
          if (previousValue) {
            element.setAttribute('aria-hidden', previousValue);
          } else {
            element.removeAttribute('aria-hidden');
          }
        });

        this._ariaHiddenElements.clear();
        this._afterAllClosed.next();
      }
    }
  }

  /**
   * Hides all of the content that isn't an overlay from assistive technology.
   */
  _hideNonModalContentFromAssistiveTechnology() {
    const overlayContainer = this._overlayContainer.getContainerElement();

    // Ensure that the overlay container is attached to the DOM.
    if (overlayContainer.parentElement) {
      const siblings = overlayContainer.parentElement.children;

      for (let i = siblings.length - 1; i > -1; i--) {
        const sibling = siblings[i];

        if (sibling !== overlayContainer &&
          sibling.nodeName !== 'SCRIPT' &&
          sibling.nodeName !== 'STYLE' &&
          !sibling.hasAttribute('aria-live')) {

          this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
          sibling.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  /** Closes all of the modals in an array. */
  _closeModals(modals: MsModalRef<any> []) {
    let i = modals.length;

    while (i--) {
      // The `_openModals` property isn't updated after close until the rxjs subscription
      // runs on the next microtask, in addition to modifying the array as we're going
      // through it. We loop through all of them and call close without assuming that
      // they'll be removed from the list instantaneously.
      modals[i].close();
    }
  }
}


/**
 * Applies default options to the modal options.
 * @param options Options to be modified.
 * @param defaultOptions Default options provided.
 * @returns The new options  object.
 */
function _applyOptionsDefaults(
  options?: MsModalOptions, defaultOptions?: MsModalOptions): MsModalOptions {
  return {...defaultOptions, ...options};
}
