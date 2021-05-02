import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MsPaginator} from './paginator';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {MsPaginatorItemsFn} from './paginator-options';
import {MsPaginatorModule} from './paginator.module';
import {By} from '@angular/platform-browser';
import {ELEMENT_DATA, PeriodicElement} from '../table/test-element-data';


describe('Paginator component', () => {
  let fixture: ComponentFixture<PaginatorSpecComponent>;
  let component: PaginatorSpecComponent;

  let paginatorInstance: MsPaginator<PeriodicElement>;
  let paginatorDebugElement: DebugElement;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginatorSpecComponent],
      imports: [MsPaginatorModule]
    }).compileComponents();

    TestBed.compileComponents();
    fixture = TestBed.createComponent(PaginatorSpecComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
    paginatorDebugElement = fixture.debugElement.query(By.directive(MsPaginator));
    paginatorInstance = paginatorDebugElement.componentInstance;

    spyOn(paginatorInstance.pageChange, 'emit');
    spyOn(paginatorInstance.stateChange, 'emit');
  });


  it('render and check basic attribute', () => {
    expect(paginatorInstance.currentPageIndex).toBe(0);
    expect(paginatorInstance.itemsFn).toBe(component.itemsFn);
    expect(paginatorInstance.hasNextPage).toBe(true);
    expect(paginatorInstance.hasPreviousPage).toBe(false);
    expect(paginatorInstance.totalSize).toBe(component.totalSize);
    expect(paginatorInstance.pageSize).toBe(component.pageSize);
    expect(paginatorInstance.pageCount).toBe(7);
  });

  it('Activate page 1', async () => {
    const page = await paginatorInstance.changePage(0);

    expect(paginatorInstance.currentPage).toEqual(page);
    expect(paginatorInstance.currentPageIndex).toEqual(0);
    expect(page).toBeDefined();
    expect(page.index).toBe(0);
    expect(page.length).toBe(5);
    expect(page.items.length).toBe(5);
    expect(page.start).toBe(0);
    expect(page.end).toBe(4);
    expect(page.viewRef).toBeDefined();

    expect(paginatorInstance.pageChange.emit).toHaveBeenCalledWith(page);
    expect(page.viewRef.context).toBe(page);
    expect(page.viewRef.rootNodes[0].innerHTML).toBe(JSON.stringify(ELEMENT_DATA.slice(0, 5), null, 2));
  });

  it('Activate page with no complete data', async () => {
    const page = await paginatorInstance.changePage(6);

    expect(paginatorInstance.currentPage).toEqual(page);
    expect(paginatorInstance.currentPageIndex).toBe(6);
    expect(page).toBeDefined();
    expect(page.index).toBe(6);
    expect(page.length).toBe(4);
    expect(page.items.length).toBe(4);
    expect(page.start).toBe(30);
    expect(page.end).toBe(33);
    expect(page.viewRef).toBeDefined();

    expect(paginatorInstance.pageChange.emit).toHaveBeenCalledWith(page);
    expect(page.viewRef.context).toBe(page);
    expect(page.viewRef.rootNodes[0].innerHTML).toBe(JSON.stringify(ELEMENT_DATA.slice(30), null, 2));
  });

  it('Call NextPage() should activate nextPage', async () => {
    await paginatorInstance.changePage(0);
    const page = await paginatorInstance.nextPage();

    expect(paginatorInstance.currentPage).toEqual(page);
    expect(paginatorInstance.currentPageIndex).toBe(1);
    expect(page).toBeDefined();
    expect(page.items.length).toBe(5);
    expect(page.index).toBe(1);
  });

  it('Call prevPage() should activate prevPage', async () => {
    await paginatorInstance.changePage(1);
    const page = await paginatorInstance.previousPage();

    expect(paginatorInstance.currentPage).toEqual(page);
    expect(paginatorInstance.currentPageIndex).toBe(0);
    expect(page).toBeDefined();
    expect(page.items.length).toBe(5);
    expect(page.index).toBe(0);
  });

  it('Activate out of range Up page should active last page', async () => {
    const page = await paginatorInstance.changePage(7);

    expect(page.index).toBe(6);
    expect(paginatorInstance.currentPage).toBe(page);
  });

  it('Activate out of range Down page should active page 0', async () => {
    const page = await paginatorInstance.changePage(-1);

    expect(page.index).toBe(0);
    expect(paginatorInstance.currentPage).toBe(page);
  });

  it('Activate a middle then HasPrev and HasNext should be true', async () => {
    await paginatorInstance.changePage(1);
    expect(paginatorInstance.hasPreviousPage).toBe(true);
    expect(paginatorInstance.hasNextPage).toBe(true);
  });

  it('Activate page 0 and HasPrev should be false', async () => {
    await paginatorInstance.changePage(0);
    expect(paginatorInstance.hasPreviousPage).toBe(false);
  });

  it('Activate last page and HasNext should be false', async () => {
    await paginatorInstance.changePage(6);
    expect(paginatorInstance.hasNextPage).toBe(false);
  });

  it('changePageSize to datalength and Next and Prev shouldBe False', () => {

  });

  it('Set empty data and pageSize shouldBe 1', () => {
    component.totalSize = 0;
  });
});

@Component({
  template: `
      <msPaginator [itemsFn]="itemsFn" [totalSize]="totalSize" [pageSize]="pageSize">
          <div *ms-paginatorPageDef="let data=items">{{data | json}}</div>
      </msPaginator>`,
  selector: 'Spec'
})
export class PaginatorSpecComponent {
  itemsFn: MsPaginatorItemsFn<PeriodicElement> = (page: number, size: number) => {
    return Promise.resolve(
      ELEMENT_DATA.slice(page * size, page * size + size))
  };

  @ViewChild(MsPaginator)
  paginator: MsPaginator<PeriodicElement>;
  totalSize: number = ELEMENT_DATA.length;

  pageSize: number = 5;
}
