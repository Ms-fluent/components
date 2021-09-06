/** Injection token that determines the scroll handling while a select is open. */
import {InjectionToken} from '@angular/core';
import {Overlay, ScrollStrategy} from '@angular/cdk/overlay';

export const MSF_SELECT_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('msf-select-scroll-strategy');

/** @docs-private */
export function MSF_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay):
  () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const MSF_SELECT_SCROLL_STRATEGY_PROVIDER = {
  provide: MSF_SELECT_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: MSF_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
