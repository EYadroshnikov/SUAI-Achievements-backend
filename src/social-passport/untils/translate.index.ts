import { translateBooleanStatement } from './translate-boolean-statement';
import { translateBskStatus } from './translate-bsk-status';
import { translateCardStatus } from './translate-card-status';
import { translateEducationType } from './translate-education-type';
import { translateGroupRole } from './translate-group-role';
import { translateMilitaryRegistration } from './translate-military-registration';
import { translatePreferentialTravelCard } from './translate-preferential-travel-card';
import { translateRegistrationStage } from './translate-registration-stage';

export const translate = {
  booleanStatement: translateBooleanStatement,
  bskStatus: translateBskStatus,
  cardStatus: translateCardStatus,
  educationType: translateEducationType,
  groupRole: translateGroupRole,
  militaryRegistration: translateMilitaryRegistration,
  preferentialTravelCard: translatePreferentialTravelCard,
  RegistrationStage: translateRegistrationStage,
};
