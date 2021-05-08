import {ChangeDetectionStrategy, Component, HostListener, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MsSuggest} from './suggest';
import {splitPreserve} from '../../helpers';

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
      this.tokens = splitPreserve(this.value, value, false);
    }
    this._key = value;
  }

  get key(): string {
    return this._key;
  }

  private _key: string;

  tokens: string[] = [];

  ngOnInit(): void {
    if (this.value && this.key) {
      this.tokens = splitPreserve(this.value, this.key, false);
      console.log(this.tokens)
    }
  }

  @HostListener('click')
  fill() {
    this.suggest.input.value = this.value;
    this.suggest.close();
  }
}
