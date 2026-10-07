import type { GlobalThemeOverrides } from 'naive-ui';
import { campusPalette } from './ui/theme/campus-palette';

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: campusPalette.navy,
    primaryColorHover: '#17458f',
    primaryColorPressed: '#011c4d',
    primaryColorSuppl: campusPalette.slateBlue,
  },
  Menu: {
    itemHeight: '32px',
  },

  Layout: {
    color: '#f3f6fb',
    siderColor: '#ffffff',
    siderBorderColor: '#dfe6f2',
  },

  Card: {
    color: '#ffffff',
    borderColor: '#dfe6f2',
  },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px' },
    },
  },
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#9DBBE1',
    primaryColorHover: '#c2d5ee',
    primaryColorPressed: campusPalette.skyBlue,
    primaryColorSuppl: campusPalette.skyBlue,
  },

  Notification: {
    color: '#1b2b4d',
  },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: '#1b2b4d' },
    },
  },

  Menu: {
    itemHeight: '32px',
  },

  Layout: {
    color: '#111d36',
    siderColor: '#172542',
    siderBorderColor: '#263a61',
  },

  Card: {
    color: '#1b2b4d',
    borderColor: '#2b4167',
  },

  Table: {
    tdColor: '#1b2b4d',
    thColor: '#273a5d',
  },
};
