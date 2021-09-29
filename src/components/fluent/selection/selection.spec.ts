import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild} from '@angular/core';
import {MsLabelModule, MsSelection, MsSelectionModule} from '../..';
import {ELEMENT_DATA, PeriodicElement} from '../table/test-element-data';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

describe('Selection component', () => {
  let fixture: ComponentFixture<SelectionSpecComponent>;
  let component: SelectionSpecComponent;

  let selectionInstance: MsSelection<PeriodicElement>;
  let selectionDebugElement: DebugElement;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectionSpecComponent],
      imports: [MsSelectionModule, MsLabelModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionSpecComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
    selectionDebugElement = fixture.debugElement.query(By.directive(MsSelection));
    selectionInstance = selectionDebugElement.componentInstance;

    spyOn(selectionInstance.valuesChange, 'emit');
  });

  it('Check initial state', () => {
    fixture.detectChanges();
    expect(selectionInstance._toggleChildren.length).toBe(10);
    expect(selectionInstance.values).toEqual([]);
    expect(selectionInstance.toggleChildren.length).toBe(component.items.length);
    expect(selectionInstance.value).toBeUndefined();
    expect(selectionInstance.isAllSelected).toBeFalse();
    expect(selectionInstance.selectedIndexes).toEqual([]);
    expect(selectionInstance.selectedKeys).toEqual([]);
  });

  it('Simple Select item', () => {
    const item = selectionInstance.toggleChildren[0];
    selectionInstance.selectItem(item);
    fixture.detectChanges();

    expect(item.checked);
    expect(selectionInstance.values).toEqual([item.value]);
    expect(selectionInstance.selectedKeys).toEqual([item.key]);
    expect(selectionInstance.selectedIndexes).toEqual([0]);

    expect(component.values).toEqual([item.value])
  });
});


@Component({
  template: `
      <MsSelection [(values)]="values">
          <div *ngFor="let item of items">
              <MsSelectionToggle [id]="item.id.toString()" [value]="item"></MsSelectionToggle>
              <MsLabel [htmlFor]="item.id.toString()">{{item.name}}</MsLabel>
          </div>
      </MsSelection>`,
  selector: 'Spec'
})
export class SelectionSpecComponent {
  items: PeriodicElement[] = ELEMENT_DATA.slice(0, 10);

  values: PeriodicElement[];

  @ViewChild(MsSelection)
  selection: MsSelection;
}
