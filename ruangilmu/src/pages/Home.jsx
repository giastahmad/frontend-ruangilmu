// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/jsx/CourseCard';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import kidImage from '../components/img/kids.png';
import { apiService } from '../components/utils/authMiddleware';

const Home = () => {
  const [selectedClass, setSelectedClass] = useState('Kelas 4');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status once on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  // Separate useEffect for fetching courses
  useEffect(() => {
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

  return (
    <div className="bg-[#d2e6e4]">
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-24">
        <div className="flex flex-col md:flex-row md:mt-5">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 pb-4 items-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 hero-text">
              Ruang Hidup Belajar
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Perluas <span className="font-bold text-[#0B7077]">kemampuanmu</span> dengan belajar di <span className="font-bold text-[#0B7077]">RuangIlmu!</span>
            </p>

            {console.log('LOGIN BLOM? :', isLoggedIn)}
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/register"
                  className="bg-[#0B7077] text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-[#014b60] transition text-center explore-btn"
                >
                  DAFTAR SEKARANG
                </Link>
              </div>
            )}
          </div>
          <div className='flex md:w-1/2 items-end'>
            <img src={kidImage} alt="Kids_Image" className='w-full h-auto max-w-lg mx-auto' />
          </div>
        </div>
      </section>

      {/* Subject Section */}
      <section className="bg-gray-50 py-8 px-4 md:px-24">
        <div className="container mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label htmlFor="kelas" className="text-2xl md:text-3xl font-bold text-gray-900">
              Materi untuk
            </label>
            <div className="flex flex-wrap gap-3">
              <select
                name="Kelas"
                id="kelas"
                className="text-lg border-2 border-[#026078] rounded-md py-1 px-2"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="Kelas 4">Kelas 4</option>
                <option value="Kelas 5">Kelas 5</option>
                <option value="Kelas 6">Kelas 6</option>
              </select>
              <select
                name="Semester"
                id="semester"
                className="text-lg border-2 border-[#026078] rounded-md py-1 px-2"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B7077]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map(course => (
                <CourseCard key={course.course_id} course={course} />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Call to Action */}
      {!isLoggedIn && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Siap memulai perjalanan belajarmu?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Bergabunglah bersama ribuan pelajar yang telah lebih dulu mengembangkan karier mereka bersama RuangIlmu.
            </p>
            <Link
              to="/register"
              className="bg-[#0B7077] text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-[#014b60] transition inline-block"
            >
              DAFTAR SEKARANG
            </Link>
          </div>
        </section>
      )}

      {/* Success Toast */}
      <div
        id="successToast"
        className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white border-3 border-[#026078] text-green-500 py-2 px-4 rounded-md shadow-lg hidden"
      >
        Login Successful!
      </div>

      <Footer />
    </div>
  );
};

export default Home;