import {ChangeDetectionStrategy, Component, HostListener, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MsSuggest} from "./suggest";

@Component({
  selector: 'msSuggestItem, MsSuggestItem, ms-suggest-item',
  templateUrl: 'suggest-item.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ms-suggest-item'
  }
})
export class MsSuggestItem<T> implements OnInit {
  constructor(private suggest: MsSuggest<T>) {
  }

  @Input()
  value: string;

  @Input()
  set key(value: string) {
    if (this.value) {
      this.splitInToken(value);
    }
    this._key = value;
  }

  get key(): string {
    return this._key;
  }

  private _key: string;

  tokens = [];

  ngOnInit(): void {
    this.splitInToken(this.key);
  }

  @HostListener('click')
  fill() {
    this.suggest.input.value = this.value;
    this.suggest.close();
  }

  splitInToken(key: string) {
    this.tokens = [];
    if (this.value && key) {
      const values = this.value.split(key);

      values.forEach((token, i) => {
        if (i % 2 === 1) {
          this.tokens.push(key);
        }
        this.tokens.push(token);
      });
    }

    if (this.tokens.length === 0) {
      this.tokens = [this.value];
    }
  }
}
