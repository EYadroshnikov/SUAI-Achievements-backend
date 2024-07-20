import { IssuedAchievementDto } from '../../../achievements/dtos/issued-achievement.dto';

function generateTgIssueMessage(data: IssuedAchievementDto): string {
  const { achievement } = data;

  return `
🏆 Вы получили новое достижение <b>${achievement.name}</b>!
`.trim();
}

export default generateTgIssueMessage;
