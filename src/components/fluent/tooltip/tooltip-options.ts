import {MsTooltipContainer} from './tooltip-container';
import {ComponentType} from '@angular/cdk/overlay';
import {ViewContainerRef} from '@angular/core';
import {MsTooltipTheme} from './tooltip-theme';
import {Direction} from '@angular/cdk/bidi';

export type MsTooltipTriggerEvent = 'hover' | 'click'

export type MsTooltipAlign = 'start' | 'end' | 'center';
export type MsTooltipPosition = 'left' | 'top' | 'bottom' | 'right'

export class MsTooltipOptions<D = any> {
  /** Data to be injected into the tooltip content. */
  data?: D | null = null;

  /** The color theme of the tooltip */
  theme?: MsTooltipTheme = 'standard';

  /** Custom class(es) for the overlay panel. */
  panelClass?: string | string[] = 'ms-tooltip-panel';

  /** Whether the tooltip has a background. */
  hasBackdrop?: boolean = true;

  /** Custom class(es) for the tooltip. */
  backdropClass?: string | undefined = '';

  /** The layout direction for the dialog content. */
  direction?: Direction;

  /** The Tooltip position relative to her target. */
  position?: MsTooltipPosition = 'bottom';

  align?: MsTooltipAlign = 'center';

  /** ID of the element that describes the dialog. */
  ariaDescribedBy?: string | null = null;

  /** Aria label to assign to the dialog element */
  ariaLabel?: string | null = null;

  /** Component to use as the container for the dialog. */
  containerComponent?: ComponentType<MsTooltipContainer>;

  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the dialog. This does not affect where the dialog
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /** The width of the tooltip. */
  width?: string = '';

  /** The height of the tooltip. */
  height?: string = '';

  /** The minimum width of the tooltip. */
  minWidth?: string | number = '';

  /** The minimum height of the tooltip. */
  minHeight?: string | number = '';

  /** The maximum width of the tooltip. */
  maxWidth?: string | number = '80vw';

  /** The maximum height of the tooltip. */
  maxHeight?: string | number = '';

  /** The size in pixel of the tooltip beak. */
  beakWidth?: number = 12;
}

class Point {
  x: number;
}
