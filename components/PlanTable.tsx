
import React from 'react';
import { PlanItem, NlsDatabase } from '../types';

interface PlanTableProps {
    planData: PlanItem[];
    nlsDatabase: NlsDatabase;
    isPlanLoaded: boolean;
    onAttachNls: (rowIndex: number) => void;
    onSuggestGemini: (rowIndex: number) => void;
}

const NlsCell: React.FC<{ codes: string[], db: NlsDatabase }> = ({ codes, db }) => {
    if (!codes || codes.length === 0) {
        return <em className="text-gray-500">(Chưa gắn NLS)</em>;
    }
    return (
        <div>
            {codes.map(code => (
                <div key={code} className="mb-2">
                    <span className="inline-block bg-teal-50 text-teal-800 px-2 py-1 rounded font-mono font-semibold text-sm">
                        {code}
                    </span>
                    <div className="text-xs text-gray-600 mt-1 pl-3 border-l-2 border-teal-100">
                        ({db[code] || "Không tìm thấy mô tả"})
                    </div>
                </div>
            ))}
        </div>
    );
};

const PlanTable: React.FC<PlanTableProps> = ({ planData, nlsDatabase, isPlanLoaded, onAttachNls, onSuggestGemini }) => {
    return (
        <div className="plan-container overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-gray-50 z-10">
                    <tr>
                        <th className="th-cell w-[5%] text-center">Tuần</th>
                        <th className="th-cell w-[18%]">Chủ đề/Mạch nội dung</th>
                        <th className="th-cell w-[27%]">Tên bài học</th>
                        <th className="th-cell w-[5%] text-center">Tiết</th>
                        <th className="th-cell w-[35%]">Năng lực số phát triển (Theo CV 3456)</th>
                        <th className="th-cell w-[10%]">Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    {!isPlanLoaded ? (
                        <tr>
                            <td colSpan={6} className="text-center p-10 text-gray-500">
                                Hãy chọn lớp và nhấn "Tải Kế hoạch Dạy học" để bắt đầu.
                            </td>
                        </tr>
                    ) : (
                        planData.map((item, index) => (
                            <tr key={`${item.tuan}-${index}`} className="even:bg-gray-50/50 hover:bg-lime-50/50 transition-colors">
                                <td className="td-cell text-center">{item.tuan}</td>
                                <td className="td-cell font-medium">{item.chuDe}</td>
                                <td className="td-cell">{item.tenBaiHoc}</td>
                                <td className="td-cell text-center">{item.tiet}</td>
                                <td className="td-cell align-top">
                                    <div className="nls-display-area mb-2 min-h-[1.5rem]">
                                        <NlsCell codes={item.nls} db={nlsDatabase} />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={() => onAttachNls(index)} className="btn-table-attach">Gắn NLS</button>
                                        <button onClick={() => onSuggestGemini(index)} className="btn-table-gemini">Gợi ý HĐ ✨</button>
                                    </div>
                                </td>
                                <td className="td-cell">{item.ghiChu}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <style>{`
                .th-cell { border: 1px solid #ddd; padding: 10px 12px; text-align: left; font-weight: 700; color: #333; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .td-cell { border: 1px solid #ddd; padding: 10px 12px; vertical-align: top; }
                .btn-table-attach, .btn-table-gemini {
                    font-size: 0.8rem;
                    font-weight: 600;
                    padding: 4px 8px;
                    border-radius: 6px;
                    border: 1px solid;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                 .btn-table-attach { border-color: #00796b; background-color: #e0f2f1; color: #00796b; }
                .btn-table-attach:hover { background-color: #00796b; color: white; }
                .btn-table-gemini { border-color: #d84315; background-color: #fbe9e7; color: #d84315; }
                .btn-table-gemini:hover { background-color: #d84315; color: white; }
            `}</style>
        </div>
    );
};

export default PlanTable;
