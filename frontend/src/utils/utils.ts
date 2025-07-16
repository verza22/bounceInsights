import { Internationalization } from '@syncfusion/ej2-base';
import i18n from 'i18next'; 
import moment from 'moment';

export const formatDate = (date: Date): string => date.toISOString().split('T')[0]; //date to YYYY-MM-DD
export const strFormatDate = (str: string): Date => new Date(str); //string to date

export const createRandomUuid = (): string => {
    return `id-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export const detectBrowserLanguage = (): string => {
    const supportedLanguages = getLanguagues();
    const browserLang = navigator.language.split("-")[0];
    return supportedLanguages.includes(browserLang) ? browserLang : "en";
};

export const getLanguagues = () => {
    return ["en", "es", "de", "fr", "it", "nl", "ru"];
}

export const formatLocalizedDate = (dateStr: string | Date): string => {
    if(dateStr){
        const locale = i18n.language.split('-')[0];
        const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      
        const formatMap: Record<string, string> = {
          es: 'D/M/YYYY',
          en: 'M/D/YYYY',
          de: 'D.M.YYYY',
          fr: 'DD/MM/YYYY',
          it: 'D/M/YYYY',
          nl: 'D-M-YYYY',
          ru: 'DD.MM.YYYY'
        };
      
        const format = formatMap[locale] || 'D/M/YYYY';
      
        return moment(date).locale(locale).format(format);
    }else{
        return "";
    }
};