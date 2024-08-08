type TranslationResult = 'Да' | 'Нет' | 'Девушка';

const translations: {
  [key: string]: TranslationResult;
} = {
  true: 'Да',
  false: 'Нет',
  null: 'Девушка',
};

export function translateMilitaryRegistration(
  value: boolean | null,
): TranslationResult {
  return translations[String(value)];
}
