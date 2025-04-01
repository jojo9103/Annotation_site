// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/auth.service';
import annotationService from '../services/annotation.service';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 정보 가져오기
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }

        // 어노테이션 목록 가져오기
        const response = await annotationService.getUserAnnotations();
        setAnnotations(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 어노테이션 파일 다운로드
  const handleDownload = async (id) => {
    try {
      const response = await annotationService.downloadAnnotation(id);
      
      // Blob 생성 및 다운로드
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `annotation_${id}.${response.config.responseType}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('파일 다운로드 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 왼쪽 패널: 사용자 정보 */}
        <div className="md:col-span-4">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">내 프로필</h2>
            
            {user ? (
              <div>
                <div className="mb-4">
                  <p className="text-gray-600">사용자 이름</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">이메일</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">사용자 정보를 불러올 수 없습니다.</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded shadow mt-6">
            <h2 className="text-xl font-bold mb-4">빠른 링크</h2>
            <div className="space-y-2">
              <Link 
                to="/annotation" 
                className="block bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600"
              >
                새 어노테이션 시작
              </Link>
            </div>
          </div>
        </div>
        
        {/* 오른쪽 패널: 어노테이션 기록 */}
        <div className="md:col-span-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">어노테이션 기록</h2>
            
            {annotations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">날짜</th>
                      <th className="py-2 px-4 text-left">형식</th>
                      <th className="py-2 px-4 text-left">항목 수</th>
                      <th className="py-2 px-4 text-left">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annotations.map((annotation, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">
                          {new Date(annotation.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 uppercase">
                          {annotation.format}
                        </td>
                        <td className="py-2 px-4">
                          {annotation.count}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleDownload(annotation._id)}
                            className="text-blue-500 hover:underline"
                          >
                            다운로드
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>저장된 어노테이션이 없습니다.</p>
                <Link to="/annotation" className="text-blue-500 hover:underline mt-2 inline-block">
                  새 어노테이션 시작하기
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;