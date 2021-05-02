export type MsTooltipTheme = 'error' | 'transparent' | 'standard' | 'info' | 'primary' | 'success' | 'warning' | string;

export interface MsTooltipThemeDeclaration {
  name: string;
  fontColor: string;
  bgColor: string;
}

export const MS_TOOLTIP_DEFAULT_THEMES: MsTooltipThemeDeclaration[] = [
  {name: 'error', fontColor: 'white', bgColor: 'sharedRed10'},
  {name: 'transparent', fontColor: 'inherit', bgColor: 'transparent'},
  {name: 'standard', fontColor: 'sharedGray180', bgColor: 'white'},
  {name: 'info', fontColor: 'white', bgColor: 'sharedBlue10'},
  {name: 'primary', fontColor: 'white', bgColor: 'sharedBlue10'},
  {name: 'success', fontColor: 'white', bgColor: 'sharedGreenCyan10',},
  {name: 'warning', fontColor: 'white', bgColor: 'sharedRedOrange10'}
];


export class MsTooltipThemes {
  constructor(defaultThemes: MsTooltipThemeDeclaration[]) {
    this.themes = new Map(defaultThemes.map(item => [item.name, item]));
  }

  private themes: Map<string, MsTooltipThemeDeclaration>;

  get(name: string): MsTooltipThemeDeclaration {
    return this.themes.get(name);
  }

  has(name: string): boolean {
    return this.themes.has(name);
  }

  add(theme: MsTooltipThemeDeclaration) {
    this.themes.set(theme.name, theme);
  }

  remove(name: string) {
    this.themes.delete(name);
  }
}
