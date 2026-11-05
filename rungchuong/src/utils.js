import { POINTS, RANKS } from './data';

export const normalizeText = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi');

export const calcScore = (answers) =>
  answers
    .filter((answer) => answer.correct)
    .reduce((score, answer) => score + POINTS[answer.level], 0);

export const getRank = (score) =>
  RANKS.find((rank) => score >= rank.min)?.title ?? RANKS[RANKS.length - 1].title;
