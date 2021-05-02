import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsTooltip} from './tooltip';
import {MsTooltipTrigger} from './tooltip-trigger';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {MsTooltipContentComponent} from './content-component';
import {MsTooltipContainer} from './tooltip-container';
import {MS_TOOLTIP_CONTAINER} from "./tooltip-injectors";

@NgModule({
  imports: [ CommonModule, OverlayModule, PortalModule ],
  declarations: [ MsTooltipTrigger, MsTooltipContentComponent, MsTooltipContainer ],
  exports: [ MsTooltipTrigger ],
  providers: [ MsTooltip, {provide: MS_TOOLTIP_CONTAINER, useValue: MsTooltipContainer} ]
})
export class MsTooltipModule {

}
