import { IssuedAchievementDto } from '../../../achievements/dtos/issued-achievement.dto';

function generateVkIssueMessage(data: IssuedAchievementDto): string {
  const { achievement } = data;

  return `
🏆 Вы получили новое достижение ${achievement.name}!
`.trim();
}

export default generateVkIssueMessage;
