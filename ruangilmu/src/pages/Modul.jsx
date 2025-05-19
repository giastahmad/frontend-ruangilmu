import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ModulContent from '../components/jsx/ModulContent';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';

const Modul = () => {
  const [activeTab, setActiveTab] = useState('silabus');
  const [courseInfo, setCourseInfo] = useState({
    icon: "aset/math-icon.svg",
    title: "Loading...",
    description: "Loading...",
    stats: []
  });
  const [moduleData, setModuleData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token USER:', token);
    setIsLoggedIn(!!token);

    fetchCourseInfo();
    fetchModuleData();
  }, [id]);

  const fetchCourseInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/courses/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

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
        stats: [
          { label: "Memuat data..." }
        ]
      });
    } catch (error) {
      console.error('Error fetching course info:', error);
    }
  };

  const fetchModuleData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/course/${id}/module`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      console.log("SATU", response)

      if (!response.ok) {
        throw new Error('Failed to fetch module data');
      }

      const data = await response.json();
      const theData = data.data;
      console.log('MODULE :', theData)
      // Transform API data to match the expected format for ModulContent
      const formattedModules = transformModuleData(theData);
      setModuleData(formattedModules);

      // Update course stats after we have module data
      if (formattedModules.length > 0) {
        let totalLessons = 0;
        let totalVideos = 0;

        formattedModules.forEach(module => {
          totalLessons += module.lessons.length;
          module.lessons.forEach(lesson => {
            if (lesson.video) totalVideos++;
          });
        });

        setCourseInfo(prev => ({
          ...prev,
          stats: [
            { label: `${totalLessons} Materi` },
            { label: `${totalVideos} Video` },
            { label: "5 Quiz" } // This could be dynamic if we had quiz data
          ]
        }));
      }
    } catch (error) {
      console.error('Error fetching module dataaaaaaaaaaaaaaaaa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform API response to match the format expected by ModulContent
  const transformModuleData = (apiData) => {
    // Group modules by their titles
    const moduleGroups = {};

    apiData.forEach(item => {
      const moduleTitle = `Modul ${item.modul_id}: ${item.title}`;

      if (!moduleGroups[moduleTitle]) {
        moduleGroups[moduleTitle] = {
          id: item.modul_id,
          title: moduleTitle,
          description: `Materi ${item.title} untuk siswa kelas 4 SD`,
          isActive: true,
          lessons: []
        };
      }

      // Add the lesson to this module
      moduleGroups[moduleTitle].lessons.push({
        id: item.modul_id,
        title: item.title,
        description: item.content || "Tidak ada deskripsi",
        duration: "15 menit", // This could be dynamic if we had duration data
        hasPdf: true, // This could be dynamic if we had PDF data
        // Add image and video conditionally if available
        // These would need to be dynamic based on actual data
      });
    });

    // Convert the object to an array
    return Object.values(moduleGroups);
  };



  const getTabContent = () => {
    if (isLoading) {
      return (
        <div className="p-6 bg-white rounded-lg flex justify-center items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Memuat data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'silabus':
        return <ModulContent modules={moduleData} />;
      case 'materi':
        return <div className="p-6 bg-white rounded-lg">Content untuk tab Materi akan di-load di sini</div>;
      default:
        return <ModulContent modules={moduleData} />;
    }
  };

  return (
    <div className="bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} />
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to="/course" className="text-[#026078] hover:underline pl-8">↰ Kembali ke Daftar Kelas</Link>
        
        {/* Course Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-[#D2E6E4] rounded-lg flex items-center justify-center">
            <img src={courseInfo.icon} alt="Course Icon" className="w-16 h-16" />
          </div>
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

        {/* Syllabus Tabs */}
        <div className="flex overflow-x-auto mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'silabus' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab('silabus')}
            >
              Silabus
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'materi' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab('materi')}
            >
              Materi
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {getTabContent()}
      </div>
              
      <Footer />
    </div>
  );
};

export default Modul;