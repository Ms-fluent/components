export type msActionMenuTheme = 'transparent' | 'primary' | 'success' | 'error' | 'standard';

export interface MsActionMenuColorTheme {
  fontColor: string;
  bgColor: string;
  hoverFontColor?: string;
  hoverBgColor?: string;
  focusBorderColor: string;
}

export const actionMenuColorThemes: { [name: string]: MsActionMenuColorTheme } = {
  'error': {
    fontColor: 'sharedRed20',
    focusBorderColor: 'sharedRed20',
    bgColor: 'transparent',
    hoverBgColor: 'sharedRed20',
    hoverFontColor: 'white'
  },
  'transparent': {
    fontColor: 'inherit',
    focusBorderColor: 'gray160',
    bgColor: 'transparent',
    hoverBgColor: 'gray30'
  },
  'standard': {
    fontColor: 'sharedGray180',
    focusBorderColor: 'gray180',
    bgColor: 'gray20',
    hoverBgColor: 'gray40'
  },
  'primary': {
    fontColor: 'sharedBlue10',
    focusBorderColor: 'white',
    bgColor: 'white',
    hoverFontColor: 'white',
    hoverBgColor: 'sharedBlue10'
  },
  'success': {
    focusBorderColor: 'sharedGreenCyan10',
    fontColor: 'sharedGreenCyan10',
    bgColor: 'transparent',
    hoverBgColor: 'sharedGreen20',
    hoverFontColor: 'white'
  },
  'warning': {
    fontColor: 'white',
    focusBorderColor: 'white',
    bgColor: 'sharedRedOrange10'
  },

};
