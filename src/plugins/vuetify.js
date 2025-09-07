import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

const light = {
  dark: false,
  colors: {
    primary: '#FFD42A',
    secondary: '#424242',
    accent: '#ffffff',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
};

const dark = {
  dark: true,
  colors: {
    primary: '#FFD42A',
    secondary: '#424242',
    accent: '#121212',
    error: '#FF4444',
    info: '#2196F3',
    success: '#00C851',
    warning: '#FFC107',
  },
};

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: { light, dark },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});
