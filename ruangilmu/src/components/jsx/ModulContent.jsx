import React from 'react';

const ModulContent = ({ modules }) => {
  if (!modules || modules.length === 0) {
    return (
      <div className="syllabus-container p-6 mb-8 bg-[#ffffff] border-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h2 className="text-2xl font-bold text-[#026078] mb-6">Silabus Pembelajaran</h2>
        <div className="bg-white p-6 rounded-lg">
          <p className="text-gray-600">Tidak ada modul yang tersedia untuk kelas ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="syllabus-container p-6 mb-8 bg-[#ffffff] border-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <h2 className="text-2xl font-bold text-[#026078] mb-6">Silabus Pembelajaran</h2>

      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="module-card bg-white px-6 py-2 rounded-lg mb-6 transition-all duration-300 border-l-[4px] border-[#0b7077] hover:-translate-y-[3px] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]">
          {/* <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#026078] mb-2">{module.title}</h3>
            </div>
          </div> */}

          {module.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-10 h-10 ${
                    module.isActive ? 'bg-[#D2E6E4]' : 'bg-gray-100'
                  } rounded-full flex items-center justify-center ${
                    module.isActive ? 'text-[#0B7077]' : 'text-gray-500'
                  } font-bold`}
                >
                  {module.order}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{lesson.title}</h4>
                  
                  {/* Handle HTML content safely */}

                  {lesson.image && (
                    <div className="mb-4">
                      <img 
                        src={lesson.image.src} 
                        alt={lesson.image.alt || 'Gambar materi'}
                        className="rounded-lg w-full max-w-md" 
                      />
                      {lesson.image.caption && (
                        <p className="text-sm text-gray-500 mt-1">{lesson.image.caption}</p>
                      )}
                    </div>
                  )}

                  {lesson.video && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-800 mb-2">Video Pembelajaran</h5>
                      <div className="video-container relative pb-[56.25%] h-0 overflow-hidden">
                        <iframe 
                          src={lesson.video.src} 
                          title={`Video ${lesson.title}`}
                          className="absolute top-0 left-0 w-full h-full rounded-[8px]"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      {lesson.video.caption && (
                        <p className="text-sm text-gray-500 mt-1">{lesson.video.caption}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    {lesson.duration && (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="mr-4">{lesson.duration}</span>
                      </>
                    )}

                    {lesson.hasPdf && (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="cursor-pointer text-[#0B7077] hover:underline">PDF Materi</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ModulContent;