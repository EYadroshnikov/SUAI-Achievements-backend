import { RuRegistrationStage } from '../enums/ru-registration-stage.enum';
import { RegistrationStage } from '../enums/registration-stage.enum';

const translations: {
  [key in RegistrationStage]: RuRegistrationStage;
} = {
  [RegistrationStage.NOT_STARTED]: RuRegistrationStage.NOT_STARTED,
  [RegistrationStage.NOT_ENOUGH_DOCS]: RuRegistrationStage.NOT_ENOUGH_DOCS,
  [RegistrationStage.FINISHED]: RuRegistrationStage.FINISHED,
};

export function translateRegistrationStage(
  value: RegistrationStage,
): RuRegistrationStage {
  return translations[value];
}
