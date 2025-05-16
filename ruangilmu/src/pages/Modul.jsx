import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModulContent from '../components/jsx/ModulContent';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';

// Mock data that would typically come from backend
const mockModuleData = [
  {
    title: "Modul 1: Bilangan Bulat",
    description: "Memahami konsep bilangan bulat dan operasi dasar",
    isActive: true,
    lessons: [
      {
        title: "Pengenalan Bilangan Bulat",
        description: "Materi ini akan mengajarkan tentang pengertian bilangan bulat positif dan negatif beserta contohnya dalam kehidupan sehari-hari.",
        image: {
          src: "https://i.imgur.com/JQZ6XeP.png",
          alt: "Contoh Bilangan Bulat",
          caption: "Gambar contoh bilangan bulat dalam garis bilangan"
        },
        video: {
          src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          caption: "Video penjelasan konsep bilangan bulat (3:45 menit)"
        },
        duration: "15 menit",
        hasPdf: true
      },
      {
        title: "Operasi Penjumlahan Bilangan Bulat",
        description: "Belajar cara menjumlahkan bilangan bulat positif dan negatif dengan metode garis bilangan.",
        image: {
          src: "https://i.imgur.com/3QZJQJp.png",
          alt: "Penjumlahan Bilangan Bulat",
          caption: "Contoh penjumlahan bilangan bulat"
        },
        duration: "20 menit",
        hasPdf: true
      }
    ]
  },
  {
    title: "Modul 2: Pengukuran",
    description: "Belajar mengukur panjang, berat, dan waktu",
    isActive: false,
    lessons: [
      {
        title: "Satuan Panjang",
        description: "Mengenal satuan panjang (km, m, cm) dan cara mengkonversinya.",
        duration: "15 menit",
        hasPdf: true
      },
      {
        title: "Satuan Berat",
        description: "Memahami satuan berat (kg, g) dan alat ukur yang digunakan.",
        duration: "15 menit",
        hasPdf: true
      },
      {
        title: "Satuan Waktu",
        description: "Belajar membaca jam dan mengkonversi satuan waktu.",
        duration: "15 menit",
        hasPdf: true
      }
    ]
  }
];

const Modul = () => {
  const [activeTab, setActiveTab] = useState('silabus');
  const courseInfo = {
    icon: "aset/math-icon.svg",
    title: "Matematika Dasar Kelas 4",
    description: "Belajar konsep dasar matematika untuk siswa kelas 4 SD",
    stats: [
      { label: "20 Materi" },
      { label: "10 Video" },
      { label: "5 Quiz" }
    ]
  };

  // This would typically fetch different content based on the active tab
  const getTabContent = () => {
    switch (activeTab) {
      case 'silabus':
        return <ModulContent modules={mockModuleData} />;
      case 'materi':
        return <div className="p-6 bg-white rounded-lg">Content untuk tab Materi akan di-load di sini</div>;
      case 'tugas':
        return <div className="p-6 bg-white rounded-lg">Content untuk tab Tugas akan di-load di sini</div>;
      case 'diskusi':
        return <div className="p-6 bg-white rounded-lg">Content untuk tab Diskusi akan di-load di sini</div>;
      default:
        return <ModulContent modules={mockModuleData} />;
    }
  };

  return (
    <div className="bg-gray-50">
        <Navbar/>
      
        
      {/* Course Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to={`/course/${'course_id'}`} className="text-[#026078] hover:underline pl-8">↰ Kembali ke Daftar Kelas</Link>
        {/* Course Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-[#D2E6E4] rounded-lg flex items-center justify-center">
            <img src={courseInfo.icon} alt="Course Icon" className="w-16 h-16" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#026078]">{courseInfo.title}</h1>
            <p className="text-gray-600 mt-2">{courseInfo.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {courseInfo.stats.map((stat, index) => (
                <span key={index} className="bg-[#E6F7FF] text-[#0B7077] px-3 py-1 rounded-full text-sm">
                  {stat.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Syllabus Tabs */}
        <div className="flex overflow-x-auto mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'silabus' ? 'active-tab' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab('silabus')}
            >
              Silabus
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'materi' ? 'active-tab' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab('materi')}
            >
              Materi
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'tugas' ? 'active-tab' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab('tugas')}
            >
              Tugas
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'diskusi' ? 'active-tab' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab('diskusi')}
            >
              Diskusi
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {getTabContent()}
      </div>
              
    <Footer/>
    </div>
  );
};

export default Modul;