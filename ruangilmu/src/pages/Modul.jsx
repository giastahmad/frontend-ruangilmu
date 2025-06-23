import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ModuleContentViewer from '../components/jsx/ModuleContentViewer';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import Chatbot from '../components/jsx/Chatbot';
import { apiService } from '../components/utils/authMiddleware';
import Toast from '../components/jsx/Toast';
import PopupModal from '../components/jsx/Popup';


const Modul = () => {
  const [activeTab, setActiveTab] = useState('materi');
  const [courseInfo, setCourseInfo] = useState({
    icon: "aset/math-icon.svg",
    title: "Loading...",
    description: "Loading...",
    stats: []
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('warning');
  const [showPopup, setShowPopup] = useState(false);
  const [moduleData, setModuleData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token USER:', token);
    setIsLoggedIn(!!token);

    fetchCourseInfo();
  }, [id]);

  const fetchCourseInfo = async () => {
    try {
      const response = await apiService.get(`https://backend-ruangilmu-production.up.railway.app/courses/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch course information');
      }

      const data = await response.json();
      const theData = data.data;
      console.log('DATAAT: ', data)
      setCourseInfo({
        icon: theData.course_image_cover || "aset/math-icon.svg",
        title: theData.course_name || "No Title",
        description: theData.course_description || "No description available",
        stats: []
      });
    } catch (error) {
      console.error('Error fetching course info:', error);
    }
  };

  // Function to handle module selection from ModuleContentViewer
  const handleModuleSelect = (moduleId) => {
    const status = localStorage.getItem(`quiz-status-${moduleId}`);

    if (!status || status !== 'passed') {
      setToastMessage("Silakan kerjakan dan lulus kuis terlebih dahulu sebelum melanjutkan modul.");
      setToastType('warning');
      setToastVisible(true);

      // popup
      setShowPopup(true);
      return;
    }
    setCurrentModuleId(moduleId);
  };


  const getTabContent = () => {
    switch (activeTab) {
      case 'materi':
        return (<ModuleContentViewer
          onModuleSelect={handleModuleSelect}
          currentModuleId={currentModuleId}
        />);
      default:
        return <div className="p-6 bg-white rounded-lg">Pilih tab untuk melihat konten</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to="/course" className="text-[#026078] hover:underline pl-2">↰ Kembali ke Daftar Kelas</Link>

        {/* Course Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#026078]">{courseInfo.title}</h1>
            <p className="text-gray-600 mt-2">{courseInfo.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {courseInfo.stats.map((stat, index) => (
                <span key={index} className="bg-[#E6F7FF] text-[#0B7077] px-3 py-1 rounded-full text-sm">
                  {stat.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Tab Content */}
        {getTabContent()}
      </div>
      {/* Pass courseId and currentModuleId to Chatbot */}
      <Chatbot
        courseId={id}
        currentModuleId={currentModuleId}
      />
      <Footer />

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <PopupModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={() => setShowPopup(false)}
        message="Anda harus lulus kuis dengan nilai minimal 70 untuk membuka modul ini."
        confirmText="Saya Mengerti"
        cancelText=""
      />




    </div>
  );
};

export default Modul;