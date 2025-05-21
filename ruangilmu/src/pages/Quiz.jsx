import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../components/img/logo ruangilmu.svg'

const QuizApp = () => {
  const { moduleid: moduleId } = useParams();
  const { courseid: courseId } = useParams();
  const navigate = useNavigate();
  // Quiz data state
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Current question state
  const [currentQuestion, setCurrentQuestion] = useState(1);

  // Track answered and flagged questions
  const [questionStatus, setQuestionStatus] = useState({});

  // Fetch quiz data from API
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:8000/course/${courseId}/module/${moduleId}/quiz`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }

        const result = await response.json();

        if (result.status === 'success') {
          setQuizData(result.data.quiz);

          // Initialize timer with quiz time limit (converting minutes to seconds)
          setTimeLeft(result.data.quiz.time_limit * 60);

          // Initialize question status based on number of questions
          const initialStatus = {};
          result.data.quiz.questions.forEach((question, index) => {
            initialStatus[index + 1] = {
              answered: false,
              flagged: false,
              selected: null,
              questionId: question.question_id,
              optionId: null
            };
          });
          setQuestionStatus(initialStatus);
        } else {
          throw new Error('Error in API response');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [moduleId]);

  // Prepare answers for submission
  const prepareAnswersForSubmission = () => {
    const answers = Object.values(questionStatus)
      .filter(q => q.answered && q.optionId !== null)
      .map(q => ({
        questionId: q.questionId,
        optionId: q.optionId
      }));

    return answers;
  };

  // Submit quiz to API
  const submitQuiz = async () => {
    try {
      const answers = prepareAnswersForSubmission();

      const response = await fetch(`http://localhost:8000/course/${courseId}/module/${moduleId}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      if (result.status === 'success') {
        // Navigate to module page after successful submission
        navigate(`/modul/${courseId}`);
      } else {
        throw new Error(result.message || 'Error submitting quiz');
      }
    } catch (err) {
      alert(`Error submitting quiz: ${err.message}`);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          alert('Waktu sudah habis! Kuis akan dikirim otomatis.');
          submitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Scroll detection for fixed timer
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex) => {
    const currentQuestionData = quizData.questions[currentQuestion - 1];
    const selectedOptionId = currentQuestionData.options[optionIndex].quiz_option_id;

    setQuestionStatus(prev => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        answered: true,
        flagged: false,
        selected: optionIndex,
        optionId: selectedOptionId
      }
    }));
  };


  // const markModuleAsCompleted = async (moduleId) => {
  //   try {
  //     // First, fetch the latest quiz results to check if the user has passed
  //     const quizResponse = await fetch(`http://localhost:8000/course/${courseId}/module/${moduleId}/quiz`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //       }
  //     });

  //     if (!quizResponse.ok) {
  //       throw new Error('Failed to fetch quiz results');
  //     }

  //     const quizResult = await quizResponse.json();

  //     // Check if the user has passed the quiz
  //     if (quizResult.data.previousResult &&
  //       quizResult.data.previousResult.score >= quizResult.data.quiz.pass_score) {

  //       // User has passed, now mark the module as completed
  //       const completeResponse = await fetch(`http://localhost:8000/course/${courseId}/module/${moduleId}/complete`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //         }
  //       });

  //       if (!completeResponse.ok) {
  //         throw new Error('Failed to mark module as completed');
  //       }

  //       // Update the local state to reflect completion
  //       if (moduleContent) {
  //         setModuleContent({
  //           ...moduleContent,
  //           isCompleted: true
  //         });
  //       }

  //       return { success: true, message: 'Module marked as completed' };
  //     } else {
  //       // User has not passed the quiz
  //       return {
  //         success: false,
  //         message: 'You need to pass the quiz before completing this module'
  //       };
  //     }
  //   } catch (error) {
  //     console.error('Error in module completion process:', error);
  //     return { success: false, message: error.message };
  //   } finally {
      
  //   }
  // };

  // Handle question navigation
  const handleQuestionNavigation = (questionNum) => {
    setCurrentQuestion(questionNum);
  };

  // Handle question flagging
  const handleFlagQuestion = () => {
    setQuestionStatus(prev => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        flagged: !prev[currentQuestion].flagged
      }
    }));
  };

  // // Handle next and previous navigation
  // const handleNextQuestion = () => {
  //   if (currentQuestion < 10) {
  //     setCurrentQuestion(currentQuestion + 1);
  //   }
  // };

  // const handlePreviousQuestion = () => {
  //   if (currentQuestion > 1) {
  //     setCurrentQuestion(currentQuestion - 1);
  //   }
  // };

  const handleNextQuestion = () => {
    if (quizData && currentQuestion < quizData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!quizData) return 0;
    return (currentQuestion / quizData.questions.length) * 100;
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    // Logic to submit quiz answers could be added here
    const answeredCount = Object.values(questionStatus).filter(q => q.answered).length;

    if (answeredCount < Object.keys(questionStatus).length) {
      const confirmSubmit = window.confirm(`Anda belum menjawab semua pertanyaan (${answeredCount}/${Object.keys(questionStatus).length}). Apakah Anda yakin ingin mengirim?`);
      if (!confirmSubmit) return;
    }

    submitQuiz();
    // markModuleAsCompleted();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return null;
  }

  // Get current question data
  const currentQuestionData = quizData.questions[currentQuestion - 1];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <div className="bg-[#D2E6E4] shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="home.html" className="flex items-center space-x-2">
            <img src={logo} alt="RuangIlmu Logo" className="h-10" />
            <span className="text-2xl font-extrabold text-[#026078]">RuangIlmu</span>
          </a>
          <div className="flex items-center space-x-4">
            <div className="timer px-4 py-2 font-bold flex items-center bg-white bg-opacity-80 rounded-full bg-red-50 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Fixed timer when scrolled */}
      {isScrolled && (
        <div className="fixed top-4 right-4 z-50 timer px-4 py-2 font-bold flex items-center bg-red-50 text-red-600 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{formatTime(timeLeft)}</span>
        </div>
      )}

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Quiz Content */}
          <div className="lg:w-2/3">
            {/* Quiz Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#026078]">{quizData.title}</h1>
                <p className="text-gray-600">{quizData.description}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-sm font-medium text-gray-600 mb-1">Progress</div>
                <div className="flex items-center">
                  <div className="h-2.5 rounded-full bg-gray-200 w-40 mr-2">
                    <div
                      className="h-full rounded-full bg-[#0B7077] transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-[#026078]">{currentQuestion}/{quizData.questions.length}</span>
                </div>
              </div>
            </div>

            {/* Quiz Container */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              {/* Question */}
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#0B7077] text-white flex items-center justify-center font-bold mr-4">
                  {currentQuestion}
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {currentQuestionData.question_text}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={option.quiz_option_id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:border-[#0B7077] hover:bg-[#f0f9ff] ${questionStatus[currentQuestion]?.selected === index
                      ? 'border-[#0B7077] bg-[#e6f7ff]'
                      : 'border-gray-200'
                      }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center ${questionStatus[currentQuestion]?.selected === index
                        ? 'border-[#0B7077]'
                        : 'border-gray-300'
                        }`}>
                        {questionStatus[currentQuestion]?.selected === index && (
                          <div className="w-3 h-3 rounded-full bg-[#0B7077]"></div>
                        )}
                      </div>
                      <span className="font-medium">{option.option_text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                disabled={currentQuestion === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sebelumnya
              </button>

              {currentQuestion < quizData.questions.length ? (
                <button
                  onClick={handleNextQuestion}
                  className="bg-[#0B7077] hover:bg-[#014b60] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  Selanjutnya
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  Selesai
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Question Navigation Panel */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-5">
              <h3 className="text-lg font-bold text-[#026078] mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5z" clipRule="evenodd" />
                  <path d="M8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                </svg>
                Navigasi Soal
              </h3>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                {quizData.questions.map((_, index) => {
                  const questionNum = index + 1;
                  const status = questionStatus[questionNum] || { answered: false, flagged: false };

                  let className = "w-10 h-10 flex items-center justify-center font-semibold rounded-lg cursor-pointer transition-all";

                  if (currentQuestion === questionNum) {
                    className += " bg-[#0B7077] text-white";
                  } else if (status.answered) {
                    className += " bg-green-500 text-white";
                  } else if (status.flagged) {
                    className += " bg-yellow-400 text-white";
                  } else {
                    className += " bg-gray-100 text-gray-600 hover:bg-gray-200";
                  }

                  return (
                    <div
                      key={questionNum}
                      className={className}
                      onClick={() => handleQuestionNavigation(questionNum)}
                    >
                      {questionNum}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#0B7077] mr-2"></div>
                  <span>Sedang dikerjakan</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Sudah dijawab</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
                  <span>Ditandai</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
                  <span>Belum dikerjakan</span>
                </div>
              </div>

              {/* Flag Current Question Button */}
              <button
                onClick={handleFlagQuestion}
                className={`mt-6 w-full flex items-center justify-center py-2 px-4 border rounded-lg transition-colors ${questionStatus[currentQuestion]?.flagged
                  ? 'border-yellow-400 text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                  : 'border-[#0B7077] text-[#0B7077] hover:bg-[#f0f9ff]'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 mr-2 ${questionStatus[currentQuestion]?.flagged ? 'text-yellow-500' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
                {questionStatus[currentQuestion]?.flagged ? 'Hapus Tanda' : 'Tandai Soal Ini'}
              </button>

              {/* Submit Quiz Button */}
              <button
                onClick={handleSubmitQuiz}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selesai & Kirim Jawaban
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#D2E6E4] py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src={logo} alt="RuangIlmu Logo" className="h-8" />
              <span className="text-xl font-extrabold text-[#026078]">RuangIlmu</span>
            </div>
            <p className="text-[#026078] text-sm">© 2023 RuangIlmu. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuizApp;