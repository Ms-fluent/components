import {MsLoader} from './loader';

export class MsLoaderCircle {
  private _host: HTMLSpanElement;
  get host(): HTMLSpanElement {
    return this._host;
  }

  constructor(private loader: MsLoader) {
    this.createElement();
  }

  private createElement() {
    const host = document.createElement('span');
    host.classList.add('ms-loader-circle');
    this.loader.host.appendChild(host);
    this._host = host;
  }
}
