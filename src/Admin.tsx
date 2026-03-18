import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
// Định nghĩa interface cho phản hồi từ API (nếu cần mở rộng sau này)
interface AdminFileData {
  files: string[];
}

const Admin: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 1. Lấy danh sách file từ server
  const fetchFiles = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/admin/files`);
      const data: AdminFileData = await res.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách file:", error);
      setStatus('❌ Không thể kết nối đến server để lấy danh sách file.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 2. Xử lý Upload File
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    setStatus('⏳ Đang tải file lên...');

    const formData = new FormData();
    formData.append('file', fileList[0]);

    try {
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus(`✅ Đã tải lên: ${fileList[0].name}`);
        fetchFiles(); // Cập nhật lại danh sách
      } else {
        setStatus(`❌ Lỗi upload: ${data.error || 'Không xác định'}`);
      }
    } catch (error) {
      setStatus('❌ Lỗi kết nối khi upload file.');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input file
    }
  };

  // 3. Xóa file
  const deleteFile = async (name: string): Promise<void> => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa file "${name}" không?`)) return;
    
    try {
      const res = await fetch(`${API_URL}/api/admin/files/${name}`, { 
        method: 'DELETE' 
      });
      if (res.ok) {
        setStatus(`✅ Đã xóa file: ${name}`);
        fetchFiles();
      } else {
        setStatus('❌ Không thể xóa file.');
      }
    } catch (error) {
      setStatus('❌ Lỗi kết nối khi xóa file.');
    }
  };

  // 4. Chạy build_index.py (Cập nhật AI)
 const handleRebuild = async () => {
    setIsBuilding(true); 
    setStatus('⏳ Đang Rebuild Index (Mất vài phút)...');
    
    try {
      const res = await fetch(`${API_URL}/api/admin/rebuild-index`, { 
        method: 'POST' 
      });
      
      // DEBUG: In ra status code
      console.log("HTTP Status:", res.status);

      const data = await res.json();
      
      // DEBUG: In ra toàn bộ cục data nhận được
      console.log("Server Response:", data);

      if (res.ok) {
        // Kiểm tra xem backend trả về key là 'message' hay 'msg' hay cái gì khác
        const successMsg = data.message || data.msg || "Thành công (không có nội dung chi tiết)";
        setStatus('✅ ' + successMsg);
      } else {
        // Lấy thông báo lỗi chi tiết
        const errorMsg = data.error || data.detail || "Lỗi không xác định";
        setStatus('❌ ' + errorMsg);
        if (data.details) console.error("Chi tiết lỗi script:", data.details);
      }
    } catch (e) {
      console.error("Lỗi FETCH:", e);
      setStatus('❌ Lỗi kết nối hoặc timeout (Xem Console F12)');
    } finally {
      setIsBuilding(false);
    }
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Quản trị Chatbot TDC</h1>
          <button 
            onClick={() => window.location.href = '/'} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Quay lại trang Chat
          </button>
        </div>

        {/* Khối điều khiển chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Cập nhật AI */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-2 text-orange-600">Trí tuệ nhân tạo</h2>
            <p className="text-gray-500 text-sm mb-4">Cập nhật cơ sở dữ liệu mới nhất vào FAISS Index.</p>
            <button 
              onClick={handleRebuild}
              disabled={isBuilding}
              className={`w-full py-3 rounded-xl text-white font-bold shadow-lg transition-all ${
                isBuilding ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
              }`}
            >
              {isBuilding ? '⚙️ Đang xử lý...' : '🚀 Rebuild Index Now'}
            </button>
          </div>

          {/* Upload tài liệu */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-2 text-blue-600">Thêm tài liệu</h2>
            <p className="text-gray-500 text-sm mb-4">Hỗ trợ PDF, DOCX, TXT. File sẽ được lưu vào thư mục /data.</p>
            <label className={`w-full flex flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-sm border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <span className="text-blue-600 font-semibold">{isUploading ? 'Đang tải lên...' : '📁 Chọn file từ máy tính'}</span>
              <input type='file' className="hidden" onChange={handleUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        {/* Thông báo trạng thái */}
        {status && (
          <div className={`mb-6 p-4 rounded-xl border ${
            status.includes('❌') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {status}
          </div>
        )}

        {/* Danh sách File hiện có */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-700">Danh sách tài liệu nguồn ({files.length})</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Tên tập tin</th>
                <th className="px-6 py-4 text-right font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {files.length > 0 ? files.map(file => (
                <tr key={file} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700 font-medium">{file}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteFile(file)} 
                      className="text-red-400 hover:text-red-600 font-semibold text-sm transition-colors"
                    >
                      Xóa bỏ
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-gray-400 italic">
                    Chưa có tài liệu nào trong thư mục dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;