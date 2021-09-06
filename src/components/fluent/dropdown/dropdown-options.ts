import {InjectionToken} from '@angular/core';
import {MsDropdownPositionX, MsDropdownPositionY} from './dropdown-positions';



export type MsDropdownTriggerEvent = 'click' | 'hover' | 'none';

export class MsDropdownDefaultOptions {
  /** The x-axis position of the menu. */
  xPosition: MsDropdownPositionX;

  /** The y-axis position of the menu. */
  yPosition: MsDropdownPositionY;

  /** Whether the menu should overlap the menu trigger. */
  overlapTrigger: boolean;

  /** Class to be applied to the menu's backdrop. */
  backdropClass: string;

  /** Whether the menu has a backdrop. */
  hasBackdrop?: boolean;

  /** The trigger event of the menu dropdown. */
  triggerEvent: MsDropdownTriggerEvent;

  subDropdownTriggerEvent: MsDropdownTriggerEvent;
}


/** Injection token to be used to override the default options for `mat-menu`. */
export const MS_DROPDOWN_DEFAULT_OPTIONS =
  new InjectionToken<MsDropdownDefaultOptions>('ms-dropdown-default-options', {
    providedIn: 'root',
    factory: MS_DROPDOWN_DEFAULT_OPTIONS_FACTORY
  });

/** @docs-private */
export function MS_DROPDOWN_DEFAULT_OPTIONS_FACTORY(): MsDropdownDefaultOptions {
  return {
    overlapTrigger: false,
    xPosition: 'rtr',
    yPosition: 'btt',
    backdropClass: 'ms-dropdown-overlay',
    triggerEvent: 'click',
    subDropdownTriggerEvent: 'hover'
  };
}
