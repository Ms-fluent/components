import {OverlayRef} from '@angular/cdk/overlay';
import {Observable, Subject} from 'rxjs';
import {MsToastContainer} from './toast-container';
import {filter, take} from 'rxjs/operators';
import {MsToastOptions} from './toast-options';

let uniqueId = 0;

/** Possible states of the lifecycle of a dialog. */
export const enum MsToastState {OPEN, CLOSING, CLOSED, MOVING}

export class MsToastRef<T, R = any> {
  /** The instance of component opened into the toast. */
  componentInstance: T;

  /** Subject for notifying the user that the dialog has finished opening. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the dialog has finished closing. */
  private readonly _afterClosed = new Subject<R | undefined>();

  /** Subject for notifying the user that the dialog has started closing. */
  private readonly _beforeClosed = new Subject<R | undefined>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  private _state: MsToastState = MsToastState.OPEN;

  _userCloseTimeOut: any;

  y: number = 0;
  _height: number;

  get height(): number {
    return this._containerInstance.host.getBoundingClientRect().height;
  }

  constructor(private _overlayRef: OverlayRef,
              private options: MsToastOptions,
              public _containerInstance: MsToastContainer,
              readonly id: string = `ms-toast-${uniqueId++}`) {

    this._userCloseTimeOut = this.attachCloseTimeOut();

    this._containerInstance._animationStateChanged.pipe(
      filter(event => event.state === 'opened'),
      take(1)
    ).subscribe(() => {
      this._afterOpened.next();
      this._afterOpened.complete();
      this._height = this._containerInstance.host.getBoundingClientRect().height;
    });


    this._containerInstance._animationStateChanged.pipe(
      filter(event => event.state === 'closed'),
      take(1)
    ).subscribe(() => {
      this._afterClosed.next();
      this._afterClosed.complete();
      this.detachCloseTimeOut();
    });
  }

  attachCloseTimeOut() {
    if (this.options.duration !== undefined) {
      this._userCloseTimeOut = setTimeout(() => {
        this.close();
      }, this.options.duration);
    }
  }

  detachCloseTimeOut() {
    if (this._userCloseTimeOut) {
      clearTimeout(this._userCloseTimeOut);
    }
  }

  async close(result?: R): Promise<void> {
    this._result = result;

    this._state = MsToastState.CLOSING;
    await this._containerInstance.animateToastOut();

    this.overlayRef.dispose();
    this._state = MsToastState.CLOSED;
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  afterOpened(): Observable<void> {
    return this._afterOpened;
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed;
  }

  /**
   * Gets an observable that is notified when the dialog has started closing.
   */
  beforeClosed(): Observable<R | undefined> {
    return this._beforeClosed;
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
   * Updates the dialog's width and height.
   * @param width New width of the toast.
   * @param height New height of the toast.
   */
  updateSize(width: string = '', height: string = ''): this {
    this._overlayRef.updateSize({width, height});
    this._overlayRef.updatePosition();
    return this;
  }

  get overlayRef(): OverlayRef {
    return this._overlayRef;
  }
}
