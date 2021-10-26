/** Injection token that can be used to access the target element of the tooltip. */
import {InjectionToken} from '@angular/core';

export const MS_TOOLTIP_TARGET = new InjectionToken<HTMLElement>('MsTooltipTarget');
