import { LETTERS } from '../data';

const AnswerButton = ({
  index,
  option,
  selected,
  correct,
  revealed,
  disabled,
  hidden,
  onSelect,
}) => {
  let stateClass = '';
  if (hidden) {
    stateClass = 'answer-hidden';
  } else if (selected && !revealed) {
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
      aria-label={
        hidden ? `Đáp án ${LETTERS[index]} đã bị loại` : undefined
      }
      className={`quiz-answer ${stateClass}`}
      disabled={disabled || hidden}
      onClick={() => onSelect(index)}
      type="button"
    >
      <span className="quiz-answer-letter">{LETTERS[index]}</span>
      <span className="quiz-answer-text">{hidden ? 'Đã loại' : option}</span>
    </button>
  );
};

export default AnswerButton;
