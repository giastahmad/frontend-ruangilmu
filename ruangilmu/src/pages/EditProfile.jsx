import React, { useState } from 'react';
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
      <Navbar />

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
                    Alamat Email
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
                    Bio
                  </label>
                  <textarea 
                    id="bio" 
                    rows="3"
                    value={userData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                      Lokasi
                    </label>
                    <input 
                      type="text" 
                      id="location"
                      value={userData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Nomor Telepon
                    </label>
                    <input 
                      type="tel" 
                      id="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Sosial Media</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 flex-shrink-0 text-[#0B7077]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </div>
                      <input 
                        type="url" 
                        id="facebook-url"
                        placeholder="Facebook profile URL"
                        value={userData.socialMedia.facebook}
                        onChange={handleChange}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 flex-shrink-0 text-[#0B7077]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <input 
                        type="url" 
                        id="instagram-url"
                        placeholder="Instagram profile URL"
                        value={userData.socialMedia.instagram}
                        onChange={handleChange}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 flex-shrink-0 text-[#0B7077]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </div>
                      <input 
                        type="url" 
                        id="linkedin-url"
                        placeholder="LinkedIn profile URL"
                        value={userData.socialMedia.linkedin}
                        onChange={handleChange}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                      />
                    </div>
                  </div>
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