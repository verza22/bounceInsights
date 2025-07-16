import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import 'moment/locale/es';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/nl';
import 'moment/locale/ru';

import en from './translations/en.json';
import es from './translations/es.json';
import de from './translations/de.json';
import fr from './translations/fr.json';
import it from './translations/it.json';
import nl from './translations/nl.json';
import ru from './translations/ru.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      nl: { translation: nl },
      ru: { translation: ru }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
});

export default i18n;