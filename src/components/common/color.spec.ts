import {Component, DebugElement} from '@angular/core';
import {msColor} from '../core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MsCommonModule} from './common.module';
import {By} from '@angular/platform-browser';
import {MsColor} from './color';

describe('ms color', () => {
  let fixture: ComponentFixture<MsColorTestComponent>;
  let element: HTMLElement;
  let debugElement: DebugElement;
  let testComponent: MsColorTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MsCommonModule],
      declarations: [MsColorTestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MsColorTestComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(MsColor));
    element = fixture.debugElement.query(By.css('span')).nativeElement;
  });

  it('should have the correct font color class', () => {
    fixture.detectChanges();
    expect(element.className).toBe('ms-fontColor-red');
  });

  it('should have just one font color class when color change', () => {
    testComponent.color = 'green';
    fixture.detectChanges();

    expect(element.className).toBe('ms-fontColor-green');
  });

  it('should remove font color class when color is null or undefined', () => {
    testComponent.color = null;
    fixture.detectChanges();

    expect(element.className).toBe('');
  });
});

@Component({
  template: `<span #element [msColor]="color"></span>`
})
class MsColorTestComponent {
  color: msColor = 'red';
}
