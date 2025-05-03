// src/pages/CoursesPage.jsx
import React, { useState } from 'react';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import CourseCard from '../components/jsx/CourseCard';

// Import gambar
import course1Image from '../components/img/temp.svg';
import course2Image from '../components/img/temp.svg';
import course3Image from '../components/img/temp.svg';
import course4Image from '../components/img/temp.svg';

// Data kursus
const courseData = [
  {
    id: 1,
    image: course1Image,
    startDate: '1',
    endDate: '20 July 2022',
    studentCount: 40,
    title: 'Product Management Basic - Course',
    description: 'Product Management Materials: you will learn with Dutch Literature - Head of Product Customer Platform Graph Features.',
    price: 380,
    originalPrice: 500
  },
  {
    id: 2,
    image: course2Image,
    startDate: '1',
    endDate: '25 July 2022',
    studentCount: 11,
    title: 'BN Data Science Professional Certificate',
    description: 'Product Management Materials: you will learn with Danish Literature - Head of Product Customer Platform Graph Features.',
    price: 678,
    originalPrice: 800
  },
  {
    id: 3,
    image: course3Image,
    startDate: '1',
    endDate: '22 July 2022',
    studentCount: 234,
    title: 'The Science of Well-Being',
    description: 'Product Management Materials: you will learn with Spider Enterprise - Head of Product Customer Platform Graph Features.',
    price: 123,
    originalPrice: 500
  },
  {
    id: 4,
    image: course4Image,
    startDate: '1',
    endDate: '26 July 2022',
    studentCount: 342,
    title: 'Python for Everybody Specialization',
    description: 'Product Management Materials: you will learn with Smart Sciences - Head of Product Customer Platform Graph Features.',
    price: 567,
    originalPrice: 700
  }
];

// Kategori kursus
const categories = [
  'All Courses',
  'Mathematics',
  'English',
  'Bahasa Indonesia',
  'Science',
  'Social'
];

const CoursesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [currentPage, setCurrentPage] = useState(1);

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
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">All Programs</h2>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-4 py-2 rounded-md ${
                        activeCategory === category 
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Popular Courses</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseData.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

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
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === page 
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