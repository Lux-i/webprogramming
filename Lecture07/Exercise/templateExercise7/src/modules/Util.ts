export const shuffleArray = <T>(arr: Array<T>): Array<T> => {
  return arr.sort(() => {
    return Math.random() - 0.5;
  });
};
