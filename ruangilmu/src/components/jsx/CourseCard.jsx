// src/components/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import temporaryImage from '../img/temp.svg';

const CourseCard = ({ course }) => {
  const { 
    course_id,
    course_name,
    course_description,
    course_image_cover,
    course_price,
    created_at, 
  } = course;

  // Format the date
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
      <img 
      src={course_image_cover || temporaryImage}
      alt={course_name}
      className="w-full h-48 object-cover" 
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = temporaryImage
      }}
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500">Dibuat: {formatDate(created_at)}</span>
          {/* <div className="flex items-center text-sm text-gray-500">
            <span>{studentCount}</span>
            <span className="ml-1">students</span>
          </div> */}
        </div>
        <div className='h-14 overflow-hidden mb-4'>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course_name}</h3>
        </div>
        <div className="h-12 overflow-hidden mb-4">
          <p className="text-gray-600 line-clamp-2">
            {course_description}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-[#0B7077]">{formatPrice(course_price)}</span>
            {/* {originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">${originalPrice}</span>
            )} */}
          </div>
          <Link 
<<<<<<< HEAD
            to={`/course/${id}`} 
=======
            to={`/course/${course_id}`} 
>>>>>>> 8dba86c5f8584261445908035d0a506ff7126e26
            className=" text-white bg-[#0B7077] hover:bg-[#014b60] px-4 py-2 rounded-md transition duration-300"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;