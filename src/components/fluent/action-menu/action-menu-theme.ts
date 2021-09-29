export type msActionMenuTheme = 'transparent' | 'primary' | 'success' | 'error' | 'standard';

export interface MsActionMenuColorTheme {
  class: string |string [];
  iconClass: string | string[];
}

export const actionMenuColorThemes: { [name: string]: MsActionMenuColorTheme } = {
  'primary': {
    class: 'ms-action-menu-button-primary',
    iconClass: 'primary-icon'
  },
  'standard': {
    class: 'ms-action-menu-button-standard',
    iconClass: 'standard-icon'
  },

  'error': {
    class: 'ms-action-menu-button-error',
    iconClass: 'error-icon'
  },

  'success': {
    class: 'ms-action-menu-button-success',
    iconClass: 'success-icon'
  },
};
