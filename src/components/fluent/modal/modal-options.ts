import {ModalPosition} from './modal-position';
import {ViewContainerRef} from '@angular/core';
import {ScrollStrategy} from '@angular/cdk/overlay';
import {Direction} from '@angular/cdk/bidi';

/** Valid ARIA roles for a modal element. */
export type ModalRole = 'modal' | 'alertmodal';


/**
 * Configuration for opening a modal modal with the MatModal service.
 */
export class MsModalOptions {

  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the modal. This does not affect where the modal
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /** Width of the modal. */
  width?: string = '';

  /** Height of the modal. */
  height?: string = '';

  /** Min-width of the modal. If a number is provided, pixel units are assumed. */
  minWidth?: number | string;

  /** Min-height of the modal. If a number is provided, pixel units are assumed. */
  minHeight?: number | string;

  /** Max-width of the modal. If a number is provided, pixel units are assumed. Defaults to 80vw */
  maxWidth?: number | string = '90vw';

  /** Max-height of the modal. If a number is provided, pixel units are assumed. */
  maxHeight?: number | string;

  /** Position overrides. */
  position?: ModalPosition;


  /** ID for the modal. If omitted, a unique one will be generated. */
  id?: string;

  /** The ARIA role of the modal element. */
  role?: ModalRole = 'modal';


  /** Custom class for the overlay pane. */
  panelClass?: string | string[] = '';

  /** Whether the modal has a backdrop. */
  hasBackdrop?: boolean = true;

  /** Custom class for the backdrop, */
  backdropClass?: string = '';

  /** Whether the user can use escape or clicking on the backdrop to close the modal. */
  disableClose?: boolean = false;


  /** ID of the element that describes the modal. */
  ariaDescribedBy?: string | null = null;

  /** ID of the element that labels the modal. */
  ariaLabelledBy?: string | null = null;

  /** Aria label to assign to the modal element */
  ariaLabel?: string | null = null;

  /** Whether the modal should focus the first focusable element on open. */
  autoFocus?: boolean = true;

  /**
   * Whether the modal should restore focus to the
   * previously-focused element, after it's closed.
   */
  restoreFocus?: boolean = true;

  /** Scroll strategy to be used for the modal. */
  scrollStrategy?: ScrollStrategy;

  /** Layout direction for the dialog's content. */
  direction?: Direction;

  /**
   * Whether the modal should close when the user goes backwards/forwards in history.
   * Note that this usually doesn't include clicking on links (unless the user is using
   * the `HashLocationStrategy`).
   */
  closeOnNavigation?: boolean = true;
}
