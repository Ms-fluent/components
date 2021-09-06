/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {NgModule} from '@angular/core';
import {MS_DIALOG_SCROLL_STRATEGY_PROVIDER, MsDialog} from './dialog';
import {MsDialogContainer} from './dialog-container';
import {
  MsDialogActions,
  MsDialogClose,
  MsDialogContent,
  MsDialogTitle,
} from './dialog-content-directives';


@NgModule({
  imports: [
    OverlayModule,
    PortalModule,
  ],
  exports: [
    MsDialogContainer,
    MsDialogClose,
    MsDialogTitle,
    MsDialogContent,
    MsDialogActions,
  ],
  declarations: [
    MsDialogContainer,
    MsDialogClose,
    MsDialogTitle,
    MsDialogActions,
    MsDialogContent,
  ],
  providers: [
    MsDialog,
    MS_DIALOG_SCROLL_STRATEGY_PROVIDER,
  ],
  entryComponents: [MsDialogContainer],
})
export class MsDialogModule {}
