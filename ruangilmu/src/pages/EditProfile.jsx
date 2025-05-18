import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import { Upload, Trash2 } from 'lucide-react';

const EditProfile = () => {
  // State for user data
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Passionate learner focused on product management and data science.',
    location: 'Jakarta, Indonesia',
    phone: '+62 812-3456-7890',
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  // State for profile picture
  const [profilePic, setProfilePic] = useState('/img/profile-pic.jpg');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   useEffect(() => {
      const token = localStorage.getItem('accessToken');
      console.log('Token USER:', token);
      setIsLoggedIn(!!token);
    }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.includes('-')) {
      // Handle social media inputs
      const platform = id.split('-')[0];
      setUserData({
        ...userData,
        socialMedia: {
          ...userData.socialMedia,
          [platform]: value
        }
      });
    } else {
      // Handle normal inputs
      setUserData({
        ...userData,
        [id]: value
      });
    }
  };
  
  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Here we would normally upload to a server
      // For now, we'll just create a local URL
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setProfilePic(fileUrl);
    }
  };
  
  // Handle profile picture removal
  const handleRemovePic = () => {
    setProfilePic('/img/default-avatar.jpg');
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we would send the data to a server
    console.log('Form submitted:', userData);
    // Show success message or redirect
    alert('Profile updated successfully!');
  };

  return (
    <div className="bg-gray-50">
      {/* Navigation */}
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Edit Profile Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img 
                    src={profilePic} 
                    alt="Profile"
                    className="w-32 h-32 rounded-md border-4 border-[#0B7077] object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{userData.firstName} {userData.lastName}</h2>
                <p className="text-gray-600 mb-4">Murid di RuangIlmu</p>

                {/* Navigation Menu */}
                <div className="w-full mt-6 space-y-2">
                  <Link to="/profile" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                    Profile Overview
                  </Link>
                  <Link to="/edit-profile" className="block px-4 py-2 bg-[#0B7077] text-white rounded-md">
                    Edit Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                    Account Settings
                  </Link>
                  <Link to="/certificates" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                    My Certificates
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Edit Form */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profil</h1>

              {/* Profile Picture Upload */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">Foto Profil</label>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img 
                      src={profilePic} 
                      alt="Current Profile"
                      className="w-50 h-50 rounded-md border-2 border-[#0B7077] object-cover"
                    />
                  </div>
                  <div>
                    <input 
                      type="file" 
                      id="profile-pic" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfilePicChange}
                    />
                    <label 
                      htmlFor="profile-pic"
                      className="cursor-pointer border border-[#0B7077] text-[#0B7077] px-4 py-2 rounded-md inline-flex items-center hover:bg-gray-50"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Ganti Foto
                    </label>
                    <button 
                      className="ml-3 text-gray-500 hover:text-red-500 flex items-center"
                      onClick={handleRemovePic}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Information Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                      Nama Depan
                    </label>
                    <input 
                      type="text" 
                      id="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                      Nama Belakang
                    </label>
                    <input 
                      type="text" 
                      id="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Kelas
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                    Tanggal Lahir
                  </label>
                  <textarea 
                    id="bio" 
                    rows="3"
                    value={userData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                  <Link 
                    to="/profile" 
                    className="border border-[#0B7077] text-[#0B7077] px-6 py-2 rounded-md font-medium hover:bg-gray-50"
                  >
                    Batalkan
                  </Link>
                  <button 
                    type="submit" 
                    className="bg-[#0B7077] text-white px-6 py-2 rounded-md font-medium hover:bg-[#014b60]"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EditProfile;