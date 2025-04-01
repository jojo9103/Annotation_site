import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import annotationService from '../services/annotation.service';

const PatchAnnotation = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [classes, setClasses] = useState([
    { id: 1, name: '정상' },
    { id: 2, name: '결함_A' },
    { id: 3, name: '결함_B' },
    { id: 4, name: '결함_C' },
  ]);
  const [newClassName, setNewClassName] = useState('');
  const [annotations, setAnnotations] = useState({});
  const [notes, setNotes] = useState({}); // 이미지별 주석/메모
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 키보드 이벤트 처리 (다음/이전 이미지 이동)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key >= '1' && e.key <= String(classes.length)) {
        // 숫자 키로 클래스 선택
        const classId = parseInt(e.key);
        handleClassSelect(classes[classId - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex, images.length, classes]);

  // 이미지 리스트 로드
  const loadImages = useCallback(async (folderPath) => {
    setIsLoading(true);
    try {
      const response = await annotationService.getImagesFromFolder(folderPath);
      setImages(response.data);
      
      // 기존 어노테이션 로드
      const savedAnnotations = await annotationService.getUserAnnotations();
      setAnnotations(savedAnnotations.data?.annotations || {});
      setNotes(savedAnnotations.data?.notes || {});
      
      setCurrentImageIndex(0);
      setError(null);
    } catch (err) {
      setError('이미지를 로드하는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 폴더 업로드 처리
  const handleFolderUpload = async (folderEvent) => {
    const files = Array.from(folderEvent.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await annotationService.uploadFolder(formData);
      setImages(response.data.images);
      setCurrentImageIndex(0);
      setError(null);
    } catch (err) {
      setError('폴더 업로드 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 폴더 경로 지정
  const handleFolderSelect = (folderPath) => {
    loadImages(folderPath);
  };

  // 다음 이미지로 이동
  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prevIndex => prevIndex + 1);
    }
  };

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prevIndex => prevIndex - 1);
    }
  };

  // 클래스 선택
  const handleClassSelect = (classId) => {
    if (images.length === 0) return;
    
    const currentImage = images[currentImageIndex];
    setAnnotations(prevAnnotations => ({
      ...prevAnnotations,
      [currentImage.name]: classId
    }));
  };

  // 주석 업데이트
  const handleNoteChange = (e) => {
    if (images.length === 0) return;
    
    const currentImage = images[currentImageIndex];
    setNotes(prevNotes => ({
      ...prevNotes,
      [currentImage.name]: e.target.value
    }));
  };

  // 새 클래스 추가
  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    
    const newId = classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1;
    setClasses(prevClasses => [...prevClasses, { id: newId, name: newClassName.trim() }]);
    setNewClassName('');
  };

  // 키 입력으로 클래스 추가
  const handleNewClassKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddClass();
    }
  };

  // 어노테이션 저장
  const handleSave = async (format = 'csv') => {
    if (Object.keys(annotations).length === 0) {
      setError('저장할 어노테이션이 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await annotationService.saveAnnotations({
        annotations,
        notes,
        format
      });
      alert(`어노테이션이 ${format.toUpperCase()} 형식으로 저장되었습니다.`);
    } catch (err) {
      setError('어노테이션 저장 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 확인
  useEffect(() => {
    if (!authService.getCurrentUser()) {
      navigate('/login');
    }
  }, [navigate]);

  // 현재 이미지 가져오기
  const currentImage = images.length > 0 ? images[currentImageIndex] : null;
  const currentClassId = currentImage ? annotations[currentImage.name] : null;
  const currentNote = currentImage ? notes[currentImage.name] || '' : '';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">패치 어노테이션</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* 왼쪽 패널: 파일 업로드, 이미지 네비게이션 */}
        <div className="md:col-span-3 bg-gray-100 p-4 rounded">
          <div className="mb-4">
            <h3 className="font-bold mb-2">폴더 업로드</h3>
            <div className="flex flex-col">
              <input
                type="file"
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFolderUpload}
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
            <form onSubmit={(e) => { e.preventDefault(); handleFolderSelect(e.target.folderPath.value); }}>
              <div className="flex">
                <input
                  type="text"
                  name="folderPath"
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

          <div className="mb-4">
            <h3 className="font-bold mb-2">클래스 관리</h3>
            <div className="mb-2">
              <div className="flex">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  onKeyDown={handleNewClassKeyDown}
                  placeholder="새 클래스 이름"
                  className="flex-1 px-2 py-1 border rounded-l"
                />
                <button
                  onClick={handleAddClass}
                  className="bg-blue-500 text-white py-1 px-3 rounded-r hover:bg-blue-600"
                >
                  추가
                </button>
              </div>
            </div>
            <div className="bg-white p-2 rounded border max-h-40 overflow-y-auto">
              <ul>
                {classes.map((classItem) => (
                  <li key={classItem.id} className="flex justify-between items-center py-1 border-b last:border-b-0">
                    <span>{classItem.id}. {classItem.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold mb-2">이미지 목록 ({images.length}개)</h3>
            <div className="h-64 overflow-y-auto border rounded p-1 bg-white">
              {images.length > 0 ? (
                <ul className="space-y-1">
                  {images.map((image, index) => {
                    const isAnnotated = annotations && annotations[image.name];
                    const hasNote = notes && notes[image.name];
                    
                    return (
                      <li key={index}>
                        <button
                          className={`w-full text-left px-2 py-1 rounded text-sm border transition
                            ${index === currentImageIndex ? 'bg-blue-100 border-blue-400' : 
                              isAnnotated ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-200'}
                            hover:bg-gray-200`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <div className="flex items-center">
                            <span className="mr-1">{index + 1}.</span>
                            <span className="truncate flex-1">{image.name}</span>
                            {isAnnotated && (
                              <span className="text-xs px-1 py-0.5 rounded bg-green-200 ml-1">
                                {classes.find(c => c.id === annotations[image.name])?.name || annotations[image.name]}
                              </span>
                            )}
                            {hasNote && <span className="text-xs ml-1">📝</span>}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-gray-500 italic p-2">이미지가 없습니다.</div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold mb-2">내보내기</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleSave('csv')}
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 flex-1"
                disabled={isLoading}
              >
                CSV 저장
              </button>
              <button 
                onClick={() => handleSave('tsv')}
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 flex-1"
                disabled={isLoading}
              >
                TSV 저장
              </button>
            </div>
          </div>
        </div>
        
        {/* 오른쪽 패널: 이미지 뷰어, 클래스 선택, 주석 */}
        <div className="md:col-span-9">
          <div className="bg-white p-4 rounded shadow">
            {currentImage ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <button 
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className="bg-gray-200 py-1 px-3 rounded disabled:opacity-50"
                  >
                    ← 이전
                  </button>
                  <span>
                    {currentImageIndex + 1} / {images.length}
                  </span>
                  <button 
                    onClick={handleNextImage}
                    disabled={currentImageIndex === images.length - 1}
                    className="bg-gray-200 py-1 px-3 rounded disabled:opacity-50"
                  >
                    다음 →
                  </button>
                </div>
                
                <div className="relative flex items-center justify-center w-full">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  <img 
                    src={currentImage.url}
                    alt={currentImage.name}
                    className="max-w-full max-h-96 rounded"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {currentImage.name}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-bold mb-2">클래스 선택</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {classes.map((classItem) => (
                      <button
                        key={classItem.id}
                        className={`p-2 rounded ${
                          currentClassId === classItem.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => handleClassSelect(classItem.id)}
                      >
                        <div className="flex items-center">
                          <span className="mr-1">{classItem.id}.</span>
                          <span>{classItem.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    키보드 단축키: 좌/우 화살표(이미지 이동), 숫자 키(클래스 선택)
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-bold mb-2">주석 작성</h3>
                  <textarea
                    value={currentNote}
                    onChange={handleNoteChange}
                    placeholder="이미지에 대한 메모나 주석을 입력하세요..."
                    className="w-full px-3 py-2 border rounded"
                    rows="4"
                  ></textarea>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {isLoading ? '로딩 중...' : '왼쪽에서 폴더를 업로드하거나 선택하세요.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatchAnnotation;