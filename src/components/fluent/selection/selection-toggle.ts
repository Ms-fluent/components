import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

const _uniqueId = 0;

/** Change event object emitted by a MsToggle. */
export class MsSelectionToggleChange {
  constructor(
    /** The source MatSlideToggle of the event. */
    public source: MsSelectionToggle,
    /** The new `checked` value of the MsToggle. */
    public checked: boolean) {
  }
}

@Component({
  templateUrl: 'selection-toggle.html',
  selector: 'MsSelectionToggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-selection-toggle',
    '[attr.role]': '"switch"',
    '[attr.tabindex]': 'disabled? -1 : 0',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[class.ms-checked]': 'checked',
    '[class.ms-disabled]': 'disabled',

    '(click)': '_click()'
  }
})
export class MsSelectionToggle {
  private _uniqueId: string = `ms-selection-toggle-${_uniqueId}`;
  _attachedEvent: boolean = false;

  @Input()
  disabled: boolean = false;

  @Input()
  ariaLabel: string;

  @Input()
  ariaLabelledby: string;

  @Input()
  key: string = this._uniqueId;

  @Input()
  value: any;

  /** Whether the toggle element is checked or not. */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    value = coerceBooleanProperty(value);
    this._checked = value;
    this._changeDetectorRef.markForCheck();
  }

  private _checked: boolean = false;

  @Output()
  readonly change: EventEmitter<MsSelectionToggleChange> = new EventEmitter<MsSelectionToggleChange>();


  constructor(private _changeDetectorRef: ChangeDetectorRef,
              private _elementRef: ElementRef<HTMLElement>) {
  }


  /** Toggles the checked state of the slide-toggle. */
  toggle(): void {
    this.checked = !this.checked;
  }

  _click() {
    // this.toggle();
    // this._emitChangeEvent();
  }

  private _emitChangeEvent() {
    this.change.emit(new MsSelectionToggleChange(this, this.checked));
  }

  // For test.
  assertIsDisabled(): boolean {
    return this.disabled
      && this.host.classList.contains('ms-disabled')
      && this.host.getAttribute('aria-disabled') === 'true';
  }

  // For test.
  assertIsChecked(): boolean {
    return this.checked
      && this.host.classList.contains('ms-checked')
      && this.host.getAttribute('aria-checked') === 'true';
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
