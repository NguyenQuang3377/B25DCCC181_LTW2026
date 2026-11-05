const Timer = ({ timeLeft, totalTime }) => {
  const progress = (timeLeft / totalTime) * 100;

  return (
    <section
      aria-label={`Còn ${timeLeft} giây`}
      className={`timer-card${timeLeft <= 5 ? ' timer-warning' : ''}`}
      role="timer"
    >
      <div className="timer-copy">
        <span>Thời gian còn lại</span>
        <strong aria-live="off">{timeLeft} giây</strong>
      </div>
      <div
        aria-hidden="true"
        className="timer-track"
      >
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
};

export default Timer;
