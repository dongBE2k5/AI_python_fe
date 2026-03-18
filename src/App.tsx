import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các Component của bạn
// Đảm bảo đường dẫn file chính xác với cấu trúc thư mục của bạn
import User from './User'; 
import Admin from './Admin';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route mặc định cho người dùng chat */}
        <Route path="/" element={<User />} />

        {/* Route dành cho trang quản trị chatbot */}
        <Route path="/admin" element={<Admin />} />

        {/* (Tùy chọn) Route 404 nếu người dùng nhập sai địa chỉ */}
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center h-screen font-bold text-xl">
              404 - Không tìm thấy trang này!
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;