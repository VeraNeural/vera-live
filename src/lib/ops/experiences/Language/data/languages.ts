import type { LanguageRegion } from '../types';

export const SUPPORTED_LANGUAGE_REGIONS: LanguageRegion[] = [
  {
    id: 'european',
    title: 'European',
    languages: [
      { code: 'es', name: 'Spanish', flag: '🇪🇸' },
      { code: 'fr', name: 'French', flag: '🇫🇷' },
      { code: 'de', name: 'German', flag: '🇩🇪' },
      { code: 'it', name: 'Italian', flag: '🇮🇹' },
      { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    ],
  },
  {
    id: 'asian',
    title: 'Asian',
    languages: [
      { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
      { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
      { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    ],
  },
  {
    id: 'middleEasternSouthAsian',
    title: 'Middle Eastern / South Asian',
    languages: [
      { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
      { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    ],
  },
  {
    id: 'balkan',
    title: 'Balkan',
    languages: [
      { code: 'mk', name: 'Macedonian', flag: '🇲🇰' },
      { code: 'sq', name: 'Albanian', flag: '🇦🇱' },
      { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
    ],
  },
  {
    id: 'easternEuropean',
    title: 'Eastern European',
    languages: [{ code: 'ru', name: 'Russian', flag: '🇷🇺' }],
  },
];

export const SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGE_REGIONS.flatMap((r) => r.languages);

export function findLanguage(code: string) {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? null;
}
