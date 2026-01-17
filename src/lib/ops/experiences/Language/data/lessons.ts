import type { Lesson } from '../types';

// Proof-of-concept lessons for: Spanish (es), French (fr), Macedonian (mk)
// Each language gets a small beginner starter set.

const GREETINGS = 'greetings';
const FEELINGS = 'feelings';
const COMMON = 'common-phrases';
const NUMBERS = 'numbers-1-10';
const POLITE = 'polite-phrases';

export const LESSONS_BY_LANGUAGE: Record<string, Lesson[]> = {
  es: [
    {
      id: GREETINGS,
      title: 'Greetings',
      level: 'beginner',
      phrases: [
        { original: 'Hola', translated: 'Hello', pronunciation: 'OH-lah' },
        { original: 'Adiós', translated: 'Goodbye', pronunciation: 'ah-dee-OHS' },
        { original: 'Gracias', translated: 'Thank you', pronunciation: 'GRAH-syahs' },
        { original: 'Por favor', translated: 'Please', pronunciation: 'por fah-VOR' },
      ],
    },
    {
      id: FEELINGS,
      title: 'Feelings',
      level: 'beginner',
      phrases: [
        { original: 'Feliz', translated: 'Happy', pronunciation: 'feh-LEES' },
        { original: 'Triste', translated: 'Sad', pronunciation: 'TREES-teh' },
        { original: 'Ansioso / Ansiosa', translated: 'Anxious', pronunciation: 'ahn-syoh-so / ahn-syoh-sah' },
        { original: 'Calmado / Calmada', translated: 'Calm', pronunciation: 'kahl-MAH-doh / kahl-MAH-dah' },
        { original: 'Cansado / Cansada', translated: 'Tired', pronunciation: 'kahn-SAH-doh / kahn-SAH-dah' },
        { original: 'Emocionado / Emocionada', translated: 'Excited', pronunciation: 'eh-moh-syoh-NAH-doh / eh-moh-syoh-NAH-dah' },
      ],
    },
    {
      id: COMMON,
      title: 'Common phrases',
      level: 'beginner',
      phrases: [
        { original: '¿Cómo estás?', translated: 'How are you?', pronunciation: 'KOH-moh ehs-TAHS' },
        { original: 'Necesito ayuda.', translated: 'I need help.', pronunciation: 'neh-seh-SEE-toh ah-YOO-dah' },
        { original: '¿Dónde está ___?', translated: 'Where is ___?', pronunciation: 'DOHN-deh ehs-TAH' },
        { original: 'No entiendo.', translated: "I don't understand.", pronunciation: 'noh ehn-TYEN-doh' },
      ],
    },
    {
      id: NUMBERS,
      title: 'Numbers (1–10)',
      level: 'beginner',
      phrases: [
        { original: 'Uno', translated: '1', pronunciation: 'OO-noh' },
        { original: 'Dos', translated: '2', pronunciation: 'dohs' },
        { original: 'Tres', translated: '3', pronunciation: 'trehs' },
        { original: 'Cuatro', translated: '4', pronunciation: 'KWAH-troh' },
        { original: 'Cinco', translated: '5', pronunciation: 'SEEN-koh' },
        { original: 'Seis', translated: '6', pronunciation: 'says' },
        { original: 'Siete', translated: '7', pronunciation: 'SYEH-teh' },
        { original: 'Ocho', translated: '8', pronunciation: 'OH-choh' },
        { original: 'Nueve', translated: '9', pronunciation: 'NWEH-beh' },
        { original: 'Diez', translated: '10', pronunciation: 'dee-EHS' },
      ],
    },
    {
      id: POLITE,
      title: 'Polite phrases',
      level: 'beginner',
      phrases: [
        { original: 'Disculpe.', translated: 'Excuse me.', pronunciation: 'dees-KOOL-peh' },
        { original: 'Lo siento.', translated: 'Sorry.', pronunciation: 'loh SYEN-toh' },
        { original: 'De nada.', translated: "You're welcome.", pronunciation: 'deh NAH-dah' },
      ],
    },
  ],

  fr: [
    {
      id: GREETINGS,
      title: 'Greetings',
      level: 'beginner',
      phrases: [
        { original: 'Bonjour', translated: 'Hello', pronunciation: 'bohn-ZHOOR' },
        { original: 'Au revoir', translated: 'Goodbye', pronunciation: 'oh ruh-VWAHR' },
        { original: 'Merci', translated: 'Thank you', pronunciation: 'mehr-SEE' },
        { original: "S'il vous plaît", translated: 'Please', pronunciation: 'seel voo PLEH' },
      ],
    },
    {
      id: FEELINGS,
      title: 'Feelings',
      level: 'beginner',
      phrases: [
        { original: 'Heureux / Heureuse', translated: 'Happy', pronunciation: 'uh-RUH / uh-RUHZ' },
        { original: 'Triste', translated: 'Sad', pronunciation: 'treest' },
        { original: 'Anxieux / Anxieuse', translated: 'Anxious', pronunciation: 'ahnk-SYEUH / ahnk-SYEUHZ' },
        { original: 'Calme', translated: 'Calm', pronunciation: 'kalm' },
        { original: 'Fatigué / Fatiguée', translated: 'Tired', pronunciation: 'fah-tee-GEH / fah-tee-GEH' },
        { original: 'Excité / Excitée', translated: 'Excited', pronunciation: 'ek-see-TEH / ek-see-TEH' },
      ],
    },
    {
      id: COMMON,
      title: 'Common phrases',
      level: 'beginner',
      phrases: [
        { original: 'Comment ça va ?', translated: 'How are you?', pronunciation: 'koh-MAHN sah VAH' },
        { original: "J'ai besoin d'aide.", translated: 'I need help.', pronunciation: 'zhay buh-ZWAN dehd' },
        { original: 'Où est ___ ?', translated: 'Where is ___?', pronunciation: 'oo eh' },
        { original: 'Je ne comprends pas.', translated: "I don't understand.", pronunciation: 'zhuh nuh kohn-PRAHN pah' },
      ],
    },
    {
      id: NUMBERS,
      title: 'Numbers (1–10)',
      level: 'beginner',
      phrases: [
        { original: 'Un', translated: '1', pronunciation: 'uhn' },
        { original: 'Deux', translated: '2', pronunciation: 'duh' },
        { original: 'Trois', translated: '3', pronunciation: 'trwah' },
        { original: 'Quatre', translated: '4', pronunciation: 'katr' },
        { original: 'Cinq', translated: '5', pronunciation: 'sank' },
        { original: 'Six', translated: '6', pronunciation: 'sees' },
        { original: 'Sept', translated: '7', pronunciation: 'set' },
        { original: 'Huit', translated: '8', pronunciation: 'weet' },
        { original: 'Neuf', translated: '9', pronunciation: 'nuhf' },
        { original: 'Dix', translated: '10', pronunciation: 'deess' },
      ],
    },
    {
      id: POLITE,
      title: 'Polite phrases',
      level: 'beginner',
      phrases: [
        { original: 'Excusez-moi.', translated: 'Excuse me.', pronunciation: 'ek-skew-ZEH mwah' },
        { original: 'Désolé(e).', translated: 'Sorry.', pronunciation: 'day-zoh-LEH' },
        { original: 'De rien.', translated: "You're welcome.", pronunciation: 'duh ree-EHN' },
      ],
    },
  ],

  mk: [
    {
      id: GREETINGS,
      title: 'Greetings',
      level: 'beginner',
      phrases: [
        { original: 'Здраво', translated: 'Hello', pronunciation: 'ZDRAV-oh' },
        { original: 'Довидување', translated: 'Goodbye', pronunciation: 'doh-vee-DOO-vah-nyeh' },
        { original: 'Благодарам', translated: 'Thank you', pronunciation: 'blah-goh-DAH-rahm' },
        { original: 'Ве молам', translated: 'Please', pronunciation: 'veh MOH-lahm' },
      ],
    },
    {
      id: FEELINGS,
      title: 'Feelings',
      level: 'beginner',
      phrases: [
        { original: 'Среќен / Среќна', translated: 'Happy', pronunciation: 'SREH-kyen / SREH-kyna' },
        { original: 'Тажен / Таžна', translated: 'Sad', pronunciation: 'TAH-zhen / TAH-zhna' },
        { original: 'Вознемирен / Вознемирена', translated: 'Anxious', pronunciation: 'vohz-neh-MEE-ren' },
        { original: 'Смирен / Смирена', translated: 'Calm', pronunciation: 'SMEE-ren' },
        { original: 'Уморен / Уморна', translated: 'Tired', pronunciation: 'OO-moh-ren / OO-moh-rna' },
        { original: 'Возбуден / Возбудена', translated: 'Excited', pronunciation: 'vohz-BOO-den' },
      ],
    },
    {
      id: COMMON,
      title: 'Common phrases',
      level: 'beginner',
      phrases: [
        { original: 'Како си?', translated: 'How are you?', pronunciation: 'KAH-koh see' },
        { original: 'Ми треба помош.', translated: 'I need help.', pronunciation: 'mee TREH-bah POH-mosh' },
        { original: 'Каде е ___?', translated: 'Where is ___?', pronunciation: 'KAH-deh eh' },
        { original: 'Не разбирам.', translated: "I don't understand.", pronunciation: 'neh RAZ-bee-rahm' },
      ],
    },
    {
      id: NUMBERS,
      title: 'Numbers (1–10)',
      level: 'beginner',
      phrases: [
        { original: 'Еден', translated: '1', pronunciation: 'EH-den' },
        { original: 'Два', translated: '2', pronunciation: 'dvah' },
        { original: 'Три', translated: '3', pronunciation: 'tree' },
        { original: 'Четири', translated: '4', pronunciation: 'CHEH-tee-ree' },
        { original: 'Пет', translated: '5', pronunciation: 'peht' },
        { original: 'Шест', translated: '6', pronunciation: 'shest' },
        { original: 'Седум', translated: '7', pronunciation: 'SEH-doom' },
        { original: 'Осум', translated: '8', pronunciation: 'OH-soom' },
        { original: 'Девет', translated: '9', pronunciation: 'DEH-vet' },
        { original: 'Десет', translated: '10', pronunciation: 'DEH-set' },
      ],
    },
    {
      id: POLITE,
      title: 'Polite phrases',
      level: 'beginner',
      phrases: [
        { original: 'Извинете.', translated: 'Excuse me.', pronunciation: 'iz-vee-NEH-teh' },
        { original: 'Жал ми е.', translated: 'Sorry.', pronunciation: 'zhahl mee eh' },
        { original: 'Нема на што.', translated: "You're welcome.", pronunciation: 'NEH-mah nah shtoh' },
      ],
    },
  ],
};

export function getLessonsForLanguage(languageCode: string): Lesson[] {
  return LESSONS_BY_LANGUAGE[languageCode] ?? [];
}
