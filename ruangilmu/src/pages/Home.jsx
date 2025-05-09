// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/jsx/CourseCard';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import kidImage from '../components/img/kids.png';

import course1Image from '../components/img/temp.svg';
import course2Image from '../components/img/temp.svg';
import course3Image from '../components/img/temp.svg';
import course4Image from '../components/img/temp.svg';

const Home = () => {
    const [selectedClass, setSelectedClass] = useState('Kelas 4');
    const [selectedSemester, setSelectedSemester] = useState('Semester 1');

    // Sample course data - this would typically come from an API
    const courses = [
        {
            id: 1,
            image: course1Image,
            startDate: "1 July 2022",
            endDate: "20 July 2022",
            studentCount: 40,
            title: "Product Management Basic - Course",
            description: "Product Management Materials: you will learn with Dutch Literature - Head of Product Customer Platform Graph Features.",
            price: 380,
            originalPrice: 500
        },
        {
            id: 2,
            image: course2Image,
            startDate: "1 July 2022",
            endDate: "20 July 2022",
            studentCount: 40,
            title: "Product Management Basic - Course",
            description: "Product Management Materials: you will learn with Dutch Literature - Head of Product Customer Platform Graph Features.",
            price: 380,
            originalPrice: 500
        },
        {
            id: 3,
            image: course3Image,
            startDate: "1 July 2022",
            endDate: "20 July 2022",
            studentCount: 40,
            title: "Product Management Basic - Course",
            description: "Product Management Materials: you will learn with Dutch Literature - Head of Product Customer Platform Graph Features.",
            price: 380,
            originalPrice: 500
        },
        {
            id: 4,
            image: course4Image,
            startDate: "1 July 2022",
            endDate: "20 July 2022",
            studentCount: 40,
            title: "Product Management Basic - Course",
            description: "Product Management Materials: you will learn with Dutch Literature - Head of Product Customer Platform Graph Features.",
            price: 380,
            originalPrice: 500
        }
    ];

    return (
        <div className="bg-[#d2e6e4]">
            <Navbar />

            {/* Hero Section */}
            <section className="container mx-auto px-4 md:px-24">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 mb-8 md:mb-0 pb-4 items-start">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 hero-text">
                            Ruang Hidup Belajar
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 mb-8">
                            Perluas <span className="font-bold text-[#0B7077]">kemampuanmu</span> dengan belajar di <span className="font-bold text-[#0B7077]">RuangIlmu!</span>
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link
                                to="/register"
                                className="bg-[#0B7077] text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-[#014b60] transition text-center explore-btn"
                            >
                                DAFTAR SEKARANG
                            </Link>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-8">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">250k</p>
                                    <p className="text-gray-600">Murid terbantu</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                                    <p className="text-gray-600">Akses Kelas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center items-end">
                        <img
                            src={kidImage}
                            alt="Learning Illustration"
                            className="w-full max-w-lg h-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Subject Section */}
            <section className="bg-gray-50 py-8 px-4 md:px-24">
                <div className="container mx-auto space-y-6">
                    <div className="grid grid-cols-3 sm:flex-row items-center gap-3">
                        <div className='flex flex-row justify-start col-span-2 space-x-3'>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Materi untuk</h2>
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
                        <div className='flex place-self-end items-center'>
                            <Link to="/course" className='text-[#026078] hover:underline pl-8"'>Materi Lainnya</Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
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