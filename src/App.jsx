import { useState } from "react";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Nguyễn Văn A", score: 8.5, class: "CTK45" },
  { id: 2, name: "Trần Thị B", score: 4, class: "CTK45" },
  { id: 3, name: "Lê Minh C", score: 6.5, class: "CTK46" },
];

const filterOptions = [
  { value: "all", label: "Tất cả" },
  { value: "good", label: "Giỏi (≥ 8)" },
  { value: "failed", label: "Trượt (< 5)" },
];

const StudentItem = ({ student, onDelete }) => {
  const result = student.score >= 5 ? "Đạt" : "Trượt";
  const resultClass = student.score >= 5 ? "passed" : "failed";

  return (
    <li className={`student-item ${resultClass}`}>
      <span>
        Họ tên: {student.name} - Điểm: {student.score} ({result}) - Lớp:{" "}
        {student.class}
      </span>
      <button type="button" onClick={() => onDelete(student.id)}>
        Xóa
      </button>
    </li>
  );
};

const StudentList = ({ students, onDelete }) => (
  <ul className="student-list">
    {students.length > 0 ? (
      students.map((student) => (
        <StudentItem key={student.id} student={student} onDelete={onDelete} />
      ))
    ) : (
      <li>Không có sinh viên trong mục này.</li>
    )}
  </ul>
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
    <main className="app">
      <h1>Xin chào!!!</h1>
      <h2>Quản lý điểm sinh viên</h2>

      <form className="student-form" onSubmit={handleSubmit} noValidate>
        <input
          aria-label="Tên sinh viên"
          name="name"
          placeholder="Tên sinh viên"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          aria-label="Điểm số"
          name="score"
          type="number"
          min="0"
          max="10"
          step="0.1"
          placeholder="Điểm số"
          value={formData.score}
          onChange={handleInputChange}
        />
        <input
          aria-label="Lớp"
          name="className"
          placeholder="Lớp"
          value={formData.className}
          onChange={handleInputChange}
        />
        <button type="submit">Thêm sinh viên</button>
      </form>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <section className="student-section" aria-label="Danh sách sinh viên">
        <h3>Danh sách sinh viên</h3>
        <div className="filter-row" aria-label="Lọc sinh viên">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <StudentList students={filteredStudents} onDelete={handleDelete} />
        <p className="statistics">
          Tổng số sinh viên: {students.length} - Điểm trung bình cả lớp:{" "}
          {averageScore.toFixed(2)}
        </p>
      </section>
    </main>
  );
};

export default App;
