type TranslationResult = 'Да' | 'Нет' | '';

const translations: {
  [key: string]: TranslationResult;
} = {
  true: 'Да',
  false: 'Нет',
  null: '',
};

export function translateBooleanStatement(
  value: boolean | null,
): TranslationResult {
  return translations[String(value)];
}
