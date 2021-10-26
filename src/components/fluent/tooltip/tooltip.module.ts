import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsTooltip} from './tooltip';
import {MsTooltipTrigger} from './tooltip-trigger';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {MsTooltipTitleContent} from './tooltip-title-content';
import {MsTooltipContainer} from './tooltip-container';
import {MS_TOOLTIP_CONTAINER} from './tooltip-injectors';
import {MsTitle} from './ms-title';
import {MsTooltipClose} from './tooltip-actions-directive';

@NgModule({
  imports: [ CommonModule, OverlayModule, PortalModule ],
  declarations: [ MsTooltipTrigger, MsTooltipTitleContent, MsTooltipClose, MsTooltipContainer, MsTitle ],
  exports: [MsTooltipTrigger, MsTitle, MsTooltipClose ],
  providers: [ MsTooltip, {provide: MS_TOOLTIP_CONTAINER, useValue: MsTooltipContainer} ]
})
export class MsTooltipModule {

}
