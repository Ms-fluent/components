import {MsSpinner} from './spinner';

export class MsSpinnerCircle {
  private _host: HTMLSpanElement;
  get host(): HTMLSpanElement {
    return this._host;
  }

  constructor(private spinner: MsSpinner) {
    this.createElement();
  }

  private createElement() {
    const host = document.createElement('span');
    host.classList.add('ms-spinner-circle');
    this.spinner.host.appendChild(host);
    this._host = host;
  }
}
