import { useState } from "react";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Nguyen An", score: 8.5, class: "CTK45" },
  { id: 2, name: "Tran Binh", score: 4.5, class: "CTK45" },
  { id: 3, name: "Le Chi", score: 6.5, class: "CTK46" },
];

const filterOptions = [
  { value: "all", label: "Tất cả" },
  { value: "good", label: "Giỏi (≥ 8)" },
  { value: "failed", label: "Trượt (< 5)" },
];

const SummaryCard = ({ label, value, detail }) => (
  <article className="summary-card">
    <span className="summary-label">{label}</span>
    <strong className="summary-value">{value}</strong>
    <span className="summary-detail">{detail}</span>
  </article>
);

const StudentItem = ({ student, onDelete }) => (
  <tr>
    <td className="student-name">{student.name}</td>
    <td>
      <span
        className={`score-badge ${student.score >= 8 ? "score-good" : student.score < 5 ? "score-low" : "score-average"}`}
      >
        {student.score}
      </span>
    </td>
    <td>{student.class}</td>
    <td className="action-cell">
      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(student.id)}
        aria-label={`Xóa sinh viên ${student.name}`}
      >
        Xóa
      </button>
    </td>
  </tr>
);

const StudentList = ({ students, onDelete }) => (
  <div className="table-scroll">
    <table className="student-table">
      <thead>
        <tr>
          <th>Họ và tên</th>
          <th>Điểm</th>
          <th>Lớp</th>
          <th aria-label="Thao tác"></th>
        </tr>
      </thead>
      <tbody>
        {students.length > 0 ? (
          students.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              onDelete={onDelete}
            />
          ))
        ) : (
          <tr>
            <td className="empty-state" colSpan="4">
              Không có sinh viên trong mục này.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    score: "",
    className: "",
  });
  const [error, setError] = useState("");

  const totalScore = students.reduce((sum, student) => sum + student.score, 0);
  const averageScore = students.length > 0 ? totalScore / students.length : 0;

  const filteredStudents = students.filter((student) => {
    if (filter === "good") return student.score >= 8;
    if (filter === "failed") return student.score < 5;
    return true;
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { name, score, className } = formData;
    const parsedScore = Number(score);

    if (!name.trim() || !className.trim() || score.trim() === "") {
      setError("Vui lòng nhập đầy đủ họ tên, điểm số và lớp.");
      return;
    }

    if (!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      setError("Điểm số phải nằm trong khoảng từ 0 đến 10.");
      return;
    }

    const nextId =
      students.reduce(
        (largestId, student) => Math.max(largestId, student.id),
        0,
      ) + 1;

    setStudents((previousStudents) => [
      ...previousStudents,
      {
        id: nextId,
        name: name.trim(),
        score: parsedScore,
        class: className.trim(),
      },
    ]);
    setFormData({ name: "", score: "", className: "" });
    setError("");
  };

  const handleDelete = (studentId) => {
    setStudents((previousStudents) =>
      previousStudents.filter((student) => student.id !== studentId),
    );
  };

  return (
    <main className="app-shell">
      <header className="page-header">
        <div className="header-inner">
          <a className="brand" href="#main-content" aria-label="Trang chủ">
            <span className="brand-mark">S</span>
            <span>Quản lí sinh viên</span>
          </a>
          <span className="header-caption">QUẢN LÍ ĐIỂM SINH VIÊN</span>
        </div>
      </header>

      <div className="page-content" id="main-content">
        <section className="intro-row">
          <div>
            <p className="eyebrow">HỒ SƠ LỚP HỌC</p>
            <h1 className="page-title">Quản lí sinh viên</h1>
            <p className="page-description">
              Theo dõi danh sách và kết quả học tập của sinh viên.
            </p>
          </div>
          <span className="semester-tag">Năm học 2025–2026</span>
        </section>

        <section className="summary-grid" aria-label="Thống kê toàn lớp">
          <SummaryCard
            label="Tổng sinh viên"
            value={students.length}
            detail="Trong danh sách lớp"
          />
          <SummaryCard
            label="Điểm trung bình"
            value={averageScore.toFixed(2)}
            detail="Tính trên toàn bộ sinh viên"
          />
        </section>

        <div className="workspace-grid">
          <section className="form-panel" aria-labelledby="form-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CẬP NHẬT HỒ SƠ</p>
                <h2 id="form-title">Thêm sinh viên</h2>
              </div>
            </div>

            <form className="student-form" onSubmit={handleSubmit} noValidate>
              <label className="field-label" htmlFor="student-name">
                Họ và tên
              </label>
              <input
                id="student-name"
                name="name"
                type="text"
                placeholder="Ví dụ: Nguyen Van A"
                value={formData.name}
                onChange={handleInputChange}
              />

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="student-score">
                    Điểm số
                  </label>
                  <input
                    id="student-score"
                    name="score"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="0–10"
                    value={formData.score}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="student-class">
                    Lớp
                  </label>
                  <input
                    id="student-class"
                    name="className"
                    type="text"
                    placeholder="Ví dụ: CTK45"
                    value={formData.className}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <button className="submit-button" type="submit">
                Thêm sinh viên
              </button>
            </form>
          </section>

          <section className="list-panel" aria-labelledby="list-title">
            <div className="list-heading">
              <div>
                <p className="eyebrow">DANH SÁCH LỚP</p>
                <h2 id="list-title">Sinh viên</h2>
              </div>
              <span className="count-label">
                {filteredStudents.length} kết quả
              </span>
            </div>

            <div className="filter-row" aria-label="Lọc sinh viên">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className={`filter-button ${filter === option.value ? "filter-active" : ""}`}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <StudentList students={filteredStudents} onDelete={handleDelete} />
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
