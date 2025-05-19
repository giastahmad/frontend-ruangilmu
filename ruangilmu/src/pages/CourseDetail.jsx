// src/pages/CourseDetailPage.jsx
import React, { use, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import temporaryImage from '../components/img/temp.svg';
import deleteIcon from '../components/img/delete.png';
import PopupModal from '../components/jsx/Popup';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(true);
  const [reviewFilter, setReviewFilter] = useState('Semua');
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const user = localStorage.getItem('user');
  const userId = user ? JSON.parse(user).id : null;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        console.log('course ID : ', id)
        const response = await fetch(`http://localhost:8000/courses/${id}`);

        if (!response.ok) {
          throw new Error(`Gagal menampilkan detail kelas: ${response.status}`);
        }

        const data = await response.json();
        setCourse(data.data);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    fetchCourseDetails();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    try {
      // Make sure price is a valid number
      const numericPrice = parseFloat(price);

      // Check if the conversion result is valid
      if (isNaN(numericPrice) || numericPrice == 0) {
        return 'Gratis';
      }

      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(numericPrice);
    } catch (e) {
      console.error('Error format harga:', e);
      return `Rp -`;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to filter reviews
  const getFilteredReviews = () => {
    if (reviewFilter === 'Semua') {
      return reviews;
    }
    return reviews.filter(review => review.type === reviewFilter);
  };

  // Function to handle course enrollment
  const handleEnrollCourse = async () => {
    const token = localStorage.getItem('accessToken');

    // Check if user is logged in
    if (!token) {
      // Redirect to login page if not logged in
      navigate('/login', { state: { from: location.pathname, message: 'Silakan login untuk mendaftar kelas' } });
      return;
    }

    try {
      setEnrollLoading(true);
      setEnrollStatus(null);

      const response = await fetch(`http://localhost:8000/courses/${id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mendaftar kelas');
      }

      setEnrollStatus({
        success: true,
        message: 'Berhasil mendaftar kelas! Anda dapat mengakses kelas ini di dashboard.'
      });

      // Redirect to learning page or dashboard after successful enrollment
      setTimeout(() => {
        navigate(`/modul/${id}`);
      }, 2000);

    } catch (err) {
      console.error('Error enrolling course:', err);
      setEnrollStatus({
        success: false,
        message: err.message || 'Terjadi kesalahan saat mendaftar kelas'
      });
    } finally {
      setEnrollLoading(false);
    }
  };


  // Fetch review ketika pengguna mengklik tab Ulasan
  useEffect(() => {
    if (activeTab === 'Ulasan') {
      fetchReviews();
    }
  }, [activeTab]);

  // Fetch semua reviews dari course yang ada
  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:8000/review/course/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!res.ok) {
        throw new Error('Gagal mengambil data ulasan');
      }

      const response = await res.json();
      const dataReview = response.data;

      setReviews(dataReview);
      console.log('DATA review :', dataReview)
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  // Atur post review ke server
  const postReview = async () => {
    try {
      const res = await fetch(`http://localhost:8000/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          course_id: id,
          content: reviewText
        })
      });

      if (!res.ok) {
        throw new Error('Gagal mengirim ulasan');
      }

      const response = await res.json();
      const dataReview = response.data;

      setReviews(prevReview => [...prevReview, dataReview]);
      fetchReviews();
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  useEffect(() => {
    const checkUserReview = async () => {
      try {
        const res = await fetch(`http://localhost:8000/review/user/course/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!res.ok) {
          throw new Error('Gagal mengambil data ulasan pengguna');
        }

        const response = await res.json();

        if (response.status === 'success' && response.data) {
          setShowReviewForm(false);
        } else {
          setShowReviewForm(true);
        }

      } catch (error) {
        console.error('Error: ', error);
        setShowReviewForm(true);
      }
    };

    checkUserReview();
  }, [id]);

  const deleteHandleClick = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:8000/review/delete/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!res.ok) {
        throw new Error('Gagal menghapus ulasan');
      }

      setReviews((prevReviews) => prevReviews.filter((review) => review.review_id !== reviewId));
      setReviewText('');
      setShowReviewForm(true);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="bg-[#D2E6E4] shadow-sm">
          <Navbar />
        </div>
        <div className="container mx-auto px-6 py-12 flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Memuat detail kelas...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="bg-[#D2E6E4] shadow-sm">
          <Navbar />
        </div>
        <div className="container mx-auto px-6 py-12 flex-grow flex items-center justify-center">
          <p className="text-xl text-red-600">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-[#D2E6E4] shadow-sm">
        <Navbar isLoggedIn={isLoggedIn} />
      </div>

      {/* Course Details Content */}
      <div className="container mx-auto px-6 py-12 flex-grow">
        <Link to="/course" className="text-[#026078] hover:underline pl-8">↰ Kembali ke Daftar Kelas</Link>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Course Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <img
                  src={course.course_image_cover}
                  alt={course.course_name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = temporaryImage;
                  }}
                />
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.course_name}</h1>
              <p className="text-gray-600 mb-4">Dibuat: {formatDate(course.created_at)}</p>

              {/* Course Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {['Overview', 'Kurikulum', 'Penulis', 'Ulasan'].map((tab) => (
                    <button
                      key={tab}
                      className={`py-4 px-1 ${activeTab === tab
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
                    <h2 className="text-xl font-bold text-gray-800 mb-4">DESKRIPSI KURSUS</h2>

                    <p className="text-gray-600 mb-4">
                      {course.course_description}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Kurikulum' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">KURIKULUM KURSUS</h2>
                  <p className="text-gray-600">Informasi kurikulum akan ditampilkan di sini.</p>
                </div>
              )}

              {activeTab === 'Penulis' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">PENULIS KURSUS</h2>
                  <p className="text-gray-600">Penulis kursus akan ditampilkan di sini.</p>
                </div>
              )}

              {activeTab === 'Ulasan' && (
                <div>
                  {/* Review Section */}
                  <div className="bg-white rounded-lg">
                    {showReviewForm ? (
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Bagaimana pengalaman belajarmu?</h3>
                        <div className="mb-6">
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B7077] focus:border-transparent"
                            rows="4"
                            placeholder="Bagaimana pengalaman belajarmu di kelas ini?"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                          ></textarea>

                          <div className="flex justify-end mt-4">
                            <button
                              className="bg-[#0B7077] hover:bg-[#014b60] text-white px-6 py-2 rounded-md font-medium transition-colors"
                              onClick={postReview}
                            >
                              Kirim Ulasan
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null
                    }

                    {/* Reviews List with Filter */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Ulasan Pengguna</h3>
                        <div className="relative">
                          <div className="inline-block">
                            <select
                              value={reviewFilter}
                              onChange={(e) => setReviewFilter(e.target.value)}
                              className="text-lg border-2 border-[#026078] rounded-md py-1 px-2"
                            >
                              <option value="Semua">Semua</option>
                              <option value="positif">Positif</option>
                              <option value="negatif">Negatif</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Reviews */}
                      <div className="space-y-6">
                        {getFilteredReviews().length > 0 ? (
                          getFilteredReviews().map((review) => (
                            <div key={review.review_id} className="border-b border-gray-200 pb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-gray-800">{review.nama}</span>
                                <span className="text-sm text-gray-500">{formatDate(review.updated_at)}</span>
                              </div>
                              <p className="text-gray-700 mb-2">{review.content}</p>
                              <div className='flex items-center justify-between'>
                                <span className={`text-xs px-2 py-1 rounded-full ${review.sentiment === 'positif'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                                  }`}>
                                  {review.sentiment === 'positif' ? 'Positif' : 'Negatif'}
                                </span>
                                {review.user_id === userId && (
                                  <img 
                                    src={deleteIcon}
                                    alt="delete"
                                    className="w-4 cursor-pointer"
                                    onClick={() => { 
                                      setSelectedReviewId(review.review_id);
                                      setShowModal(true); 
                                    }} 
                                  />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">Tidak ada ulasan yang ditemukan</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Detail Kursus</h3>
              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-[#0B7077]">{formatPrice(course.course_price)}</span>
              </div>

              <div className="text-green-600 font-medium mb-6">Dari sumber terpercaya</div>

              <div className="space-y-4 mb-8">
                {course.created_at && (
                  <div className="course-feature flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-600">Tanggal Terbit</span>
                    <span className="text-gray-800 font-medium">{formatDate(course.created_at)}</span>
                  </div>
                )}
                {course.course_price && (
                  <div className="course-feature flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-600">Harga Kursus</span>
                    <span className="text-gray-800 font-medium">{formatPrice(course.course_price)}</span>
                  </div>
                )}
                {/* {course.skill_level && (
                  <div className="course-feature flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-600">Tingkat Kesulitan</span>
                    <span className="text-gray-800 font-medium">Mudah</span>
                  </div>
                )} */}

                <div className="course-feature flex justify-between border-b border-gray-200 pb-4">
                  <span className="text-gray-600">Bahasa Kursus</span>
                  <span className="text-gray-800 font-medium">Bahasa Indonesia</span>
                </div>

              </div>

              {/* Enrollment Status Message */}
              {enrollStatus && (
                <div className={`mb-4 p-3 rounded-md ${enrollStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {enrollStatus.message}
                </div>
              )}

              <button
                className={`bg-[#0B7077] hover:bg-[#014b60] text-white w-full py-3 rounded-md font-medium transition ${enrollLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                onClick={handleEnrollCourse}
                disabled={enrollLoading}
              >
                {enrollLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <PopupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          if (selectedReviewId) {
            deleteHandleClick(selectedReviewId);
          }
        }}
        message="Apakah Anda yakin ingin menghapus ulasan ini?"
        confirmText="Hapus"
        cancelText="Batal"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CourseDetailPage;