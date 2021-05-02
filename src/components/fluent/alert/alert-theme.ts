export type MsAlertTheme = 'info' | 'success' | 'severeWarning' | 'error' | 'standard' | string;

export interface MsAlertThemeDeclaration {
  fontColor: string;
  bgColor: string;
  borderColor: string;
  icon?: string
}

export const MS_ALERT_THEME_DECLARATIONS: Map<string, MsAlertThemeDeclaration> = new Map<string, MsAlertThemeDeclaration>(
  [
    ['info', {fontColor: 'info', bgColor: 'info', borderColor: 'info', icon: 'Info'}],
    ['standard', {fontColor: 'info', bgColor: 'info', borderColor: 'info', icon: 'Info'}],
    ['success', {fontColor: 'success', bgColor: 'success', borderColor: 'success', icon: 'Completed'}],
    ['severeWarning', {
      fontColor: 'severeWarning',
      bgColor: 'severeWarning',
      borderColor: 'severeWarning',
      icon: 'Warning12'
    }],
    ['error', {fontColor: 'error', bgColor: 'error', borderColor: 'error', icon: 'ErrorBadge'}]
  ]
);
