import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MsDialog} from '../../components/fluent/dialog';

@Component({
  templateUrl: 'dialog-example.html'
})
export class DialogExample {
  @ViewChild('templateRef')
  templateRef: TemplateRef<any>;

  constructor(private msDialog: MsDialog) {
  }

  openTemplateDialog() {
    this.msDialog.open(this.templateRef);
  }

  openComponent() {
    this.msDialog.open(DialogComponent);
  }
}


@Component({
  template: `
      <h2 ms-dialog-title>Missing subject</h2>
      <div ms-dialog-content>
          Do you want to send this message without a subject?
      </div>

      <div ms-dialog-actions>
          <button msButton theme="primary">Send</button>
          <button style="margin-left: 16px" msButton theme="standardOutline">Don't send</button>
      </div>
  `
})
export class DialogComponent {

}
