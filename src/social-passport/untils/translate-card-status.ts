import { CardStatus } from '../enums/card-status.enum';
import { RuCardStatus } from '../enums/ru-card-status.enum';

const translations: {
  [key in CardStatus]: RuCardStatus;
} = {
  [CardStatus.NO]: RuCardStatus.NO,
  [CardStatus.MANUFACTURED]: RuCardStatus.MANUFACTURED,
  [CardStatus.RECEIVED]: RuCardStatus.RECEIVED,
};

export function translateCardStatus(value: CardStatus): RuCardStatus {
  return translations[value];
}
