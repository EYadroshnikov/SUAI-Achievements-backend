import { IssuedAchievementDto } from '../../../achievements/dtos/issued-achievement.dto';

function generateVkCancelMessage(data: IssuedAchievementDto): string {
  const { achievement, canceler } = data;

  return `
🚩 К сожалению, достижение ${achievement.name} было отменено по причине ${data.cancellationReason}
Отменил: ${canceler.firstName} ${canceler.lastName}
`;
}

export default generateVkCancelMessage;
