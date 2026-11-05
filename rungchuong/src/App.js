import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import NotFound from './pages/NotFound';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import Play from './pages/Play';
import Result from './pages/Result';
import { HISTORY_STORAGE_KEY } from './data';
import { getRank, readHistory } from './utils';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [historyState, setHistoryState] = useState(readHistory);
  const [historyError, setHistoryError] = useState(historyState.error);
  const historyNeedsSave = useRef(false);

  useEffect(() => {
    if (!historyNeedsSave.current) {
      return;
    }

    try {
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(historyState.history),
      );
      setHistoryError('');
      historyNeedsSave.current = false;
    } catch (storageError) {
      setHistoryError(
        storageError instanceof Error
          ? storageError.message
          : 'Không thể lưu lịch sử vào bộ nhớ trình duyệt.',
      );
    }
  }, [historyState.history]);

  const addHistoryEntry = useCallback((entry) => {
    historyNeedsSave.current = true;
    setHistoryState((currentState) => ({
      history: [entry, ...currentState.history],
      error: '',
    }));
  }, []);

  const clearHistory = useCallback(() => {
    historyNeedsSave.current = true;
    setHistoryState({ history: [], error: '' });
  }, []);

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
    playerName,
    setPlayerName,
    history: historyState.history,
    historyError,
    addHistoryEntry,
    clearHistory,
    getHighScore: () =>
      historyState.history.reduce(
        (highest, entry) => Math.max(highest, entry.score),
        0,
      ),
    getHighScoreName: () =>
      historyState.history.find(
        (entry) =>
          entry.score ===
          historyState.history.reduce(
            (highest, current) => Math.max(highest, current.score),
            0,
          ),
      )?.name ?? '',
    getRank,
  };

  return (
    <Routes>
      <Route path="/" element={<Layout outletContext={outletContext} />}>
        <Route index element={<Home />} />
        <Route path="play" element={<Play />} />
        <Route path="result" element={<Result />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="questions/:id" element={<QuestionDetail />} />
        <Route path="history" element={<History />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
