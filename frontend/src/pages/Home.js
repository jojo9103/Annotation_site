// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';

const Home = () => {
  const user = authService.getCurrentUser();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 헤더 섹션 */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">패치 기반 이미지 어노테이션 시스템</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            효율적인 이미지 패치 관리와 클래스 어노테이션을 위한 웹 기반 솔루션
          </p>
          
          {user ? (
            <div className="flex justify-center space-x-4">
              <Link 
                to="/dashboard" 
                className="bg-white text-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                대시보드 이동
              </Link>
              <Link 
                to="/annotation" 
                className="bg-blue-700 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-800 transition"
              >
                어노테이션 시작
              </Link>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link 
                to="/register" 
                className="bg-white text-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                회원가입
              </Link>
              <Link 
                to="/login" 
                className="bg-blue-700 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-800 transition"
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 특징 섹션 */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-500 text-2xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">이미지 패치 관리</h3>
              <p className="text-gray-600">
                로컬 폴더 또는 업로드된 이미지 패치를 쉽게 관리하고 탐색할 수 있습니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-500 text-2xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">클래스 어노테이션</h3>
              <p className="text-gray-600">
                각 이미지 패치에 클래스를 쉽게 할당하고 키보드 단축키로 빠르게 작업할 수 있습니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-500 text-2xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">데이터 내보내기</h3>
              <p className="text-gray-600">
                어노테이션 결과를 CSV, TSV 형식으로 내보내고 다운로드할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 사용 방법 섹션 */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">사용 방법</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-start mb-8">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 md:mt-1">
                1
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex-grow">
                <h3 className="text-xl font-bold mb-2">계정 생성</h3>
                <p className="text-gray-600">
                  회원가입을 통해 개인 계정을 만듭니다. 이를 통해 어노테이션 작업을 저장하고 관리할 수 있습니다.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start mb-8">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 md:mt-1">
                2
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex-grow">
                <h3 className="text-xl font-bold mb-2">이미지 업로드</h3>
                <p className="text-gray-600">
                  로컬 폴더를 업로드하거나 경로를 지정하여 패치 이미지를 시스템에 로드합니다.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start mb-8">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 md:mt-1">
                3
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex-grow">
                <h3 className="text-xl font-bold mb-2">클래스 어노테이션</h3>
                <p className="text-gray-600">
                  각 이미지에 적절한 클래스를 할당합니다. 키보드 단축키를 사용하여 작업 속도를 높일 수 있습니다.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 md:mt-1">
                4
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex-grow">
                <h3 className="text-xl font-bold mb-2">데이터 내보내기</h3>
                <p className="text-gray-600">
                  완료된 어노테이션을 CSV 또는 TSV 형식으로 내보내고 다운로드할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">지금 시작하세요</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            사용하기 쉬운 인터페이스로 이미지 패치 어노테이션 작업을 효율적으로 수행하세요.
          </p>
          
          {user ? (
            <Link 
              to="/annotation" 
              className="bg-white text-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-50 transition inline-block"
            >
              어노테이션 페이지로 이동
            </Link>
          ) : (
            <Link 
              to="/register" 
              className="bg-white text-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-50 transition inline-block"
            >
              무료로 시작하기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;