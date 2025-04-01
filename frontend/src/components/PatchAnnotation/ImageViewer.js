import React, { useState, useEffect } from 'react';

const ImageViewer = ({ image, loading }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // 이미지 변경 시 로딩 상태 초기화
  useEffect(() => {
    setImageLoaded(false);
  }, [image]);
  
  if (!image) {
    return (
      <div className="bg-gray-200 rounded flex items-center justify-center h-64">
        <p className="text-gray-500">이미지를 선택하세요</p>
      </div>
    );
  }
  
  return (
    <div className="relative flex items-center justify-center w-full">
      {(loading || !imageLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img 
        src={image.url}
        alt={image.name}
        className={`max-w-full max-h-96 rounded ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
      />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {image.name}
      </div>
    </div>
  );
};

export default ImageViewer;