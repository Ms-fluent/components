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

/** Change event object emitted by a MsContextMenuItem. */
export class MsContextMenuItemToggleChange {
  constructor(
    /** The source MsContextMenuItem of the event. */
    public source: MsContextMenuItem,
    /** The new `checked` value of the MsContextMenuItem. */
    public checked: boolean) {
  }
}

let _uniqueId = 0;

@Component({
  templateUrl: 'context-menu-item.html',
  selector: 'ms-context-menu-item, msContextMenuItem, MsContextMenuItem',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-contextMenuItem',
    'role': 'menuItem',
    '[attr.tabindex]': 'disabled? -1 : 0',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[class.ms-checked]': 'checked',
    '[attr.disabled]': 'disabled',
    '[class.ms-disabled]': 'disabled'
  }
})
export class MsContextMenuItem {
  private _uniqueId: string = `ms-context-unique-${_uniqueId++}`;

  _attachedClickEvent: boolean = false;

  @Input()
  ariaLabel: string;

  @Input()
  ariaLabelledby: string;

  @Input()
  icon: string;

  @Input()
  secondaryText: string;

  @Input()
  secondaryIcon: string;

  @Input()
  theme: string;

  @Input()
  disabled: boolean = false;

  @Input()
  value: any;

  @Input()
  key: string = this._uniqueId;

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
  readonly change: EventEmitter<MsContextMenuItemToggleChange> = new EventEmitter<MsContextMenuItemToggleChange>();

  constructor(private _elementRef: ElementRef<HTMLElement>,
              private _changeDetectorRef: ChangeDetectorRef) {
  }


  toggle(): void {
    this.checked = !this.checked;
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
