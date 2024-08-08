import { GroupRole } from '../enums/group-role.enum';
import { RuGroupRole } from '../enums/ru-group-role.enum';

const translations: {
  [key in GroupRole]: RuGroupRole;
} = {
  [GroupRole.LEADER]: RuGroupRole.LEADER,
  [GroupRole.DEPUTY_LEADER]: RuGroupRole.DEPUTY_LEADER,
  [GroupRole.PROF_ORG]: RuGroupRole.PROF_ORG,
  [GroupRole.STUDENT]: RuGroupRole.STUDENT,
};

export function translateGroupRole(value: GroupRole): RuGroupRole {
  return translations[value];
}
