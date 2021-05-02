import {AbstractType, InjectFlags, InjectionToken, Injector, StaticProvider, Type} from '@angular/core';
import {MsTooltipRef} from './tooltip-ref';
import {MsTooltipOptions} from './tooltip-options';
import {MS_TOOLTIP_DATA} from './tooltip-injectors';

export class MsTooltipInjector<V, D> extends Injector {

  constructor(private parentInjector: Injector, private ref: MsTooltipRef<V, D>, private options: MsTooltipOptions) {
    super();
  }

  private providers = new WeakMap<any, any>([
    [MsTooltipRef, this.ref],
    [MsTooltipOptions,  this.options],
    [MS_TOOLTIP_DATA, this.options.data]
  ]);

  get<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue?: T, flags?: InjectFlags): T {
    const value = this.providers.get(token);

    if (typeof value !== 'undefined') {
      return value;
    }

    return this.parentInjector.get<T>(token, notFoundValue);
  }


}
