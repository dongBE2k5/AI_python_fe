// src/api.ts

// Gọi cái biến môi trường lúc nãy ra
const API_URL = import.meta.env.VITE_API_URL;

// Xuất ra một cái hàm, hàm này chỉ cần nhận đúng 1 biến là 'câu hỏi của user'
export const chatWithAI = async (userPrompt: string) => {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Đóng gói biến thành JSON truyền đi
      body: JSON.stringify({ prompt: userPrompt }), 
    });

    if (!response.ok) {
      throw new Error("Lỗi kết nối đến Backend Python!");
    }

    const data = await response.json();
    return data; // Trả về kết quả
    
  } catch (error) {
    console.error("Lỗi gọi API:", error);
    return { reply: "Xin lỗi, hệ thống đang gặp sự cố." };
  }
};