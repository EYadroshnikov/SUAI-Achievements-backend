function formatScoreWord(balance: number) {
  if (balance % 10 === 1 && balance % 100 !== 11) {
    return `балл`;
  } else if (
    balance % 10 >= 2 &&
    balance % 10 <= 4 &&
    (balance % 100 < 10 || balance % 100 >= 20)
  ) {
    return `балла`;
  } else {
    return `баллов`;
  }
}

export default formatScoreWord;
