import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  isDevMode,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {msfSelectAnimations} from './select-animations';
import {MS_SELECT_OPTION_PARENT_COMPONENT, MsSelectOption, MsSelectOptionParentComponent} from './select-option';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CdkConnectedOverlay} from '@angular/cdk/overlay';
import {MsfSelectTemplate, MsfSelectTemplateContext} from './select-template';
import {MsSelectOptionGroup} from './select-option-group';
import {take} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {CanDisable, CanDisableCtor, mixinDisabled} from '../../core/common-behaviors';

/** Change event object that is emitted when the select value has changed. */
export class MsSelectChange {
  constructor(
    /** Reference to the select that emitted the change event. */
    public source: MsSelect,
    /** Current value of the select that emitted the event. */
    public value: any) {
  }
}

export class MsSelectBase {
  constructor(public _elementRef: ElementRef<HTMLElement>) {
  }
}

const _MsSelectMixinBase: CanDisableCtor & typeof MsSelectBase =
  mixinDisabled(MsSelectBase);

let uniqueId = 0;

/**
 * Provider Expression that allows Checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const SELECT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MsSelect),
  multi: true
};


@Component({
  selector: 'MsSelect, ms-select',
  templateUrl: 'select.html',
  styleUrls: ['../../styles/components/select.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    msfSelectAnimations.transformPanelWrap,
    msfSelectAnimations.transformPanel
  ],
  providers: [
    SELECT_CONTROL_VALUE_ACCESSOR,
    {provide: MS_SELECT_OPTION_PARENT_COMPONENT, useExisting: MsSelect}
  ],
  host: {
    'class': 'ms-select',
    'role': 'listbox',
    '[attr.id]': 'id',
    '[attr.tabindex]': '0'
  },
  // tslint:disable-next-line:no-inputs-metadata-property
  inputs: ['disabled', 'depth', 'tabindex']
})
export class MsSelect extends _MsSelectMixinBase implements CanDisable, OnDestroy,
  AfterViewInit, AfterContentInit, MsSelectOptionParentComponent, ControlValueAccessor {

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;


  public readonly _uid = `msf-select-${uniqueId++}`;

  _elementWidth: number;


  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {
  };

  /** `View -> model callback called when select has been touched` */
  _onTouched = () => {
  };

  /** Whether the select is focused. */
  get focused(): boolean {
    return this._focused || this._panelOpen;
  }

  private _focused = false;


  @Input()
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value || this._uid;
  }

  private _id: string;


  /** Placeholder to be shown if no value has been selected. */
  @Input()
  placeholder: string = 'Select a value';


  /** Whether the user should be allowed to select multiple options. */
  @Input()
  multiple: boolean = false;

  /**
   * Function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  @Input()
  get compareWith() {
    return this._compareWith;
  }

  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw new Error('`compareWith` must be a function.');
    }
    this._compareWith = fn;
  }

  /** Comparison function to specify which option is displayed. Defaults to object equality. */
  private _compareWith = (o1: any, o2: any) => o1 === o2;

  private _valueOnInit: any;

  private _isInitialized: boolean = false;

  private _selectionModel: SelectionModel<MsSelectOption>;

  /** Value of the select control. */
  @Input()
  set value(newValue: any | any[]) {
    if (this._isInitialized) {
      this._setSelectionByValue(newValue);
    } else {
      this._valueOnInit = newValue;
    }
  }

  get value(): any {
    if (this.values.length > 0) {
      return this.values[0];
    }
  }

  get values(): any[] {
    return this._selectionModel.selected.map(o => o.value);
  }


  /** Event emitted when the selected value has been changed by the user. */
  @Output()
  selectionchange: EventEmitter<MsSelectChange> = new EventEmitter<MsSelectChange>();


  @ViewChild(CdkConnectedOverlay, {static: false}) overlayDir: CdkConnectedOverlay;

  /** The default template used to display select values */
  @ViewChild('defaultTemplate', {read: TemplateRef})
  defaultTemplate: TemplateRef<any>;

  /** The template provided by user to display selected values. */
  @ContentChild(forwardRef(() => MsfSelectTemplate))
  contentTemplate: MsfSelectTemplate;


  /** The container used to render values template */
  @ViewChild('contentView', {read: ViewContainerRef})
  contentView: ViewContainerRef;

  /** Values display elements. */
  @ViewChild('content')
  contentLayout: ElementRef<HTMLElement>;

  /** Panel containing the select options. */
  @ViewChild('panel', {static: false}) panel: ElementRef;


  @ContentChildren(forwardRef(() => MsSelectOption), {descendants: true})
  options: QueryList<MsSelectOption>;

  /** All of the defined groups of options. */
  @ContentChildren(MsSelectOptionGroup)
  optionGroups: QueryList<MsSelectOptionGroup>;


  constructor(public _elementRef: ElementRef<HTMLElement>, private _zone: NgZone,
              private _changeDetector: ChangeDetectorRef) {
    super(_elementRef);
  }


  get openPanel(): boolean {
    return this._panelOpen;
  }

  ngAfterContentInit(): void {
    this._isInitialized = true;
    this._selectionModel = new SelectionModel<MsSelectOption>(this.multiple);

    if (!this.empty) {
      this._onChange(this.value);
    }


    Promise.resolve().then(() => {
      this._onTouched();
      this._changeDetector.markForCheck();
    });


    this._attachOptionEvents();
    this.options.changes.subscribe(() => {
      this._attachOptionEvents();
      this._resetValue();
    });
  }

  _attachOptionEvents() {

    this.options.forEach(option => {
      if (option.onSelectionChange.observers.length === 0) {
        option.onSelectionChange.subscribe(() => {
          this._optionEventFn(option);
        });
      }
    });
  }

  _resetValue() {
    const selectedOptions = this._selectionModel.selected;
    for(const selectedOption of selectedOptions) {
      if( !this.options.find(option => option.value === selectedOption)) {
        this._selectionModel.deselect(selectedOption);
      }
    }

    this.updateViewValue();
  }

  _optionEventFn(option: MsSelectOption) {
    if (this.multiple) {
      if (option.selected) {
        this._selectionModel.select(option);
      } else {
        this._selectionModel.deselect(option);
      }
      this._changeViewValues(this.values);

    } else if (!this._selectionModel.isSelected(option)) {
      this._deselectAll();
      this._selectionModel.select(option);
      this._changeViewValue(this.value);
      this.close();
    }

    this._emitChangeValue();
  }

  _deselectAll() {
    this._selectionModel.selected.forEach(o => o.deselect());
    this._selectionModel.clear();
  }


  private _initializedView: boolean = false;

  ngAfterViewInit(): void {
    this._initializedView = true;
    this._elementWidth = this._elementRef.nativeElement.offsetWidth;
    this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this._selectValue(this._valueOnInit);
      this._changeDetector.detectChanges();
    });
  }

  _emitChangeValue() {
    if (this.multiple) {
      this._onChange(this.values);
      this.selectionchange.emit({source: this, value: this.values});
    } else {
      this._onChange(this.value);
      this.selectionchange.emit({source: this, value: this.value});
    }
  }

  /**
   * Finds and selects and option based on its value.
   * @returns Option that has the corresponding value.
   */
  private _selectValue(value: any): MsSelectOption | undefined {
    const correspondingOption = this.options.find((option: MsSelectOption) => {
      try {
        // Treat null as a special reset value.
        return option.value != null && this._compareWith(option.value, value);
      } catch (error) {
        if (isDevMode()) {
          // Notify developers of errors in their comparator.
          console.warn(error);
        }
        return false;
      }
    });

    if (correspondingOption) {
      correspondingOption.select();
    }

    return correspondingOption;
  }


  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  private _setSelectionByValue(value: any | any[]): void {
    if (this.multiple && value) {
      if (!Array.isArray(value)) {
        value = [value];
      }

      value.forEach((currentValue: any) => this._selectValue(currentValue));


    } else {
      this._selectValue(value);

    }

    this._changeDetector.markForCheck();
  }

  private _destroy = new EventEmitter();

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }


  _changeViewValue(value: any) {
    if (this._initializedView) {
      this.contentView.clear();
      this.contentView.createEmbeddedView(this.template, {value});
      this._changeDetector.markForCheck();
    }
  }


  _changeViewValues(values: any[]) {
    if (this._initializedView) {
      this.contentView.clear();
      this.contentView.createEmbeddedView(this.template, {values});
      this._changeDetector.markForCheck();
    }
  }

  updateViewValue() {
    if(this.multiple) {
      this._changeViewValues(this.values);
    }else {
      this._changeViewValue(this.value);
    }
  }


  /** Toggles the overlay panel open or closed. */
  toggle(): void {
    this._panelOpen ? this.close() : this.open();
  }

  open() {

    this._panelOpen = true;
    this._changeDetector.markForCheck();
  }


  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._changeDetector.markForCheck();
      this._onTouched();
    }
  }

  /**
   * Sets the select's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: any): void {
    if (this.options) {
      this._setSelectionByValue(value);
    }
  }


  /**
   * Saves a callback function to be invoked when the select's value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }


  /**
   * Saves a callback function to be invoked when the select is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /**
   * Disables the select. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }


  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }


  get template(): TemplateRef<MsfSelectTemplateContext> {
    if (this.contentTemplate) {
      return this.contentTemplate.template;
    }
    return this.defaultTemplate;
  }


  /** The value displayed in the trigger. */
  get triggerValue(): string {
    if (this.empty) {
      return '';
    }

    if (this.multiple) {
      const selectedOptions = this.selection.map(option => option.viewValue);


      // TODO: delimiter should be configurable for proper localization.
      return selectedOptions.join(', ');
    }

    return this.selection[0].viewValue;
  }

  get showValue(): boolean {
    return this.multiple ? this.values.length > 0 : !!this.value;
  }

  /** Whether the select has a value. */
  get empty(): boolean {
    return this._selectionModel.isEmpty();
  }

  get selection(): MsSelectOption[] {
    return this._selectionModel.selected;
  }
}

