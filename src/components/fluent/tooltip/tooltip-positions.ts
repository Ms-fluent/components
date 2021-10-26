import {FlexibleConnectedPositionStrategy, HorizontalConnectionPos, VerticalConnectionPos} from '@angular/cdk/overlay';
import {MsTooltipOptions} from './tooltip-options';

export function setOverlayPosition(options: MsTooltipOptions, positionStrategy: FlexibleConnectedPositionStrategy) {
  const position = options.position;
  const align = options.align;
  let [originX, originFallbackX]: HorizontalConnectionPos[] = ['start', 'end'];
  let [overlayX, overlayFallbackX]: HorizontalConnectionPos[] = ['end', 'start'];

  let [overlayY, overlayFallbackY]: VerticalConnectionPos[] = ['top', 'bottom'];
  let [originY, originFallbackY]: VerticalConnectionPos[] = ['bottom', 'top'];

  if (position === 'left') {
    [originX, originFallbackX] = ['start', 'end'];
    [overlayX, overlayFallbackX] = ['end', 'start']
  } else if (position === 'right') {
    [originX, originFallbackX] = ['end', 'start'];
    [overlayX, overlayFallbackX] = ['start', 'end']
  } else if (position === 'top') {
    [originY, originFallbackY] = ['top', 'bottom'];
    [overlayY, overlayFallbackY] = ['bottom', 'top']
  } else if (position === 'bottom') {
    [originY, originFallbackY] = ['bottom', 'top'];
    [overlayY, overlayFallbackY] = ['top', 'bottom'];
  }

  if (position === 'left' || position === 'right') {
    if (align === 'start') {
      [originY, originFallbackY] = ['top', 'bottom'];
      [overlayY, overlayFallbackY] = ['top', 'bottom']
    } else if (align === 'end') {
      [originY, originFallbackY] = ['bottom', 'top'];
      [overlayY, overlayFallbackY] = ['bottom', 'top'];
    } else {
      [originY, originFallbackY] = ['center', 'top'];
      [overlayY, overlayFallbackY] = ['center', 'top'];
    }
  }

  if (position === 'bottom' || position === 'top') {
    if (align === 'start') {
      [originX, originFallbackX] = ['start', 'end'];
      [overlayX, overlayFallbackX] = ['start', 'end'];
    } else if (align === 'end') {
      [originX, originFallbackX] = ['end', 'start'];
      [overlayX, overlayFallbackX] = ['end', 'start'];
    } else if (align === 'center') {
      [originX, originFallbackX] = ['center', 'start'];
      [overlayX, overlayFallbackX] = ['center', 'start'];
    }
  }

  const offsetY = 0;

  positionStrategy.withPositions([
    {originX, originY, overlayX, overlayY, offsetY},
    {originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY},
    {
      originX,
      originY: originFallbackY,
      overlayX,
      overlayY: overlayFallbackY,
      offsetY: -offsetY
    },
    {
      originX: originFallbackX,
      originY: originFallbackY,
      overlayX: overlayFallbackX,
      overlayY: overlayFallbackY,
      offsetY: -offsetY
    }
  ]);
}
