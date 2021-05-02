/** Injection token that can be used to specify default modal options. */
import {InjectionToken} from '@angular/core';
import {MsModalOptions} from './modal-options';

export const MS_MODAL_DEFAULT_OPTIONS =
  new InjectionToken<MsModalOptions>('ms-modal-default-options');

