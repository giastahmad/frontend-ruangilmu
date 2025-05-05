// src/pages/CourseDetailPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  
  // In a real application, you would fetch the course details based on the ID
  // For now, we'll use static data to match the HTML
  const courseDetails = {
    title: "Product Management Basic Course",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim..",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.."
    ],
    whatWillLearn: "Himenaeos. Vestibulum sollicitudin varius mauris non dignissim. Sed quis iaculis est. Nulla quam neque, interdum vitae fermentum lacinia, interdum eu magna. Mauris non posuere tellus. Donec quis euismod tellus. Nam vel lacus eu nisl bibendum accumsan vitae vitae nibh. Nam nec eros id magna hendrerit sagittis Nullam sed mi non odio feugiat volutpat sit amet nec elit. Maecenas id hendrerit ipsum.",
    price: 60,
    originalPrice: 120,
    features: {
      startDate: "4:00 PM - 6:00 PM",
      enrolled: "100 students",
      lectures: "80",
      skillLevel: "Basic",
      classDays: "Monday-Friday",
      language: "English"
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-[#D2E6E4] shadow-sm">
        <Navbar />
      </div>

      {/* Course Details Content */}
      <div className="container mx-auto px-6 py-12 flex-grow">
        <Link to="/course" className="text-[#026078] hover:underline pl-8">↰ Kembali ke Daftar Kelas</Link>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Course Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{courseDetails.title}</h1>

              {/* Course Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map((tab) => (
                    <button
                      key={tab}
                      className={`py-4 px-1 ${
                        activeTab === tab
                          ? 'active-tab border-b-3 border-[#0B7077] text-[#0B7077] font-semibold'
                          : 'text-gray-500 hover:text-[#0B7077]'
                      }`}
                      onClick={() => handleTabChange(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'Overview' && (
                <div>
                  {/* Course Description */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">COURSE DESCRIPTION</h2>
                    {courseDetails.description.map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-4">
                        {paragraph}
                      </p>
                    ))}

                    <h2 className="text-xl font-bold text-gray-800 mb-4">WHAT WILL I LEARN FROM THIS COURSE?</h2>
                    <p className="text-gray-600">{courseDetails.whatWillLearn}</p>
                  </div>
                </div>
              )}

              {activeTab === 'Curriculum' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">COURSE CURRICULUM</h2>
                  <p className="text-gray-600">Course curriculum content will be displayed here.</p>
                </div>
              )}

              {activeTab === 'Instructor' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">COURSE INSTRUCTOR</h2>
                  <p className="text-gray-600">Instructor information will be displayed here.</p>
                </div>
              )}

              {activeTab === 'Reviews' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">COURSE REVIEWS</h2>
                  <p className="text-gray-600">Student reviews will be displayed here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Course Fee</h3>
              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-[#0B7077]">${courseDetails.price}</span>
                <span className="ml-2 text-lg text-gray-500 line-through">${courseDetails.originalPrice}</span>
              </div>

              <div className="text-green-600 font-medium mb-6">29-day Money-back Guarantee</div>

              <div className="space-y-4 mb-8">
                {Object.entries(courseDetails.features).map(([key, value]) => (
                  <div key={key} className="course-feature flex justify-between border-b border-gray-200 pb-4 last:border-0">
                    <span className="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-800 font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <button className="bg-[#0B7077] hover:bg-[#014b60] text-white w-full py-3 rounded-md font-medium transition">
                ENROLL NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CourseDetailPage;