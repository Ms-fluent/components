import {NgModule} from '@angular/core';
import {MsSuggest} from './suggest';
import {MsSuggestItem} from './suggest-item';
import {MsSuggestTrigger} from './suggest-trigger';
import {MsSuggestOrigin} from './suggest-origin';
import {MsSuggestPanelDef} from './suggest-panel-def';
import {MsSuggestItemDef} from './suggest-item-def';
import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [MsSuggest, MsSuggestItem, MsSuggestTrigger, MsSuggestOrigin, MsSuggestPanelDef, MsSuggestItemDef],
  exports: [MsSuggest, MsSuggestItem, MsSuggestTrigger, MsSuggestOrigin, MsSuggestPanelDef, MsSuggestItemDef]
})
export class MsSuggestModule {

}
