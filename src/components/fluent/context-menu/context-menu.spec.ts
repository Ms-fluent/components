import {Component, DebugElement, ViewChild} from '@angular/core';
import {ELEMENT_DATA, PeriodicElement} from '../table/test-element-data';
import {MsContextMenu, MsContextMenuItem, MsContextMenuModule} from '../..';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';


describe('Context menu', () => {
  let fixture: ComponentFixture<ContextMenuSpecComponent>;
  let component: ContextMenuSpecComponent;

  let selectionInstance: MsContextMenu<PeriodicElement>;
  let selectionDebugElement: DebugElement;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContextMenuSpecComponent],
      imports: [MsContextMenuModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContextMenuSpecComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
    selectionDebugElement = fixture.debugElement.query(By.directive(MsContextMenu));
    selectionInstance = selectionDebugElement.componentInstance;

    spyOn(selectionInstance._change, 'next');
  });

  it('Check initial state', () => {
    fixture.detectChanges();
    expect(selectionInstance._items.length).toBe(10);
    expect(selectionInstance.values).toEqual([]);
    expect(selectionInstance.items.length).toBe(component.items.length);
    expect(selectionInstance.value).toBeUndefined();
    expect(selectionInstance.isAllSelected).toBeFalse();
    expect(selectionInstance.selectedIndexes).toEqual([]);
    expect(selectionInstance.selectedKeys).toEqual([]);
  });

  it('Select item', () => {
    const selectedItem = selectionInstance.items[1];
    selectionInstance.selectItem(selectedItem);
    fixture.detectChanges();

    component.assertIsSingleSelected(selectedItem);
  });

  it('Deselect item', () => {
    const selectedItem = selectionInstance.items[1];
    selectionInstance.selectItem(selectedItem);
    fixture.detectChanges();
    selectionInstance._deselectItem(selectedItem);
    fixture.detectChanges();

    component.assertIsDeselected(selectedItem);
  });


});

@Component({
  template: `
      <MsContextMenu [selectable]="true" [(values)]="values">
          <MsContextMenuItem *ngFor="let item of items" >
              {{item.name}}
          </MsContextMenuItem>
      </MsContextMenu>`,
  selector: 'ContextMenuSpec'
})
export class ContextMenuSpecComponent {
  items: PeriodicElement[] = ELEMENT_DATA.slice(0, 10);

  values: PeriodicElement[];

  @ViewChild(MsContextMenu)
  contextMenu: MsContextMenu;

  assertIsSingleSelected(item: MsContextMenuItem) {
    expect(item.checked).toBeTruthy();
    expect(this.contextMenu.values).toEqual([item.value]);
    expect(this.contextMenu.selectedKeys).toEqual([item.key]);
    expect(this.contextMenu.selectedIndexes).toEqual([1]);
    expect(this.contextMenu.value).toBe(item.value);
    expect(this.values).toEqual([item.value]);
  }

  assertIsDeselected(item: MsContextMenuItem) {
    expect(item.checked).toBeFalse();
    expect(this.contextMenu.values.indexOf(item.value)).toEqual(-1);
    expect(this.contextMenu.selectedKeys.indexOf(item.key)).toEqual(-1);
    expect(this.contextMenu.selectedIndexes.indexOf(item._index)).toEqual(-1);
    expect(this.values.indexOf(item.value)).toEqual(-1);
  }
}
