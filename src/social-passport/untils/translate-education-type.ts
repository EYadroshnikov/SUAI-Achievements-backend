import { EducationType } from '../enums/education-type.enum';
import { RuEducationType } from '../enums/ru-education-type.enum';

const translations: {
  [key in EducationType]: RuEducationType;
} = {
  [EducationType.BUDGET]: RuEducationType.BUDGET,
  [EducationType.CONTRACT]: RuEducationType.BUDGET,
};

export function translateEducationType(value: EducationType): RuEducationType {
  return translations[value];
}
