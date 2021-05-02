export type msButtonTheme = 'error' | 'transparent' | 'info' | 'primary' | 'success' | 'error' | 'warning' | 'standard'
| 'errorOutline'  | 'infoOutline' | 'primaryOutline' | 'successOutline' | 'errorOutline' | 'warningOutline' | 'standardOutline'

export interface MsButtonColorTheme {
  fontColor: string;
  bgColor: string;
  hoverFontColor?: string;
  hoverBgColor?: string;
  borderColor?: string;
  focusBorderColor: string;
}

export const colorThemes: { [name: string]: MsButtonColorTheme } = {
  'error': {
    fontColor: 'white',
    focusBorderColor: 'white',
    bgColor: 'sharedRed10',
    hoverBgColor: 'sharedRed20',
    borderColor: 'sharedRed10'
  },
  'transparent': {
    fontColor: 'inherit',
    focusBorderColor: 'transparent',
    bgColor: 'transparent',
    hoverBgColor: 'transparent',
    borderColor: 'transparent'
  },
  'standard': {
    fontColor: 'sharedGray180',
    focusBorderColor: 'sharedGray180',
    bgColor: 'SharedGray160',
    borderColor: 'transparent'
  },
  'info': {
    fontColor: 'white',
    focusBorderColor: 'white',
    bgColor: 'sharedBlue10',
    borderColor: 'sharedBlue10'
  },
  'primary': {
    fontColor: 'white',
    focusBorderColor: 'white',
    bgColor: 'sharedBlue10',
    borderColor: 'sharedBlue10'
  },
  'success': {
    fontColor: 'white',
    focusBorderColor: 'white',
    bgColor: 'sharedGreenCyan10',
    hoverBgColor: 'sharedGreen20',
    borderColor: 'sharedGreenCyan10'
  },
  'warning': {
    fontColor: 'white',
    focusBorderColor: 'white',
    bgColor: 'sharedRedOrange10',
    borderColor: 'sharedRedOrange10'
  },

  'standardOutline': {
    fontColor: 'sharedGray180',
    focusBorderColor: 'sharedGray180',
    bgColor: 'SharedGray10',
    borderColor: 'sharedGray180'
  },
  'errorOutline': {
    bgColor: 'transparent',
    focusBorderColor: 'sharedRed10',
    fontColor: 'sharedRed10',
    borderColor: 'sharedRed10',
    hoverFontColor: 'white',
    hoverBgColor: 'sharedRed10'
  },
  'infoOutline': {
    fontColor: 'sharedBlue10',
    focusBorderColor: 'sharedBlue10',
    bgColor: 'transparent',
    hoverFontColor: 'white',
    hoverBgColor: 'sharedBlue10',
    borderColor: 'sharedBlue10'
  },

  'primaryOutline': {
    fontColor: 'sharedBlue10',
    focusBorderColor: 'sharedBlue10',
    bgColor: 'transparent',
    hoverFontColor: 'white',
    hoverBgColor: 'sharedBlue10',
    borderColor: 'sharedBlue10'
  },

  'successOutline': {
    fontColor: 'sharedGreenCyan10',
    focusBorderColor: 'sharedGreenCyan10',
    bgColor: 'transparent',
    hoverFontColor: 'white',
    hoverBgColor: 'sharedGreenCyan10',
    borderColor: 'sharedGreenCyan10'
  },
  'warningOutline': {
    fontColor: 'sharedRedOrange10',
    focusBorderColor: 'sharedRedOrange10',
    bgColor: 'transparent',
    hoverFontColor: 'white',
    hoverBgColor: 'sharedRedOrange10',
    borderColor: 'sharedRedOrange10'
  },
};
