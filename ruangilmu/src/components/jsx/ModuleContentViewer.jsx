import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../utils/authMiddleware';
import PopupModal from './Popup';

const ModuleContentViewer = ({ onModuleChange }) => {
  const { id: courseId } = useParams();

  const [moduleContent, setModuleContent] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showFinalTest, setShowFinalTest] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [isCheckingCertificate, setIsCheckingCertificate] = useState(false);
  const [finalExamResult, setFinalExamResult] = useState(null);
  const [passingGrade, setPassingGrade] = useState(null);
  const [showQuizRequiredPopup, setShowQuizRequiredPopup] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'quiz' or 'finalExam'
  const [modalConfig, setModalConfig] = useState({
    message: '',
    confirmText: 'Ya',
    cancelText: 'Batal'
  });
  const navigate = useNavigate();

  // Notify parent component when current module changes
  const notifyModuleChange = (moduleId) => {
    if (onModuleChange && moduleId) {
      onModuleChange(moduleId);
    }
  };

  // Fetch list of all modules for this course
  useEffect(() => {
    const fetchModulesList = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.get(`http://ruangilmu.up.railway.app/course/${courseId}/module`);

        if (!response.ok) {
          throw new Error('Failed to fetch modules list');
        }

        const data = await response.json();
        setModulesList(data.data);

        // If we have modules, find the first uncompleted module
        if (data.data && data.data.length > 0) {
          // First check if any modules exist
          await loadFirstUncompletedModule(data.data);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching modules list:', error);
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchModulesList();
    }
  }, [courseId]);

  useEffect(() => {
    // Check final exam status
    const checkFinalExamStatus = async () => {
      setIsCheckingCertificate(true);
      try {
        const response = await apiService.get(`http://ruangilmu.up.railway.app/course/${courseId}/final-exam`);

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data) {
            const previousResult = data.data.previousResult;
            console.log("DUA: ", data.data.previousResult);
            const minScore = data.data.exam.pass_score;

            setFinalExamResult(previousResult);
            setPassingGrade(minScore);

            if (previousResult === null) {

            } else if (previousResult.passed === true) {
              const hasCertificate = await checkCertificateStatus();
              if (!hasCertificate) {
                setShowFinalTest(true);
              }
              return;

            } else {
              // Failed, show final test with previous result
              setShowFinalTest(true);
            }
            return true;
          }
        }

        // If response is not ok or no data, default to basic state
        setFinalExamResult(null);
      } catch (error) {
        console.error('Error checking final exam status:', error);
        setFinalExamResult(null);
      } finally {
        setIsCheckingCertificate(false);
      }
    };

    checkFinalExamStatus();
  }, [courseId]);

  // Check certificate status
  const checkCertificateStatus = async () => {
    setIsCheckingCertificate(true);
    try {
      const response = await apiService.get(`http://ruangilmu.up.railway.app/course/${courseId}/certificate`);

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setCertificateData(data.data);
          return true; // Certificate exists
        }
      }

      setCertificateData(null);
      return false; // No certificate
    } catch (error) {
      console.error('Error checking certificate status:', error);
      setCertificateData(null);
      return false;
    } finally {
      setIsCheckingCertificate(false);
    }
  };

  // Load the first uncompleted module
  const loadFirstUncompletedModule = async (modules) => {
    // Start with the first module
    let moduleToLoad = modules[0];
    let moduleIndex = 0;

    // Check each module in sequence until we find an uncompleted one
    for (let i = 0; i < modules.length; i++) {
      const currentModule = modules[i];

      // Check if this module is completed by fetching its content
      try {
        const moduleData = await fetchModuleDetails(currentModule.module_id);

        // If this module is not completed, use it
        if (!moduleData.isCompleted) {
          moduleToLoad = currentModule;
          moduleIndex = i;
          setModuleContent(moduleData);
          setCurrentModuleIndex(i);
          setCurrentContentIndex(0);

          // Notify parent about the current module
          notifyModuleChange(currentModule.module_id);

          // If module has quiz, fetch quiz data
          if (moduleData.hasQuiz) {
            await fetchQuizData(currentModule.module_id, moduleData);
          } else {
            setQuizResult(null);
          }

          break;
        }

        // If this was the last module and it's completed, just show it
        if (i === modules.length - 1) {
          setModuleContent(moduleData);
          setCurrentModuleIndex(i);
          setCurrentContentIndex(0);

          // Notify parent about the current module
          notifyModuleChange(currentModule.module_id);

          if (moduleData.hasQuiz) {
            await fetchQuizData(currentModule.module_id, moduleData);
          } else {
            setQuizResult(null);
          }
        }
      } catch (error) {
        console.error(`Error checking module ${currentModule.module_id}:`, error);
        // If there's an error, default to first module
        await fetchModuleContent(modules[0].module_id);
        break;
      }
    }

    setIsLoading(false);
  };

  // Helper function to fetch module details without changing state
  const fetchModuleDetails = async (moduleId) => {
    const response = await apiService.get(`http://ruangilmu.up.railway.app/course/${courseId}/module/${moduleId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch module content');
    }

    const data = await response.json();
    return data.data;
  };

  // Fetch specific module content and update state
  const fetchModuleContent = async (moduleId) => {
    setIsLoading(true);

    try {
      const moduleData = await fetchModuleDetails(moduleId);

      // Store module content
      setModuleContent(moduleData);

      // Update current module index
      const index = modulesList.findIndex(module => module.module_id === moduleId);
      if (index !== -1) {
        setCurrentModuleIndex(index);
      }

      // Notify parent about the current module change
      notifyModuleChange(moduleId);

      // After setting module content, fetch quiz data if needed
      if (moduleData.hasQuiz) {
        await fetchQuizData(moduleId, moduleData);
      } else {
        setQuizResult(null);
      }

      setCurrentContentIndex(0); // Reset to first content when changing modules
    } catch (error) {
      console.error('Error fetching module content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch quiz data for the current module
  const fetchQuizData = async (moduleId, currentModuleData = null) => {
    try {
      const response = await apiService.get(`http://ruangilmu.up.railway.app/course/${courseId}/module/${moduleId}/quiz`);

      if (!response.ok) {
        throw new Error('Failed to fetch quiz data');
      }

      const data = await response.json();
      setQuizResult(data.data.previousResult);

      // Use either the passed module data or the current state
      const moduleData = currentModuleData || moduleContent;

      // Check if there's a previous quiz result and it meets the pass score
      if (data.data.previousResult &&
        data.data.previousResult.score >= data.data.quiz.pass_score &&
        moduleData && !moduleData.isCompleted) {
        // If passed quiz but module not yet marked as completed
        await markModuleAsCompleted(moduleId);
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setQuizResult(null);
    }
  };

  // Mark current module as completed
  const markModuleAsCompleted = async (moduleId) => {
    setIsCompleting(true);
    try {
      const response = await apiService.post(`http://ruangilmu.up.railway.app/course/${courseId}/module/${moduleId}/complete`, {});

      if (!response.ok) {
        throw new Error('Failed to mark module as completed');
      }

      // Update the local state to reflect completion
      setModuleContent(prevContent => {
        if (prevContent) {
          return {
            ...prevContent,
            isCompleted: true
          };
        }
        return prevContent;
      });

      console.log('Module marked as completed');
    } catch (error) {
      console.error('Error marking module as completed:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  // Navigate to the next uncompleted module after completing current one
  const moveToNextUncompletedModule = async () => {
    // Start checking from the module after current one
    for (let i = currentModuleIndex + 1; i < modulesList.length; i++) {
      const moduleId = modulesList[i].module_id;
      try {
        const moduleData = await fetchModuleDetails(moduleId);
        if (!moduleData.isCompleted) {
          // Found an uncompleted module, load it
          await fetchModuleContent(moduleId);
          return true;
        }
      } catch (error) {
        console.error(`Error checking module ${moduleId}:`, error);
      }
    }

    // If we get here, we couldn't find an uncompleted module
    return false;
  };

  // Check if all modules are completed
  const checkAllModulesCompleted = async () => {
    for (let i = 0; i < modulesList.length; i++) {
      const moduleId = modulesList[i].module_id;
      try {
        const moduleData = await fetchModuleDetails(moduleId);
        if (!moduleData.isCompleted) {
          return false;
        }
      } catch (error) {
        console.error(`Error checking module ${moduleId}:`, error);
        return false;
      }
    }
    return true;
  };

  // Navigate to the previous content or module
  const handlePrevContent = () => {
    if (currentContentIndex > 0) {
      // If not at the first content item, go to previous content
      setCurrentContentIndex(currentContentIndex - 1);
    } else if (currentModuleIndex > 0) {
      // If at first content but not at first module, go to previous module
      const prevModule = modulesList[currentModuleIndex - 1];
      fetchModuleContent(prevModule.module_id);
      // The content index will be set to 0 in fetchModuleContent
      // We'll update it to the last content item after the module loads
    }
  };

  // Navigate to the next content or module
  const handleNextContent = async () => {
    if (moduleContent?.content && currentContentIndex < moduleContent.content.length - 1) {
      // If there are more content items in this module, go to next content
      setCurrentContentIndex(currentContentIndex + 1);
    } else {
      // If at last content item
      const currentModule = modulesList[currentModuleIndex];
      const isLastModule = currentModuleIndex === modulesList.length - 1;

      // Check if we need to mark the module as completed
      if (moduleContent && !moduleContent.isCompleted) {
        // If module has no quiz or if quiz is passed, mark as completed
        const passScore = moduleContent.pass_score || 60; // Default to 60
        if (!moduleContent.hasQuiz || (quizResult && quizResult.score >= passScore)) {
          await markModuleAsCompleted(currentModule.module_id);

          // If this is the last module, check if all modules are completed
          if (isLastModule) {
            const allCompleted = await checkAllModulesCompleted();
            if (allCompleted) {

              const hasCertificate = await checkCertificateStatus();
              if (!hasCertificate) {
                setShowFinalTest(true);
              }
              return;
            }
          } else {
            // After completing this module, find and load next uncompleted module
            const foundNext = await moveToNextUncompletedModule();

            // If no more uncompleted modules found, just move to next module (if any)
            if (!foundNext && currentModuleIndex < modulesList.length - 1) {
              const nextModule = modulesList[currentModuleIndex + 1];
              fetchModuleContent(nextModule.module_id);
            }

            return; // Exit early since we've already loaded the next module
          }
        }
      } else if (isLastModule && moduleContent?.isCompleted) {
        // If current module is already completed and it's the last module
        const allCompleted = await checkAllModulesCompleted();
        if (allCompleted) {
          // Check if certificate already exists before showing final test
          const hasCertificate = await checkCertificateStatus();
          if (!hasCertificate) {
            setShowFinalTest(true);
          }
          return;
        }
      }

      // If module not completed yet or if no more uncompleted modules, proceed normally
      if (currentModuleIndex < modulesList.length - 1) {
        // If not the last module, go to next module
        const nextModule = modulesList[currentModuleIndex + 1];
        fetchModuleContent(nextModule.module_id);
      }
    }
  };

  const handleNextContentWithQuizCheck = async () => {
    // PENTING: Cek quiz dari modul yang SEDANG AKTIF sekarang, bukan setelah navigasi
    const currentModuleData = moduleContent;
    const currentQuizResult = quizResult;
    const isAtLastContentOfModule = currentContentIndex === (currentModuleData?.content?.length - 1);

    console.log('=== QUIZ CHECK DEBUG ===');
    console.log('Current module index:', currentModuleIndex);
    console.log('Current content index:', currentContentIndex);
    console.log('Is at last content of module:', isAtLastContentOfModule);
    console.log('Current module hasQuiz:', currentModuleData?.hasQuiz);
    console.log('Current quiz result:', currentQuizResult);

    // Hanya cek quiz jika:
    // 1. Kita berada di konten terakhir dari modul yang sedang aktif
    // 2. Modul tersebut memiliki quiz
    // 3. Quiz belum dikerjakan atau belum lulus
    if (isAtLastContentOfModule && currentModuleData && currentModuleData.hasQuiz === true) {
      const passScore = currentModuleData.pass_score || 60;

      if (!currentQuizResult || currentQuizResult.score < passScore) {
        console.log('BLOCKING: Quiz required for current module');
        setShowQuizRequiredPopup(true);
        return; // STOP - jangan lanjut ke modul berikutnya
      } else {
        console.log('ALLOWING: Quiz passed for current module');
      }
    } else {
      console.log('ALLOWING: No quiz check needed (not last content or no quiz)');
    }

    // Kalau lolos semua pengecekan, lanjut ke konten/modul berikutnya
    handleNextContent();
  };



  // Enhanced quiz click handler with popup confirmation
  const handleQuizClick = () => {
    const currentModule = modulesList[currentModuleIndex];
    if (currentModule && currentModule.module_id) {
      // Set modal configuration for quiz
      setModalType('quiz');
      setModalConfig({
        message: quizResult
          ? "Apakah Kamu yakin ingin mengulang kuis?"
          : "Apakah Kamu yakin ingin memulai kuis sekarang? Pastikan Kamu sudah siap.",
        confirmText: quizResult ? "Ya, Ulangi" : "Ya, Mulai",
        cancelText: "Batal"
      });
      setShowModal(true);
    } else {
      console.error("Module ID tidak ditemukan untuk navigasi kuis");
    }
  };

  // Enhanced final test click handler with popup confirmation
  const handleFinalTestClick = () => {
    setModalType('finalExam');
    setModalConfig({
      message: finalExamResult
        ? "Kamu akan mengulang ujian akhir. Pastikan koneksi internet stabil dan Kamu sudah siap. Ujian ini akan menentukan kelulusanmu."
        : "Kamu akan memulai ujian akhir. Pastikan koneksi internet stabil dan Kamu sudah siap. Ujian ini akan menentukan kelulusanmu.",
      confirmText: finalExamResult ? "Ya, Ulangi Ujian" : "Ya, Mulai Ujian",
      cancelText: "Belum Siap"
    });
    setShowModal(true);
  };

  // Handle modal confirmation based on type
  const handleModalConfirm = () => {
    if (modalType === 'quiz') {
      const currentModule = modulesList[currentModuleIndex];
      navigate(`/quiz/${courseId}/${currentModule.module_id}`);
    } else if (modalType === 'finalExam') {
      navigate(`/quiz/${courseId}`);
    }

    // Close modal and reset
    setShowModal(false);
    setModalType('');
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setModalType('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#026078]"></div>
          <p className="mt-4 text-gray-600">Memuat materi...</p>
        </div>
      </div>
    );
  }

  // If no modules found
  if (modulesList.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg">
        <p className="text-center text-gray-600">Tidak ada modul yang tersedia</p>
      </div>
    );
  }

  // If no content is loaded yet
  if (!moduleContent) {
    return (
      <div className="p-6 bg-white rounded-lg">
        <p className="text-center text-gray-600">Materi tidak ditemukan</p>
      </div>
    );
  }

  // Show course completion statistics if certificate exists
  if (certificateData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-16">
          <div className="mb-8">
            <svg className="w-20 h-20 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-3xl font-bold text-[#026078] mb-2">Kursus Telah Diselesaikan!</h2>
            <p className="text-gray-600 text-lg mb-6">Selamat! Anda telah berhasil menyelesaikan kursus ini</p>
          </div>

          {/* Course Statistics */}
          <div className="bg-gradient-to-r from-[#026078] to-[#015266] text-white rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Statistik Kursus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">{certificateData.final_score}</div>
                <div className="text-sm opacity-90">Nilai Akhir</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-lg font-bold">{certificateData.issue_date}</div>
                <div className="text-sm opacity-90">Tanggal Selesai</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 md:col-span-2">
                <div className="text-lg font-bold">{certificateData.certificate_number}</div>
                <div className="text-sm opacity-90">Nomor Sertifikat</div>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h4 className="font-semibold text-lg text-gray-800 mb-2">{certificateData.course_name}</h4>
            <p className="text-gray-600 mb-4">Kursus telah diselesaikan oleh <strong>{certificateData.user_name}</strong></p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setCertificateData(null);
                  setShowFinalTest(false);
                }}
                className="px-6 py-3 bg-[#026078] text-white rounded-lg hover:bg-[#015266] transition-colors duration-200"
              >
                Kembali ke Materi
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show final test button when all modules are completed
  if (showFinalTest) {
    console.log("GULA: ", finalExamResult);
    const hasFailedBefore = finalExamResult && !finalExamResult.passed;

    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-16">
          <div className="mb-8">
            {hasFailedBefore ? (
              <svg className="w-20 h-20 mx-auto text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            ) : (
              <svg className="w-20 h-20 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}

            {hasFailedBefore ? (
              <>
                <h2 className="text-3xl font-bold text-[#026078] mb-2">Kamu Belum Lulus, hasil tes masih di bawah {passingGrade}</h2>
                <p className="text-gray-600 text-lg mb-2">Silahkan coba lagi untuk ujian akhir</p>
                <p className="text-gray-500">Pelajari kembali materi dan pastikan kamu siap</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-[#026078] mb-2">Selamat!</h2>
                <p className="text-gray-600 text-lg mb-2">Kamu telah menyelesaikan semua modul pembelajaran</p>
                <p className="text-gray-500">Sekarang saatnya untuk mengikuti ujian akhir</p>
              </>
            )}
          </div>

          {/* Show previous result statistics if failed before */}
          {hasFailedBefore && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg p-6 mb-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Hasil Ujian Sebelumnya</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl font-bold">{finalExamResult.score}</div>
                  <div className="text-sm opacity-90">Nilai Terakhir</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-lg font-bold">{new Date(finalExamResult.completed_at).toLocaleDateString('id-ID')}</div>
                  <div className="text-sm opacity-90">Tanggal Ujian</div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleFinalTestClick}
            className="px-8 py-4 bg-[#026078] text-white text-lg font-semibold rounded-lg hover:bg-[#015266] transition-colors duration-200 shadow-lg"
          >
            {hasFailedBefore ? 'Coba Lagi Test Akhir' : 'Mulai Test Akhir'}
          </button>

          <div className="mt-6">
            <button
              onClick={() => setShowFinalTest(false)}
              className="text-[#026078] hover:text-[#015266] underline"
            >
              Kembali ke Materi
            </button>
          </div>
        </div>
        {/* Confirmation Modal */}
        <PopupModal
          isOpen={showModal}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
        />
      </div>
    );
  }

  // Get current content item
  const currentContent = moduleContent.content && moduleContent.content.length > 0
    ? moduleContent.content[currentContentIndex]
    : null;

  // Calculate pagination info
  const totalContentItems = moduleContent.content ? moduleContent.content.length : 0;
  const isFirstContent = currentModuleIndex === 0 && currentContentIndex === 0;
  const isLastContent = currentModuleIndex === modulesList.length - 1 &&
    currentContentIndex === totalContentItems - 1;

  // Module selector for mobile/dropdown view
  const ModuleSelector = () => (
    <div className="mb-6">
      <label htmlFor="moduleSelect" className="block text-sm font-medium text-gray-700 mb-1">
        Pilih Materi:
      </label>
      <select
        id="moduleSelect"
        value={currentModuleIndex}
        onChange={(e) => {
          const selectedModule = modulesList[parseInt(e.target.value)];
          fetchModuleContent(selectedModule.module_id);
        }}
        className="block w-full p-2 border border-gray-300 rounded-md focus:ring-[#026078] focus:border-[#026078]"
      >
        {modulesList.map((module, index) => (
          <option key={module.module_id} value={index}>
            {index + 1}. {module.title}
          </option>
        ))}
      </select>
    </div>
  );

  // Quiz status display for module with quiz
  const QuizStatus = () => {
    if (!moduleContent?.hasQuiz) return null;

    if (quizResult) {
      // Get the pass score from either moduleContent or from quizResult if available
      const passScore = moduleContent.pass_score || 60; // Default to 60 if not provided
      const isPassed = quizResult.score >= passScore;

      return (
        <div className={`mt-4 p-4 rounded-lg ${isPassed ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <h3 className="font-medium text-lg">Status Kuis</h3>
          <div className="flex items-center mt-2">
            <div className={`px-3 py-1 rounded-full text-sm ${isPassed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {isPassed ? 'Lulus' : 'Belum Lulus'}
            </div>
            <div className="ml-4">
              <span className="text-gray-600">Nilai: </span>
              <span className="font-medium">{quizResult.score}/100</span>
            </div>
          </div>
          {!isPassed && (
            <button
              onClick={handleQuizClick}
              className="mt-3 px-4 py-2 bg-[#026078] text-white rounded-md hover:bg-[#015266]"
            >
              Coba Lagi
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Module selector (mobile friendly) */}
      <div className="md:hidden">
        <ModuleSelector />
      </div>

      {/* Desktop view: Module list sidebar can be added here */}

      {/* Module content */}
      <div>
        {/* Module header */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#026078]">{moduleContent.title}</h2>
          <p className="text-gray-600 mt-2">{moduleContent.description}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
          <span>
            Modul {currentModuleIndex + 1} dari {modulesList.length}
            {totalContentItems > 1 && ` • Halaman ${currentContentIndex + 1} dari ${totalContentItems}`}
          </span>
          {moduleContent.isCompleted ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Selesai
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
              Belum Selesai
            </span>
          )}
        </div>

        {/* Module content - only show current content based on currentContentIndex */}
        <div className="mb-8">
          {currentContent ? (
            <div
              key={currentContent.content_id}
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: currentContent.content }}
            />
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p>Tidak ada konten yang tersedia untuk modul ini</p>
            </div>
          )}
        </div>

        {/* Quiz Status and Results */}
        <QuizStatus />

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <button
            onClick={handlePrevContent}
            disabled={isFirstContent}
            className={`px-6 py-2 rounded-md flex items-center ${isFirstContent
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#E6F7FF] text-[#026078] hover:bg-[#BFECFF]'
              }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Sebelumnya
          </button>

          {moduleContent.hasQuiz && currentContentIndex === totalContentItems - 1 &&
            (!quizResult || (quizResult && quizResult.score < moduleContent.pass_score)) && (
              <button
                onClick={handleQuizClick}
                className="px-6 py-2 rounded-md bg-[#FFA500] text-white hover:bg-[#FF8C00] flex items-center"
              >
                {quizResult ? 'Coba Kuis Lagi' : 'Mulai Kuis'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            )}

          <button
            onClick={handleNextContentWithQuizCheck}
            className="px-6 py-2 rounded-md flex items-center bg-[#026078] text-white hover:bg-[#015266]"
          >
            {isLastContent ? 'Selesaikan Kursus' : 'Selanjutnya'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <PopupModal
        isOpen={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />

      <PopupModal
        isOpen={showQuizRequiredPopup}
        onClose={() => setShowQuizRequiredPopup(false)}
        onConfirm={() => setShowQuizRequiredPopup(false)}
        message="Anda harus menyelesaikan kuis terlebih dahulu sebelum melanjutkan ke materi berikutnya."
        confirmText="Saya Mengerti"
        cancelText=""
      />


    </div>
  );
};

export default ModuleContentViewer;