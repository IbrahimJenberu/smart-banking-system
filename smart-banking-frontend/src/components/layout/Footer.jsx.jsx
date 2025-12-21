import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 px-6">
      <div className="text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Smart Banking System. All rights reserved.</p>
        <p className="mt-1">Secure | Reliable | FDIC Insured</p>
      </div>
    </footer>
  );
};

export default Footer;