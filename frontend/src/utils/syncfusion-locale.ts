import { loadCldr } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import i18n from './../i18n';
import { L10n } from '@syncfusion/ej2-base';
import { getLanguagues } from './utils';

// Es
import * as caEs from 'cldr-data/main/es/ca-gregorian.json';
import * as numbersEs from 'cldr-data/main/es/numbers.json';
import * as timeZoneNamesEs from 'cldr-data/main/es/timeZoneNames.json';

// De
import * as caDe from 'cldr-data/main/de/ca-gregorian.json';
import * as numbersDe from 'cldr-data/main/de/numbers.json';
import * as timeZoneNamesDe from 'cldr-data/main/de/timeZoneNames.json';

// Fr
import * as caFr from 'cldr-data/main/fr/ca-gregorian.json';
import * as numbersFr from 'cldr-data/main/fr/numbers.json';
import * as timeZoneNamesFr from 'cldr-data/main/fr/timeZoneNames.json';

// It
import * as caIt from 'cldr-data/main/it/ca-gregorian.json';
import * as numbersIt from 'cldr-data/main/it/numbers.json';
import * as timeZoneNamesIt from 'cldr-data/main/it/timeZoneNames.json';

// Nl
import * as caNl from 'cldr-data/main/nl/ca-gregorian.json';
import * as numbersNl from 'cldr-data/main/nl/numbers.json';
import * as timeZoneNamesNl from 'cldr-data/main/nl/timeZoneNames.json';

// Ru
import * as caRu from 'cldr-data/main/ru/ca-gregorian.json';
import * as numbersRu from 'cldr-data/main/ru/numbers.json';
import * as timeZoneNamesRu from 'cldr-data/main/ru/timeZoneNames.json';

export const setupSyncfusionLocales = () => {
  loadCldr(
    numberingSystems,
    caEs, numbersEs, timeZoneNamesEs,
    caDe, numbersDe, timeZoneNamesDe,
    caFr, numbersFr, timeZoneNamesFr,
    caIt, numbersIt, timeZoneNamesIt,
    caNl, numbersNl, timeZoneNamesNl,
    caRu, numbersRu, timeZoneNamesRu
  );

  const languages = getLanguagues();

  languages.forEach((lang) => {
    const daterangepicker = i18n.getResourceBundle(lang, 'translation')?.daterangepicker;
    const dialog = i18n.getResourceBundle(lang, 'translation')?.dialog;
    if (daterangepicker || dialog) {
      L10n.load({
        [lang]: {
          daterangepicker: daterangepicker,
          dialog: dialog
        }
      });
    }
  });
};