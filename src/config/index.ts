import invariant from 'tiny-invariant';

invariant(
  process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
  'Default language is not set'
);

if (process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true') {
  invariant(
    process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES,
    'Available language is not set'
  );
}

export const Config = {
  broadcastDriver: process.env.NEXT_PUBLIC_API_BROADCAST_DRIVER ?? 'log',
  pusherEnable: process.env.NEXT_PUBLIC_PUSHER_ENABLED ?? 'false',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
  availableLanguages: process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES
    ? process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES.split(',')
    : [],
  enableMultiLang: process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true',
  rtlLanguages: ['ar', 'fa', 'he'],
  getDirection: (language: string | undefined) => {
    if (!language) return 'ltr';
    return Config.rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  },
};
