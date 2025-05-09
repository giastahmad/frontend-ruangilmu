import { useState, useContext, useEffect } from 'react';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import { UserContext } from '../components/jsx/UserContext';
import { Link } from 'react-router-dom';

const EditProfile = () => {
  const { user, loading, updateUser } = useContext(UserContext);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });
  
  // Profile picture state
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        socialMedia: {
          facebook: user.socialMedia?.facebook || '',
          instagram: user.socialMedia?.instagram || '',
          linkedin: user.socialMedia?.linkedin || ''
        }
      });
      setProfilePicPreview(user.profilePic || 'img/profile-pic.jpg');
    }
  }, [user]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social-')) {
      const socialNetwork = name.split('-')[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialNetwork]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };
  
  // Remove profile picture
  const handleRemoveProfilePic = () => {
    setProfilePic(null);
    setProfilePicPreview('img/profile-pic.jpg');
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData object to handle file upload
    const data = new FormData();
    if (profilePic) {
      data.append('profilePic', profilePic);
    }
    
    // Append other form data
    Object.keys(formData).forEach(key => {
      if (key === 'socialMedia') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });
    
    // Update user in context and send to backend
    updateUser(formData); // Changed from data to formData since FormData may not update correctly in our mock
  };
  
  // Handle cancel
  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        socialMedia: {
          facebook: user.socialMedia?.facebook || '',
          instagram: user.socialMedia?.instagram || '',
          linkedin: user.socialMedia?.linkedin || ''
        }
      });
      setProfilePicPreview(user.profilePic || 'img/profile-pic.jpg');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-xl text-gray-700">Loading user data...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img 
                      src={profilePicPreview} 
                      alt="Profile"
                      className="w-32 h-32 rounded-md border-4 border-[#0B7077] object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">Murid di RuangIlmu</p>

                  {/* Navigation Menu */}
                  <div className="w-full mt-6 space-y-2">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      Profile Overview
                    </Link>
                    <Link 
                      to="/edit-profile" 
                      className="block px-4 py-2 bg-[#0B7077] text-white rounded-md"
                    >
                      Edit Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      Account Settings
                    </Link>
                    <Link 
                      to="/certificates" 
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      My Certificates
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Edit Form */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profil</h1>

                {/* Profile Picture Upload */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-3">Foto Profil</label>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img 
                        src={profilePicPreview} 
                        alt="Current Profile"
                        className="w-24 h-24 rounded-md border-2 border-[#0B7077] object-cover"
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
                        className="cursor-pointer border border-[#0B7077] text-[#0B7077] px-4 py-2 rounded-md inline-flex items-center hover:bg-gray-50 transition-all duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Ganti Foto
                      </label>
                      <button 
                        className="ml-3 text-gray-500 hover:text-red-500"
                        onClick={handleRemoveProfilePic}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Information Form */}
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">Nama Depan</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        name="firstName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Nama Belakang</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        name="lastName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Alamat Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">Bio</label>
                    <textarea 
                      id="bio" 
                      name="bio"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Lokasi</label>
                      <input 
                        type="text" 
                        id="location" 
                        name="location"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Nomor Telepon</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                        value={formData.phone}
                        onChange={handleChange}
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
                          name="social-facebook"
                          placeholder="Facebook profile URL"
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                          value={formData.socialMedia.facebook}
                          onChange={handleChange}
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
                          name="social-instagram"
                          placeholder="Instagram profile URL"
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                          value={formData.socialMedia.instagram}
                          onChange={handleChange}
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
                          name="social-linkedin"
                          placeholder="LinkedIn profile URL"
                          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                          value={formData.socialMedia.linkedin}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4">
                    <button 
                      type="button" 
                      className="border border-[#0B7077] text-[#0B7077] px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-all duration-300"
                      onClick={handleCancel}
                    >
                      Batalkan
                    </button>
                    <button 
                      type="submit" 
                      className="bg-[#0B7077] text-white px-6 py-2 rounded-md font-medium hover:bg-[#014b60] transition-all duration-300"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default EditProfile;