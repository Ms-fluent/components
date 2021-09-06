import {ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';
import {ChangeDetectionStrategy, Component, DebugElement, Type} from '@angular/core';
import {FormControl, FormsModule, NgModel, ReactiveFormsModule} from '@angular/forms';
import {MsCheckboxModule} from './checkbox.module';
import {MsCheckbox, MsCheckboxChange} from './checkbox';
import {By} from '@angular/platform-browser';

describe('MsCheckbox component', () => {
  let fixture: ComponentFixture<any>;

  function createComponent<T>(componentType: Type<T>, extraDeclarations: Type<any>[] = []) {
    TestBed.configureTestingModule({
      imports: [MsCheckboxModule, FormsModule, ReactiveFormsModule],
      declarations: [componentType, ...extraDeclarations],
    }).compileComponents();

    return TestBed.createComponent<T>(componentType);
  }

  describe('basic behaviors', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxInstance: MsCheckbox;
    let testComponent: SingleCheckbox;

    beforeEach(() => {
      fixture = createComponent(SingleCheckbox);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(MsCheckbox));
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('should add and remove the checked state', () => {
      expect(checkboxInstance.assertChecked()).toBe(false);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(false);
    });

    it('should add and remove indeterminate state', () => {
      expect(checkboxInstance.assertChecked()).toBe(false);
      expect(checkboxInstance.assertIndeterminate()).toBe(false);

      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.assertIndeterminate()).toBe(true);
      expect(checkboxInstance.assertChecked()).toBe(false);

      expect(checkboxInstance.host.getAttribute('aria-checked'))
        .toBe('mixed', 'Expect aria checked to be mixed for indeterminate checkbox');

      testComponent.isIndeterminate = false;
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(false);
      expect(checkboxInstance.assertIndeterminate()).toBe(false);
    });

    it('should set indeterminate to false when input clicked', fakeAsync(() => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.assertIndeterminate()).toBe(true);

      checkboxInstance.host.click();
      fixture.detectChanges();

      // Flush the microtasks because the forms module updates the model state asynchronously.
      flush();

      // The checked property has been updated from the model and now the view needs
      // to reflect the state change.
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(true);
      expect(checkboxInstance.assertIndeterminate()).toBe(false);

      expect(testComponent.isIndeterminate).toBe(false);

      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.assertIndeterminate()).toBe(true);
      expect(checkboxInstance.assertChecked()).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);
      expect(checkboxInstance.host.getAttribute('aria-checked'))
        .toBe('mixed', 'Expect aria checked to be mixed');

      checkboxInstance.host.click();
      fixture.detectChanges();

      // Flush the microtasks because the forms module updates the model state asynchronously.
      flush();

      // The checked property has been updated from the model and now the view needs
      // to reflect the state change.
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(false);
      expect(checkboxInstance.assertIndeterminate()).toBe(false);
      expect(testComponent.isIndeterminate).toBe(false);
    }));


    it('should not set indeterminate to false when checked is set programmatically', () => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.assertIndeterminate()).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      testComponent.isChecked = true;
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(true);
      expect(checkboxInstance.assertIndeterminate()).toBe(true);
      expect(testComponent.isIndeterminate).toBe(true);

      testComponent.isChecked = false;
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(false);
      expect(checkboxInstance.assertIndeterminate()).toBe(true);
    });

    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBe(false);

      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(true);

      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(checkboxInstance.assertChecked()).toBe(false);
    });


    it('should change from indeterminate to checked on click', fakeAsync(() => {
      testComponent.isChecked = false;
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxInstance.indeterminate).toBe(true);

      checkboxInstance.host.click();

      // Flush the microtasks because the indeterminate state will be updated in the next tick.
      flush();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxInstance.indeterminate).toBe(false);

      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(checkboxInstance.indeterminate).toBe(false);

      flush();
    }));

    it('should add and remove disabled state', () => {
      expect(checkboxInstance.assertDisabled()).toBe(false);

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(checkboxInstance.assertDisabled()).toBe(true);

      testComponent.isDisabled = false;
      fixture.detectChanges();

      expect(checkboxInstance.assertDisabled()).toBe(false);
    });


    it('should not toggle `checked` state upon interation while disabled', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();

      checkboxInstance.host.click();
      expect(checkboxInstance.checked).toBe(false);
    });

    it('should overwrite indeterminate state when clicked', fakeAsync(() => {
      testComponent.isIndeterminate = true;
      fixture.detectChanges();

      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxInstance.indeterminate).toBe(false);
    }));

    it('should make the host element a tab stop', () => {
      expect(checkboxInstance.host.tabIndex).toBe(0);
    });

    it('should focus on underlying input element when focus() is called', () => {
      expect(document.activeElement).not.toBe(checkboxInstance.host);

      checkboxInstance.host.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(checkboxInstance.host);
    });
  })

  describe('with change event and no initial value', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: MsCheckbox;
    let testComponent: CheckboxWithChangeEvent;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithChangeEvent);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(MsCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('should emit the event to the change observable', () => {
      const changeSpy = jasmine.createSpy('onChangeObservable');

      checkboxInstance.change.subscribe(changeSpy);

      fixture.detectChanges();
      expect(changeSpy).not.toHaveBeenCalled();

      // When changing the native `checked` property the checkbox will not fire a change event,
      // because the element is not focused and it's not the native behavior of the input element.
      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('with ngModel', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: MsCheckbox;
    let ngModel: NgModel;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithNgModel);

      fixture.componentInstance.isRequired = false;
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(MsCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      ngModel = checkboxDebugElement.injector.get<NgModel>(NgModel);
    });

    it('should be pristine, untouched, and valid initially', () => {
      expect(ngModel.valid).toBe(true);
      expect(ngModel.pristine).toBe(true);
      expect(ngModel.touched).toBe(false);
    });

    it('should have correct control states after interaction', fakeAsync(() => {
      checkboxInstance.host.click();
      fixture.detectChanges();

      // Flush the timeout that is being created whenever a `click` event has been fired by
      // the underlying input.
      flush();

      // After the value change through interaction, the control should be dirty, but remain
      // untouched as long as the focus is still on the underlying input.
      expect(ngModel.pristine).toBe(false);
      expect(ngModel.touched).toBe(false);

      // If the input element loses focus, the control should remain dirty but should
      // also turn touched.
      checkboxInstance.host.blur();
      fixture.detectChanges();
      flushMicrotasks();

      expect(ngModel.pristine).toBe(false);
      expect(ngModel.touched).toBe(true);
    }));

    it('should mark the element as touched on blur when inside an OnPush parent', fakeAsync(() => {
      fixture.destroy();
      TestBed.resetTestingModule();
      fixture = createComponent(CheckboxWithNgModelAndOnPush);
      fixture.detectChanges();
      checkboxDebugElement = fixture.debugElement.query(By.directive(MsCheckbox))!;
      checkboxNativeElement = checkboxDebugElement.nativeElement;
      checkboxInstance = checkboxDebugElement.componentInstance;
      ngModel = checkboxDebugElement.injector.get<NgModel>(NgModel);

      checkboxInstance.host.click();
      fixture.detectChanges();
      flush();

      expect(checkboxInstance.host.classList).not.toContain('ng-touched');

      checkboxInstance.host.blur();
      fixture.detectChanges();
      flushMicrotasks();
      fixture.detectChanges();

      expect(checkboxNativeElement.classList).toContain('ng-touched');
    }));


    it('should not throw an error when disabling while focused', fakeAsync(() => {
      expect(() => {
        // Focus the input element because after disabling, the `blur` event should automatically
        // fire and not result in a changed after checked exception. Related: #12323
        checkboxInstance.host.focus();

        // Flush the two nested timeouts from the FocusMonitor that are being created on `focus`.
        flush();

        checkboxInstance.disabled = true;
        fixture.detectChanges();
        flushMicrotasks();
      }).not.toThrow();
    }));

    it('should toggle checked state on click', () => {
      expect(checkboxInstance.checked).toBe(false);

      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);

      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
    });

    it('should validate with RequiredTrue validator', () => {
      fixture.componentInstance.isRequired = true;
      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
      expect(ngModel.valid).toBe(true);

      checkboxInstance.host.click();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(false);
      expect(ngModel.valid).toBe(false);
    });
  });


  describe('with form control', () => {
    let checkboxDebugElement: DebugElement;
    let checkboxInstance: MsCheckbox;
    let testComponent: CheckboxWithFormControl;

    beforeEach(() => {
      fixture = createComponent(CheckboxWithFormControl);
      fixture.detectChanges();

      checkboxDebugElement = fixture.debugElement.query(By.directive(MsCheckbox))!;
      checkboxInstance = checkboxDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('should toggle the disabled state', () => {
      expect(checkboxInstance.disabled).toBe(false);

      testComponent.formControl.disable();
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(true);

      testComponent.formControl.enable();
      fixture.detectChanges();

      expect(checkboxInstance.disabled).toBe(false);
    });
  });
});


/** Simple component for testing a single checkbox. */
@Component({
  template: `
      <div (click)="parentElementClicked = true" (keyup)="parentElementKeyedUp = true">
          <MsCheckbox
                  [id]="checkboxId"
                  [required]="isRequired"
                  [checked]="isChecked"
                  [(indeterminate)]="isIndeterminate"
                  [disabled]="isDisabled"
                  [value]="checkboxValue"
                  (click)="onCheckboxClick($event)"
                  (change)="onCheckboxChange($event)">
              Simple checkbox
          </MsCheckbox>
      </div>`
})
class SingleCheckbox {
  isChecked: boolean = false;
  isRequired: boolean = false;
  isIndeterminate: boolean = false;
  isDisabled: boolean = false;
  parentElementClicked: boolean = false;
  parentElementKeyedUp: boolean = false;
  checkboxId: string | null = 'simple-check';
  checkboxValue: string = 'single_checkbox';

  onCheckboxClick: (event?: Event) => void = () => {
  };
  onCheckboxChange: (event?: MsCheckboxChange) => void = () => {
  };
}

/** Simple test component with change event */
@Component({
  template: `
      <ms-checkbox (change)="lastEvent = $event"></ms-checkbox>`
})
class CheckboxWithChangeEvent {
  lastEvent: MsCheckboxChange;
}

/** Simple component for testing an MatCheckbox with required ngModel. */
@Component({
  template: `
      <ms-checkbox [required]="isRequired" [(ngModel)]="isGood"></ms-checkbox>`,
})
class CheckboxWithNgModel {
  isGood: boolean = false;
  isRequired: boolean = true;
}

@Component({
  template: `
      <ms-checkbox [required]="isRequired" [(ngModel)]="isGood">Be good</ms-checkbox>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class CheckboxWithNgModelAndOnPush extends CheckboxWithNgModel {
}

/** Test component with reactive forms */
@Component({
  template: `
      <ms-checkbox [formControl]="formControl"></ms-checkbox>`
})
class CheckboxWithFormControl {
  formControl = new FormControl();
}
