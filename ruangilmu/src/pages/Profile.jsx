import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';

const ProfilePage = () => {
  // Mock data that will be replaced with backend data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    location: "Jakarta, Indonesia",
    joinDate: "Juli 2022",
    profilePicture: "/img/profile-pic.jpg",
    profileCompletion: 80
  });

  const [activeTab, setActiveTab] = useState("courses");

  // Mock course data that will come from backend
  const activeCourses = [
    {
      id: 1,
      title: "Product Management Basic",
      progress: 25,
      image: "/img/course1.jpg"
    },
    {
      id: 2,
      title: "Data Science Professional",
      progress: 65,
      image: "/img/course2.jpg"
    },
    {
      id: 3,
      title: "Python for Everybody",
      progress: 10,
      image: "/img/course3.jpg"
    }
  ];

  const completedCourses = [
    {
      id: 4,
      title: "The Science of Well-Being",
      completionDate: "15 Agustus 2022",
      image: "/img/course4.jpg"
    },
    {
      id: 5,
      title: "Digital Marketing Fundamentals",
      completionDate: "5 Juli 2022",
      image: "/img/course5.jpg"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img 
                    src={userData.profilePicture} 
                    alt="Profile"
                    className="w-32 h-32 rounded-md border-4 border-[#0B7077] object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B7077]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
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
                  <span className="text-sm text-[#0B7077]">{userData.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#0B7077] h-2 rounded-full" 
                    style={{ width: `${userData.profileCompletion}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B7077]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-600">{userData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B7077]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">{userData.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0B7077]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Bergabung {userData.joinDate}</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeCourses.map(course => (
                      <div 
                        key={course.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden transform transition duration-300 hover:translate-y-[-3px] hover:shadow-lg"
                      >
                        <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span>{course.progress}% selesai</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div 
                              className="bg-[#0B7077] h-2 rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <button className="w-full bg-[#0B7077] text-white py-2 rounded-md hover:bg-[#014b60] transition">
                            Lanjut Belajar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Completed Courses */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Kelas Selesai ({completedCourses.length})</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedCourses.map(course => (
                      <div
                        key={course.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden transform transition duration-300 hover:translate-y-[-3px] hover:shadow-lg"
                      >
                        <div className="relative">
                          <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">SELESAI</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span>Diseselaikan pada {course.completionDate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <button className="text-[#0B7077] hover:underline">
                              Lihat Sertifikat
                            </button>
                            <button className="text-gray-600 hover:text-[#0B7077]">
                              Nilai Kelas
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "certificates" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Sertifikat Saya</h2>
                <p className="text-gray-600">Anda memiliki {completedCourses.length} sertifikat yang telah diperoleh.</p>
                {/* Certificate content would go here */}
              </div>
            )}

            {activeTab === "awards" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Penghargaan Saya</h2>
                <p className="text-gray-600">Anda belum memiliki penghargaan.</p>
                {/* Awards content would go here */}
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