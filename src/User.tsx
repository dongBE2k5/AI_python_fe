import React, { useState, useEffect, useRef } from 'react';
import './index.css';
const API_URL = import.meta.env.VITE_API_URL;
interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const User: React.FC = () => {
  // Câu chào mặc định của TDC Bot
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'bot', 
      text: 'Chào bạn! Tôi là Trợ lý ảo của Trường Cao đẳng Công nghệ Thủ Đức (TDC). 🎓\nTôi có thể giúp bạn tra cứu thông tin về Sổ tay sinh viên, lịch đăng ký học phần, hoặc quy chế đào tạo.', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Danh sách câu hỏi gợi ý cho sinh viên
  const suggestions = [
    "Thời gian đăng ký học phần HK1?",
    "Chuẩn đầu ra tiếng Anh là gì?",
    "Quy định xét học vụ?",
    "Cách xem thời khóa biểu?"
  ];

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text: string = input): Promise<void> => {
    if (!text.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'user', text: text, time: now };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();
      console.log(data);
      
      const aiMsg: Message = { 
        sender: 'bot', 
        text: data.reply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: '❌ Hệ thống đang bảo trì hoặc mất kết nối. Vui lòng thử lại sau!', 
        time: now 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f4f8] font-sans">
      
      {/* --- HEADER TDC --- */}
      <div className="bg-blue-800 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo TDC (Giả lập hoặc dùng Link thật) */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-inner overflow-hidden">
               <img 
                 src="" 
                 alt="TDC Logo" 
                 className="w-full h-full object-contain"
                 onError={(e) => { e.currentTarget.src = ''; }} 
               />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight uppercase tracking-wide">CĐ Công Nghệ Thủ Đức</h1>
              <div className="flex items-center gap-2 text-blue-200 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Hỗ trợ trực tuyến
              </div>
            </div>
          </div>
          
          {/* Nút Admin ẩn tinh tế */}
          <button 
            onClick={() => window.location.href='/admin'} 
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors text-blue-300 hover:text-white"
            title="Trang quản trị"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 max-w-4xl mx-auto w-full bg-white shadow-xl sm:my-4 sm:rounded-2xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* Tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50 custom-scrollbar">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-sm ${
                  msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 text-blue-800'
                }`}>
                  {msg.sender === 'user' ? 'SV' : 'TDC'}
                </div>
                
                {/* Bong bóng chat */}
                <div className="flex flex-col">
                  <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[10px] mt-1 text-slate-400 font-medium ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
               <div className="flex gap-3 items-center ml-1">
                <div className="w-8 h-8 bg-white border rounded-full flex items-center justify-center">
                   <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span className="text-slate-500 text-xs italic">Đang tra cứu tài liệu...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- GỢI Ý & INPUT --- */}
        <div className="bg-white border-t border-gray-100 p-4 pb-6">
          
          {/* Quick Suggestions (Chỉ hiện khi không loading) */}
          {!loading && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
              {suggestions.map((sug, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(sug)}
                  className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 border border-blue-100 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-center">
            <input
              type="text"
              className="w-full bg-slate-100 text-slate-800 border-none rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-inner"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            
            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-50 disabled:bg-slate-300 shadow-md active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          
          <div className="text-center mt-3">
             <p className="text-[10px] text-slate-400">
               Thông tin được trích xuất tự động từ <b>Sổ tay HSSV TDC 2025-2026</b>.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default User;