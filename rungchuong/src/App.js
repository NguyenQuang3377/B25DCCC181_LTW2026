import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import NotFound from './pages/NotFound';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuestions = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/data/questions.json', {
          signal: controller.signal,
        });
        setQuestions(response.data);
      } catch (requestError) {
        if (!controller.signal.aborted && !axios.isCancel(requestError)) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Đã xảy ra lỗi khi tải câu hỏi.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => controller.abort();
  }, [reloadToken]);

  const retryLoadingQuestions = () => {
    setReloadToken((currentToken) => currentToken + 1);
  };

  const outletContext = {
    questions,
    loading,
    error,
    retryLoadingQuestions,
  };

  return (
    <Routes>
      <Route path="/" element={<Layout outletContext={outletContext} />}>
        <Route index element={<Home />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="questions/:id" element={<QuestionDetail />} />
        <Route path="history" element={<History />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
