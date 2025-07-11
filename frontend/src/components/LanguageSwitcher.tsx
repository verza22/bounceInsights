import React from 'react';
import i18n from './../i18n'; 
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const currentLang = i18n.language;
    const { t } = useTranslation();
  
    return (
      <div className="flex gap-2">
        <button
          onClick={() => i18n.changeLanguage('en')}
          className={`px-4 py-2 rounded border transition 
            ${currentLang === 'en'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
        >
          {t('english')}
        </button>
        <button
          onClick={() => i18n.changeLanguage('es')}
          className={`px-4 py-2 rounded border transition 
            ${currentLang === 'es'
              ? 'bg-pink-100 text-pink-800 border-pink-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'}`}
        >
          {t('spanish')}
        </button>
      </div>
    );
  };

export default LanguageSwitcher;