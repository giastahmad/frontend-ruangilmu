import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import { apiService } from '../components/utils/authMiddleware';

const Dashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        progress: 0,
        courses: [],
        hasSubscription: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log('Token USER:', token);
        setIsLoggedIn(!!token);

        // Fetch only essential user data
        const fetchUserData = async () => {
            try {
                // Fetch user profile data
                const userResponse = await apiService.get('https://backend-ruangilmu-production.up.railway.app/user/me');
                if (!userResponse.ok) {
                    throw new Error(`HTTP error! status: ${userResponse.status}`);
                }
                const userResult = await userResponse.json();

                // Process user data
                if (userResult.status === 'success' && userResult.data?.user) {
                    setUserData(prevData => ({
                        ...prevData,
                        name: userResult.data.user.nama,
                        email: userResult.data.user.email,
                        kelas: userResult.data.user.kelas,
                        isVerified: userResult.data.user.isverified,
                        photoProfile: userResult.data.user.photo_profile,
                        userId: userResult.data.user.user_id,
                        courses: [], // Will be populated by enrolled courses check
                        progress: 0 // Will be calculated after courses and certificates are loaded
                    }));
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Gagal memuat data pengguna');
            } finally {
                setLoading(false);
            }
        };

        // Separate function to fetch enrolled courses
        const fetchEnrolledCourses = async () => {
            try {
                const coursesResponse = await apiService.get('https://backend-ruangilmu-production.up.railway.app/courses/user/enrolled');

                if (coursesResponse.ok) {
                    const coursesResult = await coursesResponse.json();

                    if (coursesResult.status === 'success' && coursesResult.data) {
                        const coursesData = coursesResult.data.map(course => ({
                            id: course.course_id,
                            title: course.course_name,
                            status: "Sedang dipelajari", // Default status, will be updated by certificate check
                            isCompleted: false // Default, will be updated by certificate check
                        }));

                        setUserData(prevData => ({
                            ...prevData,
                            courses: coursesData
                        }));
                    }
                } else {
                    console.log('Enrolled courses endpoint not accessible or user has no enrolled courses');
                }
            } catch (err) {
                console.log('Enrolled courses check failed (this is normal if user has no enrolled courses):', err);
                // Don't set error here as this is optional data
            }
        };

        // Separate function to fetch certificates (this can fail without breaking the main dashboard)
        const fetchCertificates = async () => {
            try {
                const certificatesResponse = await apiService.get('https://backend-ruangilmu-production.up.railway.app/course/certificates');

                if (certificatesResponse.ok) {
                    const certificatesResult = await certificatesResponse.json();

                    if (certificatesResult.status === 'success') {
                        const completedCourseIds = certificatesResult.data.map(cert => cert.course_id);

                        // Update courses with completion status
                        setUserData(prevData => {
                            const updatedCourses = prevData.courses.map(course => ({
                                ...course,
                                status: completedCourseIds.includes(course.id) ? "Selesai" : "Sedang dipelajari",
                                isCompleted: completedCourseIds.includes(course.id)
                            }));

                            // Calculate progress based on completed courses
                            const totalCourses = updatedCourses.length;
                            const completedCourses = updatedCourses.filter(course => course.isCompleted).length;
                            const progressPercentage = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

                            return {
                                ...prevData,
                                courses: updatedCourses,
                                progress: progressPercentage
                            };
                        });
                    }
                } else {
                    console.log('Certificate endpoint not accessible or user has no certificates yet');
                    // This is not an error - user might simply have no completed courses yet
                }
            } catch (err) {
                console.log('Certificate check failed (this is normal if user has no completed courses):', err);
                // Don't set error here as this is optional data
            }
        };

        if (token) {
            // Fetch essential user data first
            fetchUserData().then(() => {
                // Then try to fetch enrolled courses (optional)
                fetchEnrolledCourses().then(() => {
                    // Finally try to fetch certificates (optional)
                    fetchCertificates();
                });
            });
        } else {
            setLoading(false);
        }
    }, []);

    // Calculate the stroke dashoffset for the progress circle
    const calculateDashoffset = (percent) => {
        const circumference = 2 * Math.PI * 45;
        return circumference - (circumference * percent / 100);
    };

    if (!isLoggedIn) {
        return (
            <div className='bg-[#f8fafc] min-h-screen'>
                <Navbar isLoggedIn={isLoggedIn} />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-600">Silahkan masuk atau daftarkan akun terlebih dahulu</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (loading) {
        return (
            <div className='bg-[#f8fafc] min-h-screen'>
                <Navbar isLoggedIn={isLoggedIn} />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-600">Memuat data pengguna...</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-[#f8fafc] min-h-screen'>
                <Navbar isLoggedIn={isLoggedIn} />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-red-600">{error}</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className='bg-[#f8fafc]'>
            <Navbar isLoggedIn={isLoggedIn} />
            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <section className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Selamat datang, {userData.name || 'Pengguna'}!
                    </h1>
                    <p className="text-gray-600 mt-2">Semoga aktivitas belajarmu menyenangkan.</p>
                    {userData.kelas && (
                        <p className="text-sm text-gray-500 mt-1">Kelas: {userData.kelas}</p>
                    )}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Learning Activities */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Aktivitas Belajar</h2>

                            <div className="space-y-4">
                                {userData.courses.length > 0 ? (
                                    userData.courses.map(course => (
                                        <div
                                            key={course.id}
                                            className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                        >
                                            <div>
                                                <p className={`text-sm ${course.isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {course.status}
                                                </p>
                                                <h3 className="font-medium text-gray-800">{course.title}</h3>
                                            </div>
                                            {course.isCompleted ? (
                                                <div className="mt-2 sm:mt-0 flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={`/modul/${course.id}`}
                                                    className="mt-2 sm:mt-0 bg-[#0B7077] hover:bg-[#014b60] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    LANJUTKAN
                                                </Link>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Belum ada kursus yang diikuti.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Subscription Status */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Status Langganan</h2>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <p className="text-gray-600 mb-4 sm:mb-0">
                                    {userData.hasSubscription
                                        ? "Kamu sudah berlangganan RuangIlmu."
                                        : "Kamu belum berlangganan RuangIlmu. Pilih paket langganan dan mulai pembelajaran kamu!"}
                                </p>
                                <button
                                    className="bg-[#0B7077] hover:bg-[#014b60] text-white px-6 py-3 rounded-md font-medium transition-colors whitespace-nowrap"
                                >
                                    PILIH PAKET LANGGANAN
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Progress */}
                    <div className="lg:col-span-1">
                        <section className="bg-white rounded-lg shadow-sm p-6 h-full">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Progress Belajar</h2>

                            <div className="flex flex-col items-center">
                                {/* Circular Progress */}
                                <div className="relative w-40 h-40 mb-4">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        {/* Background circle */}
                                        <circle
                                            className="text-gray-200"
                                            strokeWidth="8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="45"
                                            cx="50"
                                            cy="50"
                                        />
                                        {/* Progress circle */}
                                        <circle
                                            className="text-[#55C1E6]"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="45"
                                            cx="50"
                                            cy="50"
                                            style={{
                                                strokeDasharray: 2 * Math.PI * 45,
                                                strokeDashoffset: calculateDashoffset(userData.progress),
                                                transition: 'stroke-dashoffset 0.5s ease'
                                            }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-gray-800">{userData.progress}%</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-center mb-6">
                                    Kamu telah menyelesaikan {userData.progress}% dari materi pembelajaran.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;