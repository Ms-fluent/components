/** Injection token that determines the scroll handling while the modal is open. */
import {Overlay, ScrollStrategy} from "@angular/cdk/overlay";
import {InjectionToken} from "@angular/core";

export const MS_MODAL_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('ms-modal-scroll-strategy');


/** @docs-private */
export function MS_MODAL_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export function MS_MODAL_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay):
  () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export const MS_MODAL_SCROLL_STRATEGY_PROVIDER = {
  provide: MS_MODAL_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: MS_MODAL_SCROLL_STRATEGY_PROVIDER_FACTORY,
};


