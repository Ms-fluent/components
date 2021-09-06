export type MsDropdownPositionX = 'ltl' | 'rtl' | 'ltr' | 'rtr';

export type MsDropdownPositionY = 'ttt' | 'ttb' | 'btt' | 'btb';

/**
 * Sets the appropriate positions on a position strategy
 * so the overlay connects with the trigger correctly.
 * @param positionStrategy Strategy whose position to update.
 */
import {FlexibleConnectedPositionStrategy, HorizontalConnectionPos, VerticalConnectionPos} from '@angular/cdk/overlay';

export function _setDropdownPosition(xPosition: MsDropdownPositionX, yPosition: MsDropdownPositionY, isSub: boolean,
                             positionStrategy: FlexibleConnectedPositionStrategy) {
  let [originX, originFallbackX]: HorizontalConnectionPos[] = ['end', 'start'];
  let [overlayX, overlayFallbackX] = [originX, originFallbackX];

  if (xPosition === 'ltl') {
    [originX, originFallbackX] = ['start', 'end'];
    [overlayX, overlayFallbackX] = ['start', 'end'];
  } else if (xPosition === 'rtl') {
    [originX, originFallbackX] = ['end', 'start'];
    [overlayX, overlayFallbackX] = ['start', 'end'];
  } else if (xPosition === 'ltr') {
    [originX, originFallbackX] = ['start', 'end'];
    [overlayX, overlayFallbackX] = ['end', 'start'];
  } else if (xPosition === 'rtr') {
    [originX, originFallbackX] = ['end', 'start'];
    [overlayX, overlayFallbackX] = ['end', 'start'];
  }


  let [overlayY, overlayFallbackY]: VerticalConnectionPos[] = ['top', 'bottom'];
  let [originY, originFallbackY] = [overlayY, overlayFallbackY];

  if (yPosition === 'ttt') {
    [originY, originFallbackY] = ['top', 'bottom'];
    [overlayY, overlayFallbackY] = ['top', 'bottom'];
  } else if (yPosition === 'ttb') {
    [originY, originFallbackY] = ['top', 'bottom'];
    [overlayY, overlayFallbackY] = ['bottom', 'top'];
  } else if (yPosition === 'btt') {
    [originY, originFallbackY] = ['bottom', 'top'];
    [overlayY, overlayFallbackY] = ['top', 'bottom'];
  } else if (yPosition === 'btb') {
    [originY, originFallbackY] = ['bottom', 'top'];
    [overlayY, overlayFallbackY] = ['bottom', 'top'];
  }


  const offsetY = 0;

  if (isSub) {
    // When the menu is a sub-menu, it should always align itself
    // to the edges of the trigger, instead of overlapping it.
    overlayFallbackX = originX = xPosition === 'ltl' ? 'start' : 'end';
    originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
    [originY, originFallbackY] = ['top', 'bottom'];
    [overlayY, overlayFallbackY] = ['top', 'bottom'];
  }


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
