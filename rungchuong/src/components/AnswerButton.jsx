import { LETTERS } from '../data';

const AnswerButton = ({
  index,
  option,
  selected,
  correct,
  revealed,
  disabled,
  onSelect,
}) => {
  let stateClass = '';
  if (selected && !revealed) {
    stateClass = 'answer-locked';
  } else if (revealed && correct) {
    stateClass = 'answer-correct';
  } else if (revealed && selected && !correct) {
    stateClass = 'answer-wrong';
  } else if (disabled) {
    stateClass = 'answer-disabled';
  }

  return (
    <button
      aria-pressed={selected}
      className={`quiz-answer ${stateClass}`}
      disabled={disabled}
      onClick={() => onSelect(index)}
      type="button"
    >
      <span className="quiz-answer-letter">{LETTERS[index]}</span>
      <span className="quiz-answer-text">{option}</span>
    </button>
  );
};

export default AnswerButton;
