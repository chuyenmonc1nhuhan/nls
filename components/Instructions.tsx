import React from 'react';

const Instructions: React.FC = () => {
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 mx-4 sm:mx-6 my-5 rounded-r-lg text-sm">
            <h4 className="font-bold text-orange-700 text-base mb-2">Hướng dẫn chi tiết:</h4>
            
            <div className="mb-4">
                <p className="font-semibold text-orange-700 mb-2">🚀 Quy trình sử dụng các tính năng AI:</p>
                <ol className="list-decimal list-inside space-y-3">
                    <li>
                        <strong>Bước 1: Tải Kế hoạch Dạy học</strong>
                        <br/>
                        Chọn khối lớp bạn muốn làm việc, sau đó nhấn nút <code className="bg-gray-200 text-orange-700 font-semibold px-1.5 py-0.5 rounded">1. Tải Kế hoạch Dạy học</code>. Bảng kế hoạch cho cả năm học sẽ hiện ra.
                    </li>
                    <li>
                        <strong>Bước 2: Gắn Năng lực số (NLS) cho bài học</strong>
                        <br/>
                        Bạn có hai lựa chọn:
                        <ul className="list-['-_'] list-inside ml-4 mt-1 space-y-1">
                            <li><strong>Tự động (Khuyến nghị):</strong> Nhấn nút <strong className="text-orange-700"><code className="bg-gray-200 font-semibold px-1.5 py-0.5 rounded">3. Tự động Xây dựng (CV 3456)</code></strong>. AI sẽ tự động ánh xạ đầy đủ các chỉ báo NLS theo đúng Yêu cầu Cần đạt của Bộ GD&ĐT. Đây là cách nhanh và chính xác nhất để bắt đầu.</li>
                            <li><strong>Thủ công:</strong> Tại mỗi bài học, nhấn nút <code className="bg-gray-200 text-orange-700 font-semibold px-1.5 py-0.5 rounded">Gắn NLS</code> để mở cửa sổ và tự chọn các năng lực số bạn muốn phát triển.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Bước 3: Lấy Gợi ý Hoạt động Dạy học từ AI</strong>
                        <br/>
                        Sau khi một bài học đã được gắn NLS, hãy nhấn nút <code className="bg-gray-200 text-orange-700 font-semibold px-1.5 py-0.5 rounded">Gợi ý HĐ ✨</code>. Gemini AI sẽ phân tích nội dung bài học và các NLS đã chọn để đề xuất một hoạt động dạy học sáng tạo, phù hợp.
                    </li>
                    <li>
                        <strong>Bước 4: Soạn hoặc Tích hợp Giáo án chi tiết</strong>
                        <br/>
                        Trong cửa sổ Gợi ý Hoạt động, bạn có thể:
                        <ul className="list-['-_'] list-inside ml-4 mt-1 space-y-1">
                            <li><strong>Soạn mới hoàn toàn:</strong> Nhấn nút "Soạn Giáo án đầy đủ với AI". AI sẽ tự động viết một giáo án chi tiết theo cấu trúc chuẩn, dựa trên hoạt động đã gợi ý.</li>
                            <li><strong>Tích hợp vào giáo án có sẵn:</strong> Dán nội dung giáo án của bạn vào ô văn bản hoặc tải file (.doc, .docx, .txt). AI sẽ khéo léo lồng ghép các NLS vào giáo án đó mà không làm thay đổi nội dung chính, giúp giáo án của bạn vừa giữ được chất riêng, vừa đáp ứng yêu cầu về phát triển NLS.</li>
                        </ul>
                    </li>
                </ol>
            </div>
            
            <div className="mt-4 pt-3 border-t border-yellow-300">
                 <p className="font-semibold text-orange-700 mb-2">📖 Cách đọc Mã NLS (Ví dụ: <code className="bg-gray-200 text-gray-800 font-mono px-1.5 py-0.5 rounded">1.1.CB1a</code>):</p>
                 <p>Mỗi mã NLS cung cấp thông tin chi tiết về năng lực mà nó mô tả:</p>
                 <ul className="list-none mt-2 space-y-1">
                    <li><code className="font-mono bg-gray-200 px-1 rounded">1</code><code className="font-mono">.1.CB1a</code> &rarr; <strong>Miền Năng lực 1:</strong> Khai thác dữ liệu và thông tin.</li>
                    <li><code className="font-mono">1.</code><code className="font-mono bg-gray-200 px-1 rounded">1</code><code className="font-mono">.CB1a</code> &rarr; <strong>Thành phần Năng lực 1.1:</strong> Duyệt, tìm kiếm và lọc dữ liệu...</li>
                    <li><code className="font-mono">1.1.</code><code className="font-mono bg-gray-200 px-1 rounded">CB1</code><code className="font-mono">a</code> &rarr; <strong>Mức độ:</strong> <strong>C</strong>ơ <strong>B</strong>ản <strong>1</strong> (dành cho Lớp 1-3). Mức CB2 dành cho Lớp 4-5.</li>
                    <li><code className="font-mono">1.1.CB1</code><code className="font-mono bg-gray-200 px-1 rounded">a</code> &rarr; <strong>Chỉ báo cụ thể:</strong> 'a' là chỉ báo đầu tiên trong thành phần năng lực đó.</li>
                 </ul>
                 <p className="mt-2">Để xem mô tả đầy đủ và chi tiết của từng mã, hãy sử dụng các nút <code className="bg-gray-200 text-gray-800 text-[11px] font-semibold px-1 py-0.5 rounded">Tra cứu NLS...</code></p>
            </div>
        </div>
    );
};

export default Instructions;