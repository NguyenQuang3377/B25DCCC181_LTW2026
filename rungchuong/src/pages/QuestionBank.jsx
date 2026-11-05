import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { LEVELS, TOPICS } from '../data';
import { normalizeText } from '../utils';

const QuestionBank = () => {
  const { questions, loading, error, retryLoadingQuestions } =
    useOutletContext();
  const [topicFilter, setTopicFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = normalizeText(searchText.trim());

    return questions.filter((question) => {
      const matchesTopic =
        topicFilter === 'all' || question.topic === topicFilter;
      const searchableText = normalizeText(question.question);
      const matchesSearch =
        normalizedSearch === '' || searchableText.includes(normalizedSearch);

      return matchesTopic && matchesSearch;
    });
  }, [questions, searchText, topicFilter]);

  return (
    <section className="question-bank-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ÔN TẬP KIẾN THỨC</p>
          <h1>Ngân hàng câu hỏi</h1>
          <p className="page-description">
            Lọc theo chủ đề hoặc tìm nhanh nội dung câu hỏi.
          </p>
        </div>
        {!loading && !error && (
          <span className="result-count">
            Có {filteredQuestions.length} câu hỏi
          </span>
        )}
      </div>

      <div className="filter-panel">
        <label className="filter-field">
          <span>Chủ đề</span>
          <select
            value={topicFilter}
            onChange={(event) => setTopicFilter(event.target.value)}
          >
            <option value="all">Tất cả</option>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field search-field">
          <span>Tìm kiếm</span>
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Nhập nội dung câu hỏi..."
          />
        </label>
      </div>

      {loading && (
        <div className="state-panel" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Đang tải câu hỏi...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-panel state-error" role="alert">
          <h2>Không tải được câu hỏi</h2>
          <p>{error}</p>
          <button
            className="button button-secondary"
            onClick={retryLoadingQuestions}
            type="button"
          >
            Thử tải lại
          </button>
        </div>
      )}

      {!loading && !error && filteredQuestions.length > 0 && (
        <div className="table-scroll">
          <table className="question-table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Chủ đề</th>
                <th scope="col">Mức độ</th>
                <th scope="col">Câu hỏi</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  <td>{question.topic}</td>
                  <td>
                    <span className={`level-badge level-${question.level}`}>
                      {LEVELS[question.level]}
                    </span>
                  </td>
                  <td>
                    <Link
                      className="question-table-link"
                      to={`/questions/${question.id}`}
                    >
                      {question.question}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredQuestions.length === 0 && (
        <div className="state-panel">
          <h2>Không tìm thấy câu hỏi phù hợp</h2>
          <p>Thử đổi chủ đề, mức độ hoặc từ khóa tìm kiếm.</p>
        </div>
      )}
    </section>
  );
};

export default QuestionBank;
