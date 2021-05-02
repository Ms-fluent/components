export type MsPersonaSize = 'size24' | 'size32' | 'size40' | 'size48' | 'size56' | 'size72' | 'size100' | 'size120';

export class MsPersonaSizeDeclaration {
  size: MsPersonaSize;
  width: number;
  fontSize: number;
  statusWidth: number;
  statusIcon: boolean;
  statusFontSize: number;
}

export const MS_PERSONA_SIZES: { [key: string]: MsPersonaSizeDeclaration } = {
  'size24': {
    width: 24,
    size: 'size24',
    fontSize: 10,
    statusWidth: 12,
    statusIcon: false,
    statusFontSize: 0
  },
  'size32': {
    width: 32,
    size: 'size32',
    fontSize: 14,
    statusWidth: 6,
    statusIcon: false,
    statusFontSize: 4
  },
  'size40': {
    width: 40,
    size: 'size40',
    fontSize: 16,
    statusWidth: 8,
    statusIcon: false,
    statusFontSize: 8
  },
  'size48': {
    width: 48,
    size: 'size48',
    fontSize: 18,
    statusWidth: 12,
    statusIcon: false,
    statusFontSize: 12
  },
  'size56': {
    width: 56,
    size: 'size56',
    fontSize: 24,
    statusWidth: 14,
    statusIcon: false,
    statusFontSize: 14
  },
  'size72': {
    width: 72,
    size: 'size72',
    fontSize: 32,
    statusWidth: 18,
    statusIcon: false,
    statusFontSize: 16
  },

  'size100': {
    width: 100,
    size: 'size100',
    fontSize: 48,
    statusWidth: 24,
    statusIcon: false,
    statusFontSize: 20
  },

  'size120': {
    width: 120,
    size: 'size120',
    fontSize: 58,
    statusWidth: 28,
    statusIcon: false,
    statusFontSize: 24
  }
};
