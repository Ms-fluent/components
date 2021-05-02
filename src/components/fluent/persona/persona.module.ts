import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsIconPersona} from './icon-persona';
import {MsTextPersona} from './text-persona';
import {MsImagePersona} from './image-persona';
import {MsPersonaStatus} from './persona-status';

@NgModule({
  imports: [CommonModule],
  declarations: [MsIconPersona, MsTextPersona, MsImagePersona, MsPersonaStatus],
  exports: [MsIconPersona, MsTextPersona, MsImagePersona, MsPersonaStatus]
})
export class MsPersonaModule {
}
