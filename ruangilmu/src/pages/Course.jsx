// src/pages/CoursesPage.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import CourseCard from '../components/jsx/CourseCard';

// Import gambar
import tempCover from '../components/img/temp.svg';
import { apiService } from '../components/utils/authMiddleware';

// Kategori kursus
const categories = [
  'Semua Kelas',
  'Kelas 4',
  'Kelas 5',
  'Kelas 6',
];

const CoursesPage = () => {
  const [activeCategory, setActiveCategory] = useState('Semua Kelas');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('https://ruangilmu.up.railway.app/courses');

      if (!response.ok) {
        throw new Error('Gagal Mengambil Data');
      }

      const data = await response.json();
      console.log('Fetched courses data:', data);

      setCourses(data.data);
      setLoading(false);

    } catch (error) {
      console.error('Error mengambil data: ', error);
      setError('Gagal Menampilkan kelas, coba sesaat lagi');
      setLoading(false);
    }
  };


  // Handler untuk mengubah kategori
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Handler untuk pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#d2e6e4]">
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="container mx-auto px-6 py-12 flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar Program</h2>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-4 py-2 rounded-md ${activeCategory === category
                        ? 'bg-[#0B7077] text-white'
                        : 'hover:bg-gray-100'
                        }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Courses List */}
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Daftar Kelas</h1>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B7077]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                  <CourseCard key={course.course_id} course={course} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Previous
                </button>
                {[1, 2, 3].map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-md ${currentPage === page
                      ? 'bg-[#0B7077] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(Math.min(3, currentPage + 1))}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoursesPage;