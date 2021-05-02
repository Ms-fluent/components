import {Component} from '@angular/core';
import {MsTooltip} from '../../components/fluent/tooltip';
import {ComponentType} from '@angular/cdk/overlay';

@Component({
  templateUrl: 'tooltip-example.html'
})
export class TooltipExample {
  component: ComponentType<TooltipContentComponent> = TooltipContentComponent;

  constructor(public _tooltip: MsTooltip) {
  }
}


@Component({
  template: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. <br>
  Cumque dicta dolorem est officiis vitae. A aliquid amet,<br>
  atque culpa ea eos ipsam laborum porro quisquam,<br>
  reprehenderit velit veritatis, voluptatum. Libero!`
})
export class TooltipContentComponent {

}
