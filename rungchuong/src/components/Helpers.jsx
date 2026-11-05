const Helpers = ({
  usedHelpers,
  lifeArmed,
  answerState,
  onUseFiftyFifty,
  onAddTime,
  onArmLifeline,
}) => {
  const disabled = answerState !== 'answering';

  return (
    <section aria-label="Quyền trợ giúp" className="helpers-card">
      <h2>Quyền trợ giúp</h2>
      <div className="helper-list">
        <button
          className="helper-button"
          disabled={disabled || usedHelpers.fiftyFifty}
          onClick={onUseFiftyFifty}
          type="button"
        >
          <span className="helper-symbol" aria-hidden="true">
            ½
          </span>
          <span>
            <strong>Trợ giúp 50-50</strong>
            <small>
              {usedHelpers.fiftyFifty ? 'Đã sử dụng' : 'Ẩn hai đáp án sai'}
            </small>
          </span>
        </button>
        <button
          className="helper-button"
          disabled={disabled || usedHelpers.extraTime}
          onClick={onAddTime}
          type="button"
        >
          <span className="helper-symbol" aria-hidden="true">
            +15
          </span>
          <span>
            <strong>Thêm 15 giây</strong>
            <small>
              {usedHelpers.extraTime ? 'Đã sử dụng' : 'Cộng vào câu hiện tại'}
            </small>
          </span>
        </button>
        <button
          aria-pressed={lifeArmed}
          className={`helper-button${lifeArmed ? ' helper-armed' : ''}`}
          disabled={disabled || usedHelpers.lifeline || lifeArmed}
          onClick={onArmLifeline}
          type="button"
        >
          <span className="helper-symbol" aria-hidden="true">
            ♡
          </span>
          <span>
            <strong>
              {lifeArmed ? 'Phao đang bật' : 'Phao cứu sinh'}
            </strong>
            <small>
              {usedHelpers.lifeline
                ? 'Đã sử dụng'
                : lifeArmed
                  ? 'Bảo vệ câu hiện tại'
                  : 'Bật trước khi chọn đáp án'}
            </small>
          </span>
        </button>
      </div>
    </section>
  );
};

export default Helpers;
