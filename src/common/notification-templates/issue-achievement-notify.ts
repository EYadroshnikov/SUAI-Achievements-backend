import { IssuedAchievementDto } from '../../achievements/dtos/issued-achievement.dto';

function generateMessage(data: IssuedAchievementDto): string {
  const { achievement, issuer } = data;
  let rewardWord: string;
  if (achievement.reward % 10 === 1 && achievement.reward % 100 !== 11) {
    rewardWord = `${achievement.reward} балл`;
  } else if (
    achievement.reward % 10 >= 2 &&
    achievement.reward % 10 <= 4 &&
    (achievement.reward % 100 < 10 || achievement.reward % 100 >= 20)
  ) {
    rewardWord = `${achievement.reward} балла`;
  } else {
    rewardWord = `${achievement.reward} баллов`;
  }

  return `
🏆 Вы получили новое достижение <b>${achievement.name}</b> и заработали <b>${rewardWord}</b>!
`.trim();
}

export default generateMessage;
