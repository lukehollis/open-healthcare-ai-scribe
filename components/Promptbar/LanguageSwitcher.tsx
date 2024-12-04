import React from 'react';
import { useTranslation } from 'next-i18next';
import { IconLanguage } from '@tabler/icons-react';
import { useRouter } from 'next/router';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const languageMap = { 
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    fr: 'Français',
    ar: 'العربية',
    it: 'Italiano',
    ko: '한국어',
    pt: 'Português',
    pl: 'Polski',
    ru: 'Русский',
    ja: '日本語',
    zh: '中文',
  };

  const changeLanguage = (event: any) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
    router.push({ pathname, query }, asPath, { locale: i18n.language });
  };

  return (
    <div className="flex flex-nowrap items-center w-full select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 transition-colors duration-200">
      <IconLanguage className="text-gray-800 dark:text-white flex-shrink-0" size={22} />
      <select 
        onChange={changeLanguage} 
        value={i18n.language}
        className={`cursor-pointer flex-grow select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 transition-colors duration-200 dark:bg-gray-800/80 text-neutral-800 dark:text-white hover:bg-gray-500/10 dark:hover:bg-gray-500/10`}
      >
        {Object.entries(languageMap).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
