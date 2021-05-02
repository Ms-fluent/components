import {Component, DebugElement} from '@angular/core';
import {msColor} from '../core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MsCommonModule} from './common.module';
import {By} from '@angular/platform-browser';
import {MsBorderColor} from './border-color';

describe('borderColor', () => {
  let fixture: ComponentFixture<MsBorderColorTestComponent>;
  let element: HTMLElement;
  let debugElement: DebugElement;
  let testComponent: MsBorderColorTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MsCommonModule],
      declarations: [MsBorderColorTestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MsBorderColorTestComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(MsBorderColor));
    element = fixture.debugElement.query(By.css('span')).nativeElement;
  });

  it('should have the correct border color class', () => {
    fixture.detectChanges();
    expect(element.className).toBe('ms-borderColor-red');
  });

  it('should have just one border color class when color change', () => {
    testComponent.color = 'green';
    fixture.detectChanges();

    expect(element.className).toBe('ms-borderColor-green');
  });

  it('should remove border color class when color is null or undefined', () => {
    testComponent.color = null;
    fixture.detectChanges();

    expect(element.className).toBe('');
  });
});

@Component({
  template: `<span #element [msBorderColor]="color"></span>`
})
class MsBorderColorTestComponent {
  color: msColor = 'red';
}
