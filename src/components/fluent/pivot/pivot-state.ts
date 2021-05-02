export class MsPivotStateItem {
  constructor(public id: string, public label: string) {
  }
}

export const MS_PIVOT_STATE_KEY = 'MS_PIVOT_STATE_KEY';

export class PivotState {
  private _items: MsPivotStateItem[];

  constructor() {
    this.loadItems();
  }

  loadItems() {
    const jsonValue = localStorage.getItem(MS_PIVOT_STATE_KEY);

    if (jsonValue) {
      const values = JSON.parse(jsonValue);
      this._items = values.map(item => new MsPivotStateItem(item.id, item.label));
    } else {
      this._items = [];
      this.persist();
    }
  }

  getActiveLabel(id: string): string | undefined {
    const label = this._items.find(item => item.id === id);
    return label?.label;
  }

  setActiveLabel(id: string, value: string) {
    const label = this._items.find(item => item.id === id);
    if (label) {
      label.label = value;
    } else {
      this._items.push(new MsPivotStateItem(id, value));
    }
    this.persist();
  }

  persist() {
    localStorage.setItem(MS_PIVOT_STATE_KEY, JSON.stringify(this._items));
  }
}
