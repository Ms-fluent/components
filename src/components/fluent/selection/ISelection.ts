export interface IMsSelection<T = any> {
  value: T;

  values: T[];

  selectedIndexes: number[];
  selectedKeys: string[];

  isAllSelected: boolean;
  isIndexSelected(...index: number[]): boolean;
  isValueSelected(...values: T[]): boolean;
  isKeySelected(...key: string[]): boolean;
  isRangeSelected(fromIndex: number, count: number): boolean;


  selectAll(): void;
  selectIndexes(...index: number[]): void;
  selectValues(...values: T[]): void;
  selectKeys(...string: string[]): void;
  selectRange(fromIndex: number, count: number): void;

  toggleAll(): void;
  toggleIndex(...indexes: number[]): void;
  toggleValue(...values: T[]): void;
  toggleKeys(...keys: string[]): void;
  toggleRange(fromIndex: number, count: number): void;

  deselectAll(): void;
  deselectIndex(...indexes: number[]): void;
  deselectValue(...values: T[]): void;
  deselectKeys(...keys: string[]): void;
  deselectRange(fromIndex: number, count: number): void;

}
