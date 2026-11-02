import { PoTheme, poThemeDefaultNeutrals } from '@po-ui/ng-components';

export const minicrmTheme: PoTheme = {
  name: 'minicrm',
  type: {
    light: {
      color: {
        brand: {
          '01': {
            lightest: '#e3f6fa',
            lighter: '#aee3ee',
            light: '#5cc3d9',
            base: '#0a6b82',
            dark: '#085567',
            darker: '#063f4d',
            darkest: '#042a33',
          },
        },
        // getSelectBgIconsStyle() do PO-UI acessa themeColor.neutral.dark[70] sempre que
        // brand['01'].dark estiver definido — sem isso, o setTheme() lança excecao e quebra
        // o bootstrap da aplicacao (tela em branco).
        neutral: poThemeDefaultNeutrals,
      },
      onRoot: {
        '--color-toolbar-background-color-toolbar': '#0b1030',
        '--color-toolbar-color-title': '#f4f7ff',
        '--color-toolbar-color-default': '#cdd6f4',
        '--color-toolbar-border-color-separator': 'rgba(255,255,255,0.12)',
        '--color-toolbar-background-color-badge': '#0a6b82',
        '--color-toolbar-color-badge-text': '#ffffff',
        '--color-list-view-color-primary': 'var(--color-brand-01-base)',
      },
      perComponent: {
        'po-menu': {
          '--background-color': '#0b1030',
          '--border-color': 'transparent',
        },
        'po-menu-item': {
          '--color': '#cdd6f4',
        },
      },
    },
  },
};
