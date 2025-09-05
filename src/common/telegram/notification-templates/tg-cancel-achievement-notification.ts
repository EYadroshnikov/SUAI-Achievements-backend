import { AchievementDto } from '../../../achievements/dtos/achievement.dto';
import { UserDto } from '../../../users/dtos/user.dto';

function generateTgCancelMessage(
  achievement: AchievementDto,
  canceler: UserDto,
  cancellationReason: string,
): string {
  return `
🚩 Ха, попался, дебилка! достижение <b>${achievement.name}</b> было отменено по причине <b>${cancellationReason}</b>
<b>Отменил:</b> ${canceler.firstName} ${canceler.lastName}
`;
}

export default generateTgCancelMessage;
