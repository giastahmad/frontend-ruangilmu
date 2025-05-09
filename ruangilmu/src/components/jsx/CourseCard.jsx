// src/components/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { 
    id, 
    image, 
    startDate,
    endDate,
    studentCount,
    title,
    description,
    price,
    originalPrice
  } = course;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500">{startDate} - {endDate}</span>
          <div className="flex items-center text-sm text-gray-500">
            <span>{studentCount}</span>
            <span className="ml-1">students</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-[#0B7077]">${price}</span>
            {originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">${originalPrice}</span>
            )}
          </div>
          <Link 
            to={`/course/${id}`} 
            className=" text-white bg-[#0B7077] hover:bg-[#014b60] px-4 py-2 rounded-md transition duration-300"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;