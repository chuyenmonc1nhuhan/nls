
import React from 'react';

interface ControlsProps {
    selectedClass: string;
    onClassChange: (value: string) => void;
    selectedSubject: string;
    onSubjectChange: (value: string) => void;
    onLoadPlan: () => void;
    onFillGoc: () => void;
    onAutoBuild: () => void;
    onShowL123: () => void;
    onShowL45: () => void;
    onExport: () => void;
    isPlanLoaded: boolean;
}

const Controls: React.FC<ControlsProps> = ({
    selectedClass,
    onClassChange,
    selectedSubject,
    onSubjectChange,
    onLoadPlan,
    onFillGoc,
    onAutoBuild,
    onShowL123,
    onShowL45,
    onExport,
    isPlanLoaded
}) => {
    return (
        <div className="p-5 sm:p-6 bg-white border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center">
                <div className="flex items-center gap-3">
                    <label htmlFor="classSelect" className="font-semibold text-base text-teal-900">
                        Chọn lớp:
                    </label>
                    <select
                        id="classSelect"
                        value={selectedClass}
                        onChange={(e) => onClassChange(e.target.value)}
                        className="text-base py-2 px-3 rounded-lg border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent min-w-[100px]"
                    >
                        <option value="3">Lớp 3</option>
                        <option value="4">Lớp 4</option>
                        <option value="5">Lớp 5</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 md:ml-4">
                    <label htmlFor="subjectSelect" className="font-semibold text-base text-teal-900">
                        Môn học:
                    </label>
                    <select
                        id="subjectSelect"
                        value={selectedSubject}
                        onChange={(e) => onSubjectChange(e.target.value)}
                        className="text-base py-2 px-3 rounded-lg border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent min-w-[150px]"
                    >
                        <option value="TinHoc">Tin học</option>
                        <option value="CongNghe">Công nghệ</option>
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-4 md:mt-0 md:ml-4 flex-grow">
                    <button onClick={onLoadPlan} className="btn-primary">1. Tải Kế hoạch Dạy học</button>
                    {isPlanLoaded && (
                        <>
                            <button onClick={onFillGoc} className="btn-primary">
                                {selectedSubject === 'TinHoc' ? '2. Tải bản gốc (ĐH Vinh)' : '2. Tải bản gốc (Chưa gắn NLS)'}
                            </button>
                            <button onClick={onAutoBuild} className="btn-autobuild">3. Tự động Xây dựng (CV 3456)</button>
                            <button onClick={onShowL123} className="btn-info">4. Tra cứu NLS Lớp 1-2-3</button>
                            <button onClick={onShowL45} className="btn-info">5. Tra cứu NLS Lớp 4-5</button>
                            <button onClick={onExport} className="btn-secondary">6. Xuất ra Excel</button>
                        </>
                    )}
                </div>
            </div>
            <style>{`
                .btn-primary, .btn-secondary, .btn-autobuild, .btn-info {
                    font-size: 0.95rem;
                    padding: 0.6rem 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 600;
                    text-align: center;
                }
                .btn-primary:hover, .btn-secondary:hover, .btn-autobuild:hover, .btn-info:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .btn-primary { background-color: #00796b; color: white; border-color: #00796b; }
                .btn-primary:hover { background-color: #004d40; border-color: #004d40; }
                .btn-autobuild { background-color: #d84315; color: white; border-color: #d84315; }
                .btn-autobuild:hover { background-color: #a02f0c; border-color: #a02f0c; }
                .btn-secondary { background-color: #1e88e5; color: white; border-color: #1e88e5; }
                .btn-secondary:hover { background-color: #1565c0; border-color: #1565c0; }
                .btn-info { background-color: #f0f4f8; color: #455a64; border-color: #cfd8dc; font-weight: 500; }
                .btn-info:hover { background-color: #eceff1; border-color: #b0bec5; }
            `}</style>
        </div>
    );
};

export default Controls;
