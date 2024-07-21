import { AchievementDto } from '../../../achievements/dtos/achievement.dto';
import { UserDto } from '../../../users/dtos/user.dto';

function generateVkCancelMessage(
  achievement: AchievementDto,
  canceler: UserDto,
  cancellationReason: string,
): string {
  return `
🚩 К сожалению, достижение ${achievement.name} было отменено по причине ${cancellationReason}
Отменил: ${canceler.firstName} ${canceler.lastName}
`;
}

export default generateVkCancelMessage;
