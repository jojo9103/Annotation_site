import React from 'react';

const ImageNavigator = ({ images, currentIndex, onSelectImage, annotations }) => {
  // 클래스 ID에 따른 색상 지정
  const getClassColor = (classId) => {
    const colors = {
      1: 'bg-green-100 border-green-400',  // 정상
      2: 'bg-red-100 border-red-400',      // 결함_A
      3: 'bg-yellow-100 border-yellow-400', // 결함_B
      4: 'bg-purple-100 border-purple-400', // 결함_C
      default: 'bg-gray-100 border-gray-400' // 미분류
    };
    
    return colors[classId] || colors.default;
  };
  
  if (images.length === 0) {
    return <div className="text-gray-500 italic">이미지가 없습니다.</div>;
  }
  
  return (
    <div className="h-64 overflow-y-auto border rounded p-1">
      <ul className="space-y-1">
        {images.map((image, index) => {
          const isAnnotated = annotations && annotations[image.name];
          const classStyle = isAnnotated ? getClassColor(annotations[image.name]) : '';
          
          return (
            <li key={index}>
              <button
                className={`w-full text-left px-2 py-1 rounded text-sm border transition
                  ${index === currentIndex ? 'bg-blue-100 border-blue-400' : classStyle}
                  hover:bg-gray-200`}
                onClick={() => onSelectImage(index)}
              >
                <div className="flex items-center">
                  <span className="mr-1">{index + 1}.</span>
                  <span className="truncate flex-1">{image.name}</span>
                  {isAnnotated && (
                    <span className="text-xs px-1 py-0.5 rounded bg-gray-200">
                      Class {annotations[image.name]}
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ImageNavigator;