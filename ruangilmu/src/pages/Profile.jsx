import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import { apiService } from '../components/utils/authMiddleware';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token USER:', token);
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserProfile(token);
      fetchEnrolledCourses();
      fetchCertificates();
    }
  }, []);


  const fetchUserProfile = async (token) => {
    try {
      const response = await apiService.get('http://localhost:8000/user/me');

      if (!response.ok) {
        console.log('Token user:', token);
        throw new Error('Gagal Mengambil Data');
      }

      const data = await response.json();
      console.log('Fetched user data:', data);
      setUser(data.data.user);
    } catch (error) {
      console.error('Error mengambil data: ', error);
      setError('Gagal Menampilkan data user, coba sesaat lagi');
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await apiService.get('http://localhost:8000/courses/user/enrolled');

      if (!response.ok) {
        throw new Error('Gagal Mengambil Data');
      }

      const data = await response.json();
      console.log('Fetched enrolled courses data:', data);
      setCourses(data.data);

      if (data.data && data.data.length > 0) {
        fetchAllCourseProgress(data.data);
      }
    } catch (error) {
      console.error('Error mengambil data: ', error);
      setError('Gagal Menampilkan kelas user, coba sesaat lagi');
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await apiService.get('http://localhost:8000/course/certificates');

      if (!response.ok) {
        throw new Error('Gagal Mengambil Data Sertifikat');
      }

      const data = await response.json();
      console.log('Fetched certificates data:', data);
      setCertificates(data.data || []);
    } catch (error) {
      console.error('Error mengambil sertifikat: ', error);
      setError('Gagal Menampilkan sertifikat, coba sesaat lagi');
    }
  };

  const fetchAllCourseProgress = async (courseList) => {
    const progressPromises = courseList.map(course =>
      fetchCourseProgress(course.course_id)
    );

    try {
      const progressResults = await Promise.all(progressPromises);
      const progressMap = {};

      courseList.forEach((course, index) => {
        progressMap[course.course_id] = progressResults[index];
      });

      setCourseProgress(progressMap);
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  };

  const fetchCourseProgress = async (courseId) => {
    try {
      const response = await apiService.get(`http://localhost:8000/course/${courseId}/module`);

      if (!response.ok) {
        throw new Error('Gagal mengambil data modul');
      }

      const data = await response.json();
      console.log(`Fetched modules for course ${courseId}:`, data);

      if (data.data && data.data.length > 0) {
        const completedModules = data.data.filter(module => module.completed === true).length;
        const totalModules = data.data.length;
        const progressPercentage = Math.round((completedModules / totalModules) * 100);

        console.log(`Course ${courseId} progress: ${completedModules}/${totalModules} (${progressPercentage}%)`);
        return progressPercentage;
      }

      return 0;
    } catch (error) {
      console.error(`Error fetching progress for course ${courseId}:`, error);
      return 0;
    }
  };

  const handleDownloadCertificate = async (id) => {
    try {

      const res = await apiService.get(`http://localhost:8000/course/${id}/certificate/download`);

      if (!res.ok) {
        throw new Error('Gagal mengunduh sertifikat');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  // get completed course ID from certif
  const completedCourseIds = certificates.map(cert => cert.course_id);

  // Split courses into active and completed based on certificates
  const activeCourses = courses.filter(course => !completedCourseIds.includes(course.course_id));
  const completedCourses = courses.filter(course => completedCourseIds.includes(course.course_id));

  // Calculate profile completion percentage (simplified example)
  const profileCompletion = user.nama && user.email && user.tanggal_lahir && user.photo_profile ? 100 :
    user.nama && user.email ? 50 : 25;

  // Format join date
  const formatJoinDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Get certificate for a specific course
  const getCertificateForCourse = (courseId) => {
    return certificates.find(cert => cert.course_id === courseId);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="container mx-auto px-6 py-12 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={user.photo_profile || '/images/profile.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-md border-4 border-[#0B7077] object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B7077]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.nama || 'Pengguna RuangIlmu'}</h2>
                <p className="text-gray-600 mb-4">Murid di RuangIlmu</p>
                <Link to="/edit_profile">
                  <button className="border border-[#0B7077] text-[#0B7077] px-6 py-2 rounded-md font-medium hover:bg-[#0B7077] hover:text-white transition duration-300">
                    Edit Profil
                  </button>
                </Link>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Komplit Profil</h3>
                  <span className="text-sm text-[#0B7077]">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#0B7077] h-2 rounded-full"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B7077]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-600">{user.email || 'Email belum ditambahkan'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B7077]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">{user.kelas ? `Kelas ${user.kelas}` : 'Kelas belum ditentukan'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B7077]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Bergabung {formatJoinDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="lg:w-3/4">
            {/* Profile Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    className={`py-4 px-6 ${activeTab === "courses" ? "border-b-3 border-[#0B7077] text-[#0B7077] font-semibold" : "text-gray-500 hover:text-[#0B7077]"}`}
                    onClick={() => setActiveTab("courses")}
                  >
                    Kelas Saya
                  </button>
                  <button
                    className={`py-4 px-6 ${activeTab === "certificates" ? "border-b-3 border-[#0B7077] text-[#0B7077] font-semibold" : "text-gray-500 hover:text-[#0B7077]"}`}
                    onClick={() => setActiveTab("certificates")}
                  >
                    Sertifikat Saya
                  </button>
                  <button
                    className={`py-4 px-6 ${activeTab === "awards" ? "border-b-3 border-[#0B7077] text-[#0B7077] font-semibold" : "text-gray-500 hover:text-[#0B7077]"}`}
                    onClick={() => setActiveTab("awards")}
                  >
                    Penghargaan Saya
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "courses" && (
              <>
                {/* Active Courses */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Kelas Aktif ({activeCourses.length})</h2>

                  {activeCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Anda belum mengikuti kelas apapun.</p>
                      <Link to="/course">
                        <button className="mt-4 bg-[#0B7077] text-white px-6 py-2 rounded-md hover:bg-[#014b60] transition">
                          Jelajahi Kelas
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeCourses.map(course => {
                        const progress = courseProgress[course.course_id] || 0;
                        return (
                          <div
                            key={course.course_id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden transform transition duration-300 hover:translate-y-[-3px] hover:shadow-lg"
                          >
                            <img
                              src={course.course_image_cover || '/default-course.jpg'}
                              alt={course.course_name}
                              className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="font-bold text-gray-800 mb-2">{course.course_name}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-3">
                                <span>{progress}% selesai</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div
                                  className="bg-[#0B7077] h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <Link to={`/modul/${course.course_id}`}>
                                <button className="w-full bg-[#0B7077] text-white py-2 rounded-md hover:bg-[#014b60] transition">
                                  Lanjut Belajar
                                </button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Completed Courses */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Kelas Selesai ({completedCourses.length})</h2>

                  {completedCourses.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Anda belum menyelesaikan kelas apapun.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {completedCourses.map(course => {
                        const certificate = getCertificateForCourse(course.course_id);
                        return (
                          <div
                            key={course.course_id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden transform transition duration-300 hover:translate-y-[-3px] hover:shadow-lg"
                          >
                            <div className="relative">
                              <img
                                src={course.course_image_cover || '/default-course.jpg'}
                                alt={course.course_name}
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">SELESAI</span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-gray-800 mb-2">{course.course_name}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-3">
                                <span>Diselesaikan pada {certificate ? formatJoinDate(certificate.issue_date) : formatJoinDate(course.enrollment_date)}</span>
                              </div>
                              {certificate && (
                                <div className="mb-3">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium">Nilai Akhir: </span>
                                    <span className="ml-1 text-[#0B7077] font-bold">{certificate.final_score}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium">No. Sertifikat: </span>
                                    <span className="ml-1 text-xs">{certificate.certificate_number}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "certificates" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Sertifikat Saya</h2>
                <p className="text-gray-600">Anda memiliki {certificates.length} sertifikat yang telah diperoleh.</p>

                {certificates.length === 0 ? (
                  <div className="text-center py-8 mt-4">
                    <p className="text-gray-500">Selesaikan kelas untuk mendapatkan sertifikat.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {certificates.map(certificate => (
                      <div key={certificate.certificate_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-center space-x-4">
                          <div className="bg-[#0B7077] p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{certificate.course_name}</h3>
                            <p className="text-sm text-gray-500">Diselesaikan: {formatJoinDate(certificate.issue_date)}</p>
                            <p className="text-sm text-gray-600">Nilai: <span className="font-bold text-[#0B7077]">{certificate.final_score}</span></p>
                            <p className="text-xs text-gray-500">No: {certificate.certificate_number}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            className="text-[#0B7077] hover:underline font-medium"
                            onClick={() => handleDownloadCertificate(certificate.course_id)}
                            >
                            Unduh
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "awards" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Penghargaan Saya</h2>
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-gray-600">Anda belum memiliki penghargaan.</p>
                  <p className="text-gray-500 mt-2">Terus belajar untuk mendapatkan penghargaan!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;