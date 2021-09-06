import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MsPivotContent} from '../pivot-content';

let _uniqueId = 0;

@Component({
  templateUrl: 'pivot-label.html',
  selector: 'ms-pivotLabel, msPivotLabel, MsPivotLabel',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ms-pivotLabel',
    '[class.ms-active]': 'isActive',
    '[class.ms-disabled]': 'disabled',
    '[attr.tabindex]': 'tabindex',
    '[attr.aria-selected]': 'isActive',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.id]': 'id'
  }
})
export class MsPivotLabel {
  _uniqueId = `ms-pivotLabel-${_uniqueId++}`;
  _index: number;

  _contentRef: ComponentRef<MsPivotContent>;

  @Input()
  id: string = this._uniqueId;

  @Input()
  icon: string;

  @Input()
  secondaryIcon: string;

  /** Aria label for the tab. */
  @Input('aria-label')
  ariaLabel: string;

  /**
   * Reference to the element that the tab is labelled by. Will be cleared if aria-label is set at the same time.
   */
  @Input('aria-labelledby')
  ariaLabelledby: string;


  @Input()
  tabindex: number = 0;


  /** Whether the component is disabled. */
  @Input()
  disabled: boolean;

  get isHover(): boolean {
    return this._isHover;
  }

  private _isHover: boolean = false;

  @ViewChild('pivotLabelLayout')
  labelLayout: ElementRef<HTMLElement>;

  /** The position of the tab. */
  get index(): number {
    return this._index;
  }

  /** Whether the tab is currently active. */
  get isActive(): boolean {
    return this._isActive;
  }

  _isActive: boolean = false;

  constructor(private _elementRef: ElementRef<HTMLElement>, private _changeDetectorRef: ChangeDetectorRef) {

  }

  @HostListener('mouseenter', ['$event'])
  mouseEnterEventListener(event: MouseEvent) {
    this._isHover = true;
  }

  @HostListener('mouseleave', ['$event'])
  mouseLeaveEventListener(event: MouseEvent) {
    this._isHover = false;
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  get contentHost(): HTMLElement {
    return this._contentRef.instance.host;
  }

  get layoutHost(): HTMLElement {
    return this.labelLayout.nativeElement;
  }

  markForCheck() {
    this._changeDetectorRef.markForCheck();
  }
}
