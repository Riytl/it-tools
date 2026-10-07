import { defineThemes } from '../theme/theme.models';

export const { useTheme } = defineThemes({
  dark: {
    backgroundColor: '#1b2b4d',
    borderColor: '#2b4167',
  },
  light: {
    backgroundColor: '#ffffff',
    borderColor: '#dfe6f2',
  },
});
