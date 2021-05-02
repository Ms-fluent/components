import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, Type} from '@angular/core';
import {MsAlertModule} from './alert.module';
import {By} from '@angular/platform-browser';
import {MsAlert} from './alert';

describe('Alert component', () => {
  let fixture: ComponentFixture<any>;

  function createComponent<T>(componentType: Type<T>, extraDeclarations: Type<any>[] = []) {
    TestBed.configureTestingModule({
      imports: [MsAlertModule],
      declarations: [componentType, ...extraDeclarations],
    }).compileComponents();

    return TestBed.createComponent<T>(componentType);
  }

  let alertDebugElement: DebugElement;
  let componentInstance: SimpleAlert;
  let alertInstance: MsAlert;
  let alertElement: HTMLElement;

  beforeEach(() => {
    fixture = createComponent(SimpleAlert);
    fixture.detectChanges();

    componentInstance = fixture.debugElement.componentInstance;
    alertDebugElement = fixture.debugElement.query(By.directive(MsAlert));
    alertInstance = alertDebugElement.componentInstance;
    alertElement = alertDebugElement.nativeElement;

  });

  it('should icon element has ms icon className', () => {
    expect(alertInstance.iconElementRef.nativeElement.classList.contains('ms-Icon')).toBeTrue();
  });

  it('should icon element has icon class', () => {
    componentInstance.icon = 'Info';
    fixture.detectChanges();

    expect(alertInstance.iconElementRef.nativeElement.classList.contains('ms-Icon--Info')).toBeTrue();
  });
});


@Component({
  template: `<MsAlert [icon]="icon"> alert text content</MsAlert>`
})
export class SimpleAlert {
  icon: string = 'Add';
}


@Component({
  template:  `<MsAlert> alert text content</MsAlert>`
})
export class AlertWithoutTitleAndFooter {
}
