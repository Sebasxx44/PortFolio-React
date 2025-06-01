// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './assets/utils/es.json';
import en from './assets/utils/en.json';
import pt from './assets/utils/pt.json'; 

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt },
    },
    lng: 'en', // idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
