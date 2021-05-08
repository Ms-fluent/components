import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {Component, DebugElement, Type} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
