import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';

const Dashboard = () => {
    // In a real app, this would come from props or state
    const userData = {
        name: "John Doe",
        progress: 82,
        courses: [
            {
                id: 1,
                title: "Mathematics Fundamentals",
                status: "Sedang dipelajari"
            },
            {
                id: 2,
                title: "Mathematics Expert",
                status: "Sedang dipelajari"
            }
        ],
        hasSubscription: false
    };

    // Calculate the stroke dashoffset for the progress circle
    const calculateDashoffset = (percent) => {
        const circumference = 2 * Math.PI * 45;
        return circumference - (circumference * percent / 100);
    };

    return (
        <div className='bg-[#f8fafc]'>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <section className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Selamat datang, {userData.name}!</h1>
                    <p className="text-gray-600 mt-2">Semoga aktivitas belajarmu menyenangkan.</p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Learning Activities */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Aktivitas Belajar</h2>

                            <div className="space-y-4">
                                {userData.courses.map(course => (
                                    <div
                                        key={course.id}
                                        className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                    >
                                        <div>
                                            <p className="text-sm text-gray-500">{course.status}</p>
                                            <h3 className="font-medium text-gray-800">{course.title}</h3>
                                        </div>
                                        <Link to={`/course/${course.id}`} className="mt-2 sm:mt-0 bg-[#0B7077] hover:bg-[#014b60] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            LANJUTKAN
                                        </Link>
                                    </div>
                                ))}
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