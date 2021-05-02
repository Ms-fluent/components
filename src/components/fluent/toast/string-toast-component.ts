import {Component} from '@angular/core';

@Component({
  template: `<div>Message: {{message}}</div><div><button msToastClose>Fermer</button></div>`
})
export class StringToastComponent {
  message: string;
}
