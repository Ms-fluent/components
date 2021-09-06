/** Injection token for the Tooltip's ScrollStrategy. */
import {InjectionToken} from '@angular/core';
import {ComponentType, Overlay, ScrollStrategy} from '@angular/cdk/overlay';
import {MsTooltipRef} from './tooltip-ref';
import {MsTooltipContainer} from './tooltip-container';
import {MsTooltipOptions} from './tooltip-options';
import {MS_TOOLTIP_DEFAULT_THEMES, MsTooltipThemes} from "./tooltip-theme";
import {colorThemes, MsButtonDefaultOptions} from "../button/public-api";

export const MS_TOOLTIP_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('MsTooltipScrollStrategy');

/** Injection token for the Tooltip's Data. */
export const MS_TOOLTIP_DATA = new InjectionToken<any>('MsTooltipData');

/** Injection token for the TooltipRef constructor. */
export const MS_TOOLTIP_REF = new InjectionToken<MsTooltipRef<any>>('MsTooltipRef');

/** Injection token for the TooltipOptions. */
export const MS_TOOLTIP_OPTIONS = new InjectionToken<MsTooltipOptions>('MsTooltipOptions');

/** Injection token for the Tooltip's TooltipContainer component. */
export const MS_TOOLTIP_CONTAINER =
  new InjectionToken<ComponentType<MsTooltipContainer>>('MsTooltipContainer');

/** Injection token for the Tooltip's theme collection. */
export const MS_TOOLTIP_THEMES = new InjectionToken<MsTooltipThemes>('MsTooltipThemes', {
  providedIn: 'root',
  factory: MS_TOOLTIP_THEMES_FACTORY
});

export function MS_TOOLTIP_THEMES_FACTORY(): MsTooltipThemes {
  return new MsTooltipThemes(MS_TOOLTIP_DEFAULT_THEMES);
}

/** @docs-private */
export function MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay):
  () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export const MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER = {
  provide: MS_TOOLTIP_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
