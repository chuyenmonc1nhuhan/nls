import { GoogleGenAI } from '@google/genai';
import { NlsDatabase } from '../types';

const GEMINI_MODEL = 'gemini-2.5-flash';

// Tạo client Gemini, ưu tiên Vite env, fallback sang process.env nếu chạy Node
function createGeminiClient() {
  const apiKey =
    // Vite / frontend
    (typeof import.meta !== 'undefined'
      ? import.meta.env.VITE_GEMINI_API_KEY
      : undefined) ??
    // Node (nếu bạn có chạy server-side)
    (typeof process !== 'undefined'
      ? process.env.API_KEY || process.env.GEMINI_API_KEY
      : undefined);

  if (!apiKey) {
    throw new Error(
      'Chưa có API Key. Hãy thêm VITE_GEMINI_API_KEY vào file .env.local'
    );
  }

  return new GoogleGenAI({ apiKey });
}

// ===================== Hàm 1: Gợi ý hoạt động =====================
export const getGeminiSuggestion = async (
  lessonTitle: string,
  nlsCodes: string[],
  nlsDatabase: NlsDatabase,
  selectedClass: string,
  subject: string = 'TinHoc'
): Promise<string> => {
  const ai = createGeminiClient();

  const lop =
    selectedClass === '3'
      ? 'Lớp 3 (8-9 tuổi)'
      : `Lớp ${selectedClass} (9-11 tuổi)`;
  const subjectName = subject === 'TinHoc' ? 'Tin học' : 'Công nghệ';
  const nlsDescriptions = nlsCodes
    .map((code) => `- **${code}:** ${nlsDatabase[code] || ''}`)
    .join('\n');

  const userQuery = `Gợi ý hoạt động cho bài: "${lessonTitle}" (${lop}, ${subjectName}).
Phát triển NLS:
${nlsDescriptions}
Yêu cầu: Trả lời tiếng Việt, Markdown, ngắn gọn.`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: userQuery,
      config: { temperature: 0.7 },
    });

    return response.text || '';
  } catch (error) {
    console.error('Lỗi Gemini (gợi ý hoạt động):', error);
    throw new Error('Lỗi kết nối AI. Vui lòng thử lại sau.');
  }
};

// ===================== Hàm 2: Soạn giáo án =====================
export const getGeminiLessonPlan = async (
  lessonTitle: string,
  nlsCodes: string[],
  nlsDatabase: NlsDatabase,
  selectedClass: string,
  initialSuggestion: string,
  subject: string = 'TinHoc'
): Promise<string> => {
  const ai = createGeminiClient();

  const subjectName = subject === 'TinHoc' ? 'Tin học' : 'Công nghệ';
  const nlsDescriptions = nlsCodes
    .map((code) => `- **${code}:** ${nlsDatabase[code] || ''}`)
    .join('\n');

  const userQuery = `Soạn giáo án chi tiết bài: "${lessonTitle}" lớp ${selectedClass}, môn ${subjectName}.
Tích hợp NLS:
${nlsDescriptions}
Dựa trên ý tưởng: ${initialSuggestion}`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: userQuery,
    });

    return response.text || 'Không có nội dung.';
  } catch (error) {
    console.error('Lỗi Gemini (soạn giáo án):', error);
    throw new Error('Lỗi tạo giáo án.');
  }
};

// ===================== Hàm 3: Tích hợp NLS =====================
export const integrateNlsIntoLessonPlan = async (
  lessonTitle: string,
  nlsCodes: string[],
  nlsDatabase: NlsDatabase,
  selectedClass: string,
  userLessonPlanContent: string,
  subject: string = 'TinHoc'
): Promise<string> => {
  const ai = createGeminiClient();

  const nlsDescriptions = nlsCodes
    .map((code) => `- **${code}:** ${nlsDatabase[code] || ''}`)
    .join('\n');

  const userQuery = `Tích hợp NLS (${nlsDescriptions}) vào giáo án sau:
\`\`\`markdown
${userLessonPlanContent}
\`\`\``;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: userQuery,
    });

    return (response.text || '')
      .replace(/^```markdown\n/, '')
      .replace(/\n```$/, '');
  } catch (error) {
    console.error('Lỗi Gemini (tích hợp NLS):', error);
    throw new Error('Lỗi tích hợp NLS.');
  }
};

// ===================== Hàm 4: Tạo công cụ đánh giá =====================
export const getGeminiAssessment = async (
  type: 'rubric' | 'quiz',
  lessonTitle: string,
  nlsCodes: string[],
  nlsDatabase: NlsDatabase,
  selectedClass: string,
  subject: string = 'TinHoc'
): Promise<string> => {
  const ai =
