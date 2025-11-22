import { GoogleGenAI } from '@google/genai';
import { NlsDatabase } from '../types';

// Helper: Định dạng nguồn tham khảo (Giữ lại để dự phòng)
const formatSources = (groundingMetadata: any): string => {
    if (!groundingMetadata?.groundingChunks) return '';
    const uniqueSources = new Map();
    groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
            if (!uniqueSources.has(chunk.web.uri)) {
                uniqueSources.set(chunk.web.uri, chunk.web.title);
            }
        }
    });
    if (uniqueSources.size === 0) return '';
    const sourceList = Array.from(uniqueSources.entries()).map(([uri, title]) => {
        return `- [${title}](${uri})`;
    });
    return '\n\n---\n**🌐 Nguồn tham khảo:**\n' + sourceList.join('\n');
};

// Hàm 1: Gợi ý hoạt động (ĐÃ BỎ Google Search để sửa lỗi 404)
export const getGeminiSuggestion = async (
    lessonTitle: string,
    nlsCodes: string[],
    nlsDatabase: NlsDatabase,
    selectedClass: string,
    subject: string = 'TinHoc'
): Promise<string> => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Chưa có API Key.");

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const lop = selectedClass === '3' ? 'Lớp 3 (8-9 tuổi)' : `Lớp ${selectedClass} (9-11 tuổi)`;
    const subjectName = subject === 'TinHoc' ? 'Tin học' : 'Công nghệ';
    const nlsDescriptions = nlsCodes.map(code => `- **${code}:** ${nlsDatabase[code] || ''}`).join('\n');

    const systemPrompt = `Bạn là giáo viên ${subjectName} tiểu học. Nhiệm vụ: Gợi ý hoạt động dạy học sáng tạo phát triển Năng lực số.`;
    const userQuery = `Gợi ý hoạt động cho bài: "${lessonTitle}" (${lop}, ${subjectName}).
    Phát triển NLS:
    ${nlsDescriptions}
    Yêu cầu: Trả lời tiếng Việt, Markdown, ngắn gọn.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash', 
            contents: [{ role: "user", parts: [{ text: userQuery }] }],
            config: {
                temperature: 0.7,  
        });
        return (response.text || "");
    } catch (error) {
        console.error("Lỗi Gemini:", error);
        throw new Error("Lỗi kết nối AI. Vui lòng thử lại sau.");
    }
};

// Hàm 2: Soạn giáo án
export const getGeminiLessonPlan = async (
    lessonTitle: string,
    nlsCodes: string[],
    nlsDatabase: NlsDatabase,
    selectedClass: string,
    initialSuggestion: string,
    subject: string = 'TinHoc'
): Promise<string> => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Chưa có API Key.");

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const subjectName = subject === 'TinHoc' ? 'Tin học' : 'Công nghệ';
    const nlsDescriptions = nlsCodes.map(code => `- **${code}:** ${nlsDatabase[code] || ''}`).join('\n');
    
    const userQuery = `Soạn giáo án chi tiết bài: "${lessonTitle}" lớp ${selectedClass}, môn ${subjectName}.
    Tích hợp NLS: ${nlsDescriptions}.
    Dựa trên ý tưởng: ${initialSuggestion}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: "user", parts: [{ text: userQuery }] }]
        });
        return response.text || "Không có nội dung.";
    } catch (error) {
        console.error(error);
        throw new Error("Lỗi tạo giáo án.");
    }
};

// Hàm 3: Tích hợp NLS
export const integrateNlsIntoLessonPlan = async (
    lessonTitle: string,
    nlsCodes: string[],
    nlsDatabase: NlsDatabase,
    selectedClass: string,
    userLessonPlanContent: string,
    subject: string = 'TinHoc'
): Promise<string> => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Chưa có API Key.");

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const nlsDescriptions = nlsCodes.map(code => `- **${code}:** ${nlsDatabase[code] || ''}`).join('\n');
    
    const userQuery = `Tích hợp NLS (${nlsDescriptions}) vào giáo án sau: \n\`\`\`markdown\n${userLessonPlanContent}\n\`\`\``;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: "user", parts: [{ text: userQuery }] }]
        });
        return (response.text || "").replace(/^```markdown\n/, '').replace(/\n```$/, '');
    } catch (error) {
        console.error(error);
        throw new Error("Lỗi tích hợp NLS.");
    }
};

// Hàm 4: Tạo công cụ đánh giá
export const getGeminiAssessment = async (
    type: 'rubric' | 'quiz',
    lessonTitle: string,
    nlsCodes: string[],
    nlsDatabase: NlsDatabase,
    selectedClass: string,
    subject: string = 'TinHoc'
): Promise<string> => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API key chưa được cấu hình.");

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const subjectName = subject === 'TinHoc' ? 'Tin học' : 'Công nghệ';
    const nlsDescriptions = nlsCodes.map(code => `- **${code}:** ${nlsDatabase[code] || ''}`).join('\n');
    
    let prompt = '';
    if (type === 'rubric') {
        prompt = `Tạo phiếu đánh giá (Rubric) cho bài: "${lessonTitle}" lớp ${selectedClass}, môn ${subjectName}. NLS: ${nlsDescriptions}. Yêu cầu: Markdown Table, 3 mức độ.`;
    } else {
        prompt = `Tạo 5 câu hỏi trắc nghiệm cho bài: "${lessonTitle}" lớp ${selectedClass}, môn ${subjectName}. NLS: ${nlsDescriptions}. Yêu cầu: Có đáp án, Markdown.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        return response.text || "Không có nội dung đánh giá.";
    } catch (error) {
        console.error("Lỗi Gemini Assessment:", error);
        throw new Error("Lỗi khi tạo công cụ đánh giá.");
    }
};