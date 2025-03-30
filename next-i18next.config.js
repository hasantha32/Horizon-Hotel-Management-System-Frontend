/** @type {import('next-i18next').UserConfig} */

const invariant = require('tiny-invariant');
const path = require('path');

invariant(
  process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
  'NEXT_PUBLIC_DEFAULT_LANGUAGE is required, but not set, check your .env file'
);
invariant(
  process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES,
  'NEXT_PUBLIC_AVAILABLE_LANGUAGES is required, but not set, check your .env file'
);

const isMultilangEnable =
  process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
  !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;

function generateLocales() {
  if (isMultilangEnable) {
    return process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES.split(',');
  }

  return [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE];
}

module.exports = {
  i18n: {
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? "en",
    locales: generateLocales(),
  },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
