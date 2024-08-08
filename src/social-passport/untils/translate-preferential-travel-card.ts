type TranslationResult = 'Да' | 'Нет' | 'Не льготник';

const translations: {
  [key: string]: TranslationResult;
} = {
  true: 'Да',
  false: 'Нет',
  null: 'Не льготник',
};

export function translatePreferentialTravelCard(
  value: boolean | null,
): TranslationResult {
  return translations[String(value)];
}
