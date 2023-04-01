export function shuffle(array: string[]) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export function generateAnswersExample(answersQuantity: number): string {
  return Array.from({ length: answersQuantity }, (_, i) => `answer${i}`).join(
    ',',
  );
}
