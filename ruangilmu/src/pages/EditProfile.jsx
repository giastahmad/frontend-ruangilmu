import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/jsx/Navbar';
import Footer from '../components/jsx/Footer';
import { Upload, Trash2 } from 'lucide-react';
import { apiService } from '../components/utils/authMiddleware';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    classLevel: '',
    birthDate: '',
  });
  const [profilePic, setProfilePic] = useState('/images/profile.png');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [error, setError] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Token USER:', token);
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserProfile(token);
    }

  }, []);

  const fetchUserProfile = async (token) => {
    console.log('TOKENNN: ', token)
    try {
      setIsLoading(true)
      const response = await apiService.get('http://ruangilmu.up.railway.app/user/me');

      if (!response.ok) {
        console.log('Token user:', token);
        throw new Error('Gagal Mengambil Data');
      }

      const data = await response.json();
      console.log('Fetched user data:', data);
      const userData = data.data.user || {};
      setUser(userData);

      // Set profile picture if available
      if (userData.user_profile) {
        setProfilePic(`http://ruangilmu.up.railway.app/uploads/userprofile/${userData.user_profile}`);
      }

      // Split name into first name and last name
      if (userData.nama) {
        if (userData.nama.includes(' ')) {
          // If name has spaces, split into first and last name
          const nameParts = userData.nama.split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');

          // Format birth date if available
          let formattedBirthDate = '';
          if (userData.tanggal_lahir) {
            formattedBirthDate = userData.tanggal_lahir.substring(0, 10);
          }

          setFormData({
            firstName,
            lastName,
            classLevel: userData.kelas || '',
            birthDate: formattedBirthDate
          });
        } else {
          // Handle single-word name (no spaces)
          // In this case, put the whole name in firstName and leave lastName empty
          let formattedBirthDate = '';
          if (userData.tanggal_lahir) {
            formattedBirthDate = userData.tanggal_lahir.substring(0, 10);
          }

          setFormData({
            firstName: userData.nama,
            lastName: '',
            classLevel: userData.kelas || '',
            birthDate: formattedBirthDate
          });
        }
      }
    } catch (error) {
      console.error('Error mengambil data: ', error);
      setError('Gagal Menampilkan data user, coba sesaat lagi');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  // Handle profile picture file selection
  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validasi file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Hanya file gambar (JPG, JPEG, PNG) yang diperbolehkan');
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB
        setError('Ukuran file maksimal 2MB');
        return;
      }

      setSelectedFile(file);
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setProfilePic(fileUrl);

      // Auto upload setelah file dipilih
      uploadProfilePicture(file);
    }
  };

  // Upload profile picture to backend
  const uploadProfilePicture = async (file) => {
    setIsUploadingPhoto(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profile_picture', file);

      // Upload using fetch with proper headers
      const response = await fetch('http://ruangilmu.up.railway.app/user/update-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengupload foto profil');
      }

      setSuccessMessage('Foto profil berhasil diperbarui!');

      // Update profile picture URL dengan yang baru dari server
      if (data.data && data.data.user && data.data.user.user_profile) {
        setProfilePic(`http://ruangilmu.up.railway.app/uploads/userprofile/${data.data.user.user_profile}`);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError(error.message || 'Terjadi kesalahan saat mengupload foto profil');

      // Reset to previous profile picture on error
      if (user.user_profile) {
        setProfilePic(`http://ruangilmu.up.railway.app/uploads/userprofile/${user.user_profile}`);
      } else {
        setProfilePic('/images/profile.png');
      }
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle profile picture removal
  const handleRemovePic = () => {
    // Untuk menghapus foto profil, Anda mungkin perlu endpoint terpisah di backend
    // Untuk sementara, kita reset ke default
    setProfilePic('/images/profile.png');
    setSelectedFile(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Combine first name and last name to create the full name
      const fullName = formData.firstName + (formData.lastName ? ` ${formData.lastName}` : '');

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const response = await apiService.post('http://ruangilmu.up.railway.app/user/update-profile', {
        nama: fullName,
        kelas: formData.classLevel,
        tanggal_lahir: formData.birthDate,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui profil');
      }

      setSuccessMessage('Profil berhasil diperbarui!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Terjadi kesalahan saat memperbarui profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Edit Profile Content */}
      <div className="container mx-auto px-6 py-12 flex-grow">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-32 h-32 rounded-md border-4 border-[#0B7077] object-cover"
                    onError={(e) => {
                      e.target.src = '/images/profile.png';
                    }}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {formData.firstName} {formData.lastName}
                </h2>
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

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B7077]"></div>
                </div>
              ) : (
                <>
                  {/* Profile Picture Upload */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-3">Foto Profil</label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        {isUploadingPhoto && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                          </div>
                        )}
                        <img
                          src={profilePic}
                          alt="Current Profile"
                          className="w-32 h-32 rounded-md border-2 border-[#0B7077] object-cover"
                          onError={(e) => {
                            e.target.src = '/images/profile.png';
                          }}
                        />
                      </div>
                      <div>
                        <input
                          type="file"
                          id="profile-pic"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          disabled={isUploadingPhoto}
                        />
                        <label
                          htmlFor="profile-pic"
                          className={`cursor-pointer border border-[#0B7077] text-[#0B7077] px-4 py-2 rounded-md inline-flex items-center hover:bg-gray-50 ${isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          {isUploadingPhoto ? 'Mengupload...' : 'Ganti Foto'}
                        </label>
                        <button
                          type="button"
                          className="ml-3 text-gray-500 hover:text-red-500 flex items-center"
                          onClick={handleRemovePic}
                          disabled={isUploadingPhoto}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Hapus
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                          Format: JPG, JPEG, PNG. Maksimal 2MB.
                        </p>
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
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                          Nama Belakang
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="classLevel" className="block text-gray-700 font-medium mb-2">
                        Kelas
                      </label>
                      <select
                        id="classLevel"
                        value={formData.classLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B7077]"
                      >
                        <option value="">Pilih Kelas</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="birthDate" className="block text-gray-700 font-medium mb-2">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        value={formData.birthDate}
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
                        disabled={isLoading}
                      >
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </form>
                </>
              )}
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