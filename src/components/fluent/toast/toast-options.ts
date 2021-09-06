/** Valid ARIA roles for a toast element. */
import {ComponentFactoryResolver, InjectionToken, ViewContainerRef} from '@angular/core';
import {Direction} from '@angular/cdk/bidi';

export type MsToastRole = 'toast' | 'alert' | 'status' | 'log';

export type MsToastAlign = 'left' | 'center' | 'right';
export type MsToastPosition = 'top' | 'bottom';

/**
 * Configuration for opening a modal toast with the MsToast service.
 */
export class MsToastOptions<D = any> {
  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the toast. This does not affect where the toast
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /** ID for the toast. If omitted, a unique one will be generated. */
  id?: string;

  duration?: number = 10000;

  /** The ARIA role of the toast element. */
  role?: MsToastRole = 'log';

  /** Custom class for the overlay pane. */
  panelClass?: string | string[] = '';

  /** Whether the toast has a backdrop. */
  hasBackdrop?: boolean = false;

  /** Custom class for the backdrop. */
  backdropClass?: string | string[] = '';

  /** Whether the user can use escape or clicking on the backdrop to close the modal. */
  disableClose?: boolean = false;

  /** Width of the toast. */
  width?: string = '';

  /** Height of the toast. */
  height?: string = '';

  /** Min-width of the toast. If a number is provided, assumes pixel units. */
  minWidth?: number | string;

  /** Min-height of the toast. If a number is provided, assumes pixel units. */
  minHeight?: number | string;

  /** Max-width of the toast. If a number is provided, assumes pixel units. Defaults to 80vw. */
  maxWidth?: number | string = '100vw';

  /** Max-height of the toast. If a number is provided, assumes pixel units. */
  maxHeight?: number | string;

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** Layout direction for the toast's content. */
  direction?: Direction;

  /** ID of the element that describes the toast. */
  ariaDescribedBy?: string | null = null;

  /** ID of the element that labels the toast. */
  ariaLabelledBy?: string | null = null;

  /** Aria label to assign to the toast element. */
  ariaLabel?: string | null = null;

  /** Whether the toast should focus the first focusable element on open. */
  autoFocus?: boolean = true;

  /**
   * Whether the toast should restore focus to the
   * previously-focused element, after it's closed.
   */
  restoreFocus?: boolean = true;

  /**
   * Whether the toast should close when the user goes backwards/forwards in history.
   * Note that this usually doesn't include clicking on links (unless the user is using
   * the `HashLocationStrategy`).
   */
  closeOnNavigation?: boolean = true;

  /** Alternate `ComponentFactoryResolver` to use when resolving the associated component. */
  componentFactoryResolver?: ComponentFactoryResolver;

  // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
}


export class MsToastGlobalOptions {
  position: MsToastPosition = 'bottom';
  align: MsToastAlign = 'center';
  spaceBetween: number = 2;
}


export const MS_TOAST_DEFAULT_OPTIONS = new InjectionToken<MsToastOptions>('ms-toast-default-options');

export const MS_TOAST_GLOBAL_DEFAULT_OPTIONS = new InjectionToken<MsToastGlobalOptions>('MSToastGlobalOptions', {
  providedIn: 'root',
  factory: () => new MsToastGlobalOptions()
});
