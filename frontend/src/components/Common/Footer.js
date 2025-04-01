// frontend/src/components/Common/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} 패치 어노테이션 시스템. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
