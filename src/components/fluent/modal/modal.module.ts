import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {OverlayModule} from "@angular/cdk/overlay";
import {PortalModule} from "@angular/cdk/portal";
import {MsModal} from "./modal";
import {MsModalPortal} from "./modal-portal";
import {MS_MODAL_SCROLL_STRATEGY_PROVIDER} from "./modal-scrool-strategy";
import {MsModalActions, MsModalClose, MsModalContent, MsModalTitle} from "./modal-directives";

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule],
  declarations: [MsModalPortal, MsModalTitle, MsModalContent, MsModalActions, MsModalClose],
  exports: [MsModalPortal, MsModalTitle, MsModalContent, MsModalActions, MsModalClose],
  providers: [MsModal, MS_MODAL_SCROLL_STRATEGY_PROVIDER]
})
export class MsModalModule {

}
