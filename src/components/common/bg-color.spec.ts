import {Component, DebugElement} from '@angular/core';
import {msColor} from '../core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MsCommonModule} from './common.module';
import {By} from '@angular/platform-browser';
import {MsBgColor} from './bg-color';

describe('bgColor', () => {
  let fixture: ComponentFixture<MsBgColorTestComponent>;
  let element: HTMLElement;
  let debugElement: DebugElement;
  let testComponent: MsBgColorTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MsCommonModule],
      declarations: [MsBgColorTestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MsBgColorTestComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(MsBgColor));
    element = fixture.debugElement.query(By.css('span')).nativeElement;
  });

  it('should have the correct bg color class', () => {
    fixture.detectChanges();
    expect(element.className).toBe('ms-bgColor-red');
  });

  it('should have just one bg color class when color change', () => {
    testComponent.color = 'green';
    fixture.detectChanges();

    expect(element.className).toBe('ms-bgColor-green');
  });

  it('should remove bg color class when color is null or undefined', () => {
    testComponent.color = null;
    fixture.detectChanges();

    expect(element.className).toBe('');
  });
});

@Component({
  template: `<span #element [msBgColor]="color"></span>`
})
class MsBgColorTestComponent {
  color: msColor = 'red';
}
