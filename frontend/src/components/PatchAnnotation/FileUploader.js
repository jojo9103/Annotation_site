import React, { useRef } from 'react';

const FileUploader = ({ onFolderUpload, onFolderSelect }) => {
  const fileInputRef = useRef(null);
  const folderPathRef = useRef(null);
  
  const handleFolderInputChange = (event) => {
    onFolderUpload(event);
    
    // 입력 필드 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFolderPathSubmit = (event) => {
    event.preventDefault();
    if (folderPathRef.current && folderPathRef.current.value) {
      onFolderSelect(folderPathRef.current.value);
      folderPathRef.current.value = '';
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">폴더 업로드</h3>
        <div className="flex flex-col">
          <input
            type="file"
            ref={fileInputRef}
            directory=""
            webkitdirectory=""
            onChange={handleFolderInputChange}
            className="hidden"
            id="folder-upload"
          />
          <label
            htmlFor="folder-upload"
            className="bg-blue-500 text-white py-2 px-3 rounded cursor-pointer text-center hover:bg-blue-600"
          >
            폴더 선택
          </label>
          <span className="text-xs text-gray-500 mt-1">
            * 폴더 내 이미지 파일만 처리됩니다
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-bold mb-2">폴더 경로 지정</h3>
        <form onSubmit={handleFolderPathSubmit}>
          <div className="flex">
            <input
              type="text"
              ref={folderPathRef}
              placeholder="로컬 경로 입력 (예: C:/Images)"
              className="flex-1 px-2 py-1 border rounded-l"
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-1 px-3 rounded-r hover:bg-green-600"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploader;
