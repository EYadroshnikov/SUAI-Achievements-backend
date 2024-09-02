import { BskStatus } from '../enums/bsk-status.enum';
import { RuBskStatus } from '../enums/ru-bsk-status.enum';

const translations: {
  [key in BskStatus]: RuBskStatus;
} = {
  [BskStatus.NO]: RuBskStatus.NO,
  [BskStatus.WAITING]: RuBskStatus.WAITING,
  [BskStatus.RECEIVED]: RuBskStatus.RECEIVED,
};

export function translateBskStatus(value: BskStatus): RuBskStatus {
  return translations[value];
}
