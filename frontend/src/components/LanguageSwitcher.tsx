import React from 'react';
import i18n from './../i18n'; 
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';

const LanguageSwitcher: React.FC = () => {
    const currentLang = i18n.language;
    const { t } = useTranslation();
    const { updateLang } = useAppStore();
  
    return (
      <div className="flex gap-2">
        <button
          onClick={() => updateLang('en')}
          className={`px-4 py-2 rounded border transition 
            ${currentLang === 'en'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
        >
          {t('en')}
        </button>
        <button
          onClick={() => updateLang('es')}
          className={`px-4 py-2 rounded border transition 
            ${currentLang === 'es'
              ? 'bg-pink-100 text-pink-800 border-pink-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'}`}
        >
          {t('es')}
        </button>
        <button
          onClick={() => updateLang('de')}
          className={`px-4 py-2 rounded border transition 
            ${currentLang === 'de'
              ? 'bg-pink-100 text-pink-800 border-pink-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'}`}
        >
          {t('de')}
        </button>
      </div>
    );
  };

export default LanguageSwitcher;