import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      dark: true,
      themes: {
        light: {
          primary: '#FFD42A',//'#CCAA22',
          secondary: '#424242',
          accent: '#ffffff',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
        dark: {
          primary: '#FFD42A',
          secondary: '#424242',
          accent: '#121212',
          error: '#FF4444',
          info: '#2196F3',
          success: '#00C851',
          warning: '#FFC107',
        },
      },
    },
});
