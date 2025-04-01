// frontend/src/components/Common/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const Header = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">패치 어노테이션 시스템</Link>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-200">홈</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-blue-200">대시보드</Link>
                </li>
                <li>
                  <Link to="/annotation" className="hover:text-blue-200">어노테이션</Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="hover:text-blue-200"
                  >
                    로그아웃
                  </button>
                </li>
                <li className="ml-2 bg-blue-700 px-2 py-1 rounded text-sm">
                  {user.username}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200">로그인</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-200">회원가입</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;