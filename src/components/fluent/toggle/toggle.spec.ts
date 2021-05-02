import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MsToggle, MsToggleChange} from './toggle';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {MsToggleModule} from './toggle.module';
import {MsLabel, MsLabelModule} from '../label';
import {MutationObserverFactory} from '@angular/cdk/observers';
import {By} from '@angular/platform-browser';


describe('MsToggle without forms', () => {
  let mutationObserverCallbacks: Function[];
  const flushMutationObserver = () => mutationObserverCallbacks.forEach(callback => callback());


  beforeEach(fakeAsync(() => {
    mutationObserverCallbacks = [];
    TestBed.configureTestingModule({
      imports: [MsToggleModule, MsLabelModule],
      declarations: [
        ToggleBasic,
        ToggleWithTabindexAttr,
        ToggleWithoutLabel,
        ToggleProjectedLabel,
        ToggleWithStaticAriaAttributes,
      ],
      providers: [
        {
          provide: MutationObserverFactory,
          useValue: {
            create: (callback: () => void) => {
              mutationObserverCallbacks.push(callback);
              return {
                observe: () => {
                },
                disconnect: () => {
                }
              };
            }
          }
        }
      ]
    });

    TestBed.compileComponents();
  }));

  describe('Basic behaviors', () => {
    let fixture: ComponentFixture<any>;

    let testComponent: ToggleBasic;
    let toggle: MsToggle;
    let toggleElement: HTMLElement;
    let label: MsLabel;
    let labelElement: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(ToggleBasic);
      // Enable jasmine spies on event functions, which may trigger at initialization
      // of the toggle component.
      spyOn(fixture.debugElement.componentInstance, 'onToggleChange').and.callThrough();
      spyOn(fixture.debugElement.componentInstance, 'onToggleClick').and.callThrough();

      // Initialize the slide-toggle component, by triggering the first change detection cycle.
      fixture.detectChanges();


      const toggleDebug = fixture.debugElement.query(By.css('ms-toggle'));

      testComponent = fixture.debugElement.componentInstance;
      toggle = toggleDebug.componentInstance;
      toggleElement = toggleDebug.nativeElement;
      label = fixture.debugElement.query(By.css('MsLabel'))!.componentInstance;
      labelElement = label.host;
    }));


    it('should correctly update the disabled property', () => {
      expect(toggle.disabled).toBeFalsy();
      expect(toggle.host.classList.contains('ms-disabled')).toBeFalsy();

      testComponent.isDisabled = true;
      fixture.detectChanges();

      expect(toggle.disabled).toBeTruthy();
      expect(toggle.host.classList.contains('ms-disabled')).toBeTruthy();
    });


    it('should correctly update the checked property', () => {
      expect(toggle.checked).toBeFalsy();
      expect(toggle.host.getAttribute('aria-checked')).toBe('false');

      testComponent.toggleChecked = true;
      fixture.detectChanges();

      expect(toggle.checked).toBeTruthy();
      expect(toggle.host.getAttribute('aria-checked')).toBe('true');
    });


    it('should set the toggle to checked on click', () => {
      expect(toggle.assertIsChecked()).toBeFalsy();

      labelElement.click();
      fixture.detectChanges();

      expect(toggle.host.classList).toContain('ms-checked');
      expect(toggle.checked).toBe(true);
      expect(toggle.host.getAttribute('aria-checked')).toBe('true');
    });


    it('should not trigger the click event multiple times', () => {
      // By default, when clicking on a label element, a generated click will be dispatched
      // on the associated input element.
      // Since we're using a label element and a visual hidden input, this behavior can led
      // to an issue, where the click events on the slide-toggle are getting executed twice.

      expect(toggle.checked).toBe(false);
      expect(toggleElement.classList).not.toContain('ms-checked');

      labelElement.click();
      fixture.detectChanges();

      expect(toggleElement.classList).toContain('ms-checked');
      expect(toggle.checked).toBe(true);
      expect(testComponent.onToggleClick).toHaveBeenCalledTimes(1);
    });

    it('should trigger the change event properly', () => {
      expect(toggle.assertIsDisabled()).toBe(false);
      expect(toggle.assertIsChecked()).toBe(false);

      labelElement.click();
      fixture.detectChanges();

      expect(toggle.checked).toBe(true);
      expect(toggleElement.classList).toContain('ms-checked');
      expect(testComponent.onToggleChange).toHaveBeenCalledTimes(1);
    });


    it('should not trigger the change event by changing the native value', fakeAsync(() => {
      expect(toggle.assertIsDisabled()).toBe(false);
      expect(toggle.assertIsChecked()).toBe(false);

      testComponent.toggleChecked = true;
      fixture.detectChanges();

      expect(toggle.checked).toBe(true);
      expect(toggleElement.classList).toContain('ms-checked');
      tick();

      expect(testComponent.onToggleChange).not.toHaveBeenCalled();
    }));

    it('should not trigger the change event on initialization', fakeAsync(() => {
      expect(toggle.assertIsDisabled()).toBe(false);
      expect(toggle.assertIsChecked()).toBe(false);

      testComponent.toggleChecked = true;
      fixture.detectChanges();

      expect(toggle.assertIsChecked()).toBe(true);
      tick();

      expect(testComponent.onToggleChange).not.toHaveBeenCalled();
    }));


    it('should emit the new values properly', fakeAsync(() => {
      labelElement.click();
      fixture.detectChanges();
      tick();

      // We're checking the arguments type / emitted value to be a boolean, because sometimes the
      // emitted value can be a DOM Event, which is not valid.
      // See angular/angular#4059
      expect(testComponent.lastEvent.checked).toBe(true);
    }));

    it('should support subscription on the change observable', fakeAsync(() => {
      const spy = jasmine.createSpy('change spy');
      const subscription = toggle.change.subscribe(spy);

      labelElement.click();
      fixture.detectChanges();
      tick();

      expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({checked: true}));
      subscription.unsubscribe();
    }));

    it('should forward the required attribute', () => {
      testComponent.isRequired = true;
      fixture.detectChanges();

      expect(toggle.required).toBe(true);

      testComponent.isRequired = false;
      fixture.detectChanges();

      expect(toggle.required).toBe(false);
    });


    it('should set a element class if labelPosition is set to before', () => {
      expect(toggleElement.classList).not.toContain('ms-toggle-label-before');

      testComponent.labelPosition = 'before';
      fixture.detectChanges();

      expect(toggleElement.classList).toContain('ms-toggle-label-before');
    });
  });

  describe('custom template', () => {
    it('should not trigger the change event on initialization', fakeAsync(() => {
      const fixture = TestBed.createComponent(ToggleBasic);

      fixture.componentInstance.toggleChecked = true;
      fixture.detectChanges();

      expect(fixture.componentInstance.lastEvent).toBeUndefined();
    }));
  });
});

@Component({
  template: `
      <ms-toggle [required]="isRequired"
                 [disabled]="isDisabled"
                 [id]="toggleId"
                 [checked]="toggleChecked"
                 [aria-label]="toggleLabel"
                 [aria-labelledby]="toggleLabelledBy"
                 [tabIndex]="toggleTabindex"
                 [labelPosition]="labelPosition"
                 (change)="onToggleChange($event)"
                 (click)="onToggleClick($event)">
          <MsLabel>Test Slide Toggle</MsLabel>
      </ms-toggle>`,
})
class ToggleBasic {
  isDisabled: boolean = false;
  isRequired: boolean = false;
  toggleChecked: boolean = false;
  toggleId: string | null;
  toggleLabel: string | null;
  toggleLabelledBy: string | null;
  toggleTabindex: number;
  lastEvent: MsToggleChange;
  labelPosition: 'before' | 'after';
  toggleTriggered: number = 0;

  onToggleClick: (event?: Event) => void = () => {
  };
  onToggleChange = (event: MsToggleChange) => this.lastEvent = event;
  onToggleChangeFunc = () => this.toggleTriggered++;
}

@Component({
  template: `
      <form ngNativeValidate (ngSubmit)="isSubmitted = true">
          <ms-toggle name="slide" ngModel [required]="isRequired">Required</ms-toggle>
          <button type="submit"></button>
      </form>`
})
class ToggleWithForm {
  isSubmitted: boolean = false;
  isRequired: boolean = false;
}

@Component({
  template: `
      <ms-toggle [(ngModel)]="modelValue"></ms-toggle>`
})
class ToggleWithModel {
  modelValue = false;
}

@Component({
  template: `
      <ms-toggle [formControl]="formControl">
          <span>Test Slide Toggle</span>
      </ms-toggle>`,
})
class ToggleWithFormControl {
  formControl = new FormControl();
}

@Component({
  template: `
      <ms-toggle tabindex="5" [disabled]="disabled"></ms-toggle>`
})
class ToggleWithTabindexAttr {
  disabled = false;
}

@Component({
  template: `
      <ms-toggle>{{label}}</ms-toggle>`
})
class ToggleWithoutLabel {
  label: string;
}

@Component({
  template: `
      <ms-toggle [(ngModel)]="checked" (change)="onChange()"></ms-toggle>`
})
class ToggleWithModelAndChangeEvent {
  checked: boolean;
  onChange: () => void = () => {
  };
}

@Component({
  template: `
      <ms-toggle>
          <MsLabel>text</MsLabel>
      </ms-toggle>`
})
class ToggleProjectedLabel {
}


@Component({
  template: `
      <ms-toggle aria-label="Slide toggle" aria-labelledby="something"></ms-toggle>
  `
})
class ToggleWithStaticAriaAttributes {
}
