import { useState, useEffect } from 'react';
import logo from '../components/img/logo ruangilmu.svg'

const QuizApp = () => {
  // State for timer
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Current question state
  const [currentQuestion, setCurrentQuestion] = useState(1);
  
  // Track answered and flagged questions
  const [questionStatus, setQuestionStatus] = useState({
    1: { answered: false, flagged: false, selected: null },
    2: { answered: true, flagged: false, selected: null },
    3: { answered: false, flagged: true, selected: null },
    4: { answered: false, flagged: false, selected: null },
    5: { answered: false, flagged: false, selected: null },
    6: { answered: false, flagged: false, selected: null },
    7: { answered: false, flagged: false, selected: null },
    8: { answered: false, flagged: false, selected: null },
    9: { answered: false, flagged: false, selected: null },
    10: { answered: false, flagged: false, selected: null },
  });
  
  // Sample quiz questions
  const questions = [
    {
      id: 1,
      question: "Berapakah hasil dari 125 + 37?",
      options: ["152", "162", "172", "182"],
      correctAnswer: "162"
    },
    // More questions would be added here
  ];

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          alert('Waktu sudah habis! Kuis akan dikirim otomatis.');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    setQuestionStatus(prev => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        answered: true,
        flagged: false,
        selected: optionIndex
      }
    }));
  };

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
  
  // Handle next and previous navigation
  const handleNextQuestion = () => {
    if (currentQuestion < 10) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

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
                <h1 className="text-3xl font-bold text-[#026078]">Kuis Akhir: Matematika Dasar</h1>
                <p className="text-gray-600">Jawab semua pertanyaan dengan benar!</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-sm font-medium text-gray-600 mb-1">Progress</div>
                <div className="flex items-center">
                  <div className="h-2.5 rounded-full bg-gray-200 w-40 mr-2">
                    <div 
                      className="h-full rounded-full bg-[#0B7077] transition-all duration-300"
                      style={{width: `${(currentQuestion / 10) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-[#026078]">{currentQuestion}/10</span>
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
                  {questions[0].question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {questions[0].options.map((option, index) => (
                  <div 
                    key={index}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:border-[#0B7077] hover:bg-[#f0f9ff] ${
                      questionStatus[currentQuestion].selected === index 
                        ? 'border-[#0B7077] bg-[#e6f7ff]' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center ${
                        questionStatus[currentQuestion].selected === index 
                          ? 'border-[#0B7077]' 
                          : 'border-gray-300'
                      }`}>
                        {questionStatus[currentQuestion].selected === index && (
                          <div className="w-3 h-3 rounded-full bg-[#0B7077]"></div>
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
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
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sebelumnya
              </button>
              <button
                onClick={handleNextQuestion}
                className="bg-[#0B7077] hover:bg-[#014b60] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                Selanjutnya
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
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
                {[...Array(10)].map((_, index) => {
                  const questionNum = index + 1;
                  const status = questionStatus[questionNum];
                  
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
                className={`mt-6 w-full flex items-center justify-center py-2 px-4 border rounded-lg transition-colors ${
                  questionStatus[currentQuestion].flagged
                    ? 'border-yellow-400 text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                    : 'border-[#0B7077] text-[#0B7077] hover:bg-[#f0f9ff]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 mr-2 ${questionStatus[currentQuestion].flagged ? 'text-yellow-500' : ''}`}
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
                {questionStatus[currentQuestion].flagged ? 'Hapus Tanda' : 'Tandai Soal Ini'}
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