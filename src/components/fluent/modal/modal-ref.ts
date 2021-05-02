// Counter for unique dialog ids.
import {GlobalPositionStrategy, OverlayRef} from "@angular/cdk/overlay";
import {ModalPosition} from "./modal-position";
import {MsModalPortal} from "./modal-portal";
import {Observable, Subject} from "rxjs";
import {filter, take} from "rxjs/operators";
import {ESCAPE, hasModifierKey} from "@angular/cdk/keycodes";

let uniqueId = 0;

export class MsModalRef<T, R = any> {

  /** The instance of component opened into the dialog. */
  componentInstance: T;

  /** Whether the user is allowed to close the dialog. */
  disableClose: boolean | undefined = this._modalPortal._options.disableClose;

  /** Subject for notifying the user that the dialog has finished opening. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the dialog has finished closing. */
  private readonly _afterClosed = new Subject<R | undefined>();

  /** Subject for notifying the user that the dialog has started closing. */
  private readonly _beforeClosed = new Subject<R | undefined>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;


  constructor(private _overlayRef: OverlayRef, public readonly _modalPortal: MsModalPortal, public readonly id: string) {
    // Emit when opening animation completes
    _modalPortal._animationStateChanged.pipe(
      filter(event => event.phaseName === 'done' && event.toState === 'enter'),
      take(1)
    )
      .subscribe(() => {
        this._afterOpened.next();
        this._afterOpened.complete();
      });

    // Dispose overlay when closing animation is complete
    _modalPortal._animationStateChanged.pipe(
      filter(event => event.phaseName === 'done' && event.toState === 'exit'),
      take(1)
    ).subscribe(() => this._overlayRef.dispose());

    _overlayRef.detachments().subscribe(() => {
      this._beforeClosed.next(this._result);
      this._beforeClosed.complete();
      this._afterClosed.next(this._result);
      this._afterClosed.complete();
      this.componentInstance = null!;
      this._overlayRef.dispose();
    });


    _overlayRef.keydownEvents()
      .pipe(filter(event => {
        return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
      }))
      .subscribe(event => {
        event.preventDefault();
        this.close();
      });
  }

  /**
   * Close the dialog.
   * @param dialogResult Optional result to return to the dialog opener.
   */
  close(dialogResult?: R): void {
    this._result = dialogResult;

    // Transition the backdrop in parallel to the dialog.
    this._modalPortal._animationStateChanged.pipe(
      filter(event => event.phaseName === 'start'),
      take(1)
    )
      .subscribe(() => {
        this._beforeClosed.next(dialogResult);
        this._beforeClosed.complete();
        this._overlayRef.detachBackdrop();
      });

    this._modalPortal._startExitAnimation();
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  afterOpened(): Observable<void> {
    return this._afterOpened.asObservable();
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Gets an observable that is notified when the dialog has started closing.
   */
  beforeClosed(): Observable<R | undefined> {
    return this._beforeClosed.asObservable();
  }

  /**
   * Gets an observable that emits when the overlay's backdrop has been clicked.
   */
  backdropClick(): Observable<MouseEvent> {
    return this._overlayRef.backdropClick();
  }

  /**
   * Gets an observable that emits when keydown events are targeted on the overlay.
   */
  keydownEvents(): Observable<KeyboardEvent> {
    return this._overlayRef.keydownEvents();
  }

  /**
   * Updates the dialog's width and height.
   * @param width New width of the dialog.
   * @param height New height of the dialog.
   */
  updateSize(width: string = '', height: string = ''): this {
    this.positionStrategy.width(width).height(height);

    this._overlayRef.updatePosition();
    return this;
  }

  /** Add a CSS class or an array of classes to the overlay pane. */
  addPanelClass(classes: string | string[]): this {
    this._overlayRef.addPanelClass(classes);
    return this;
  }

  /** Remove a CSS class or an array of classes from the overlay pane. */
  removePanelClass(classes: string | string[]): this {
    this._overlayRef.removePanelClass(classes);
    return this;
  }


  /**
   * Updates the modal's position.
   * @param position New modal position.
   */
  updatePosition(position?: ModalPosition): this {
    let strategy = this.positionStrategy;

    if(!position){
      strategy.centerHorizontally();
      strategy.centerVertically();
      this._overlayRef.updatePosition();
      return this;
    }

    if(position.left || position.right) {
      position.left ? strategy.left(position.left) : strategy.right(position.right);
    }

    if(position.top || position.bottom) {
      position.top ? strategy.top(position.top): strategy.bottom(position.bottom);
    }
    this._overlayRef.updatePosition();
    return this;
  }


  get positionStrategy(): GlobalPositionStrategy {
    return this._overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
  }
}
