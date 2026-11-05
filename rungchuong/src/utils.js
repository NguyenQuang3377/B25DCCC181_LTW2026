import { HISTORY_STORAGE_KEY, POINTS, RANKS } from './data';

export const normalizeText = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi');

export const calcScore = (answers) =>
  answers
    .filter((answer) => answer.correct)
    .reduce(
      (score, answer) =>
        score + POINTS[answer.level] + (answer.speedBonus || 0),
      0,
    );

export const getRank = (score) =>
  RANKS.find((rank) => score >= rank.min)?.title ?? RANKS[RANKS.length - 1].title;

export const shuffleArray = (items) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

export const shuffleQuestionOptions = (question) => {
  const options = shuffleArray(
    question.options.map((text, index) => ({
      text,
      correct: index === question.answer,
    })),
  );

  return {
    ...question,
    options: options.map((option) => option.text),
    answer: options.findIndex((option) => option.correct),
  };
};

export const readHistory = () => {
  try {
    const storedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!storedHistory) {
      return { history: [], error: '' };
    }

    const parsedHistory = JSON.parse(storedHistory);
    if (
      !Array.isArray(parsedHistory) ||
      parsedHistory.some(
        (entry) =>
          !entry ||
          typeof entry.id !== 'string' ||
          typeof entry.name !== 'string' ||
          typeof entry.score !== 'number' ||
          typeof entry.rank !== 'string' ||
          typeof entry.correctCount !== 'number' ||
          typeof entry.playedAt !== 'string',
      )
    ) {
      throw new Error('Dữ liệu lịch sử không đúng định dạng.');
    }

    return {
      history: parsedHistory.map((entry) => ({
        ...entry,
        name: entry.name.normalize('NFC'),
      })),
      error: '',
    };
  } catch (error) {
    return {
      history: [],
      error:
        error instanceof Error
          ? error.message
          : 'Không thể đọc lịch sử từ bộ nhớ trình duyệt.',
    };
  }
};
