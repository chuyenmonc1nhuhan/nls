
import React, { useMemo } from 'react';
import ModalWrapper from './ModalWrapper';

interface NlsDescriptionModalProps {
    title: string;
    csvData: string;
    onClose: () => void;
}

const parseAndRenderCsv = (csvData: string): React.ReactNode => {
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    
    return (
        <table className="w-full border-collapse text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="modal-th w-[15%]">Mã NL / Miền NL</th>
                    <th className="modal-th w-[75%]">Tên miền / Mô tả năng lực</th>
                    <th className="modal-th w-[10%]">Tin học (Chủ đạo)</th>
                </tr>
            </thead>
            <tbody>
                {lines.map((line, index) => {
                    if (line.startsWith('BẢNG') || line.startsWith('L1-L2-L3') || line.startsWith('L4-L5')) {
                        return null;
                    }
                    
                    let col1 = '', col2 = '', col3 = '';
                    const firstComma = line.indexOf(',');
                    const lastComma = line.lastIndexOf(',');

                    if (firstComma === -1) { col1 = line.trim(); }
                    else if (firstComma === lastComma) {
                        col1 = line.substring(0, firstComma).trim();
                        col2 = line.substring(firstComma + 1).trim().replace(/^"|"$/g, '');
                    } else {
                        col1 = line.substring(0, firstComma).trim();
                        col2 = line.substring(firstComma + 1, lastComma).trim().replace(/^"|"$/g, '');
                        col3 = line.substring(lastComma + 1).trim();
                    }

                    if (!col1 && !col2 && !col3) return null;

                    const tinHocMark = (col3.toLowerCase() === 'tin học') ? 'x' : '';
                    let rowClass = '';
                    if (col1.startsWith('Miền NL')) rowClass = 'bg-teal-50 text-teal-900 font-bold text-base';
                    else if (col1.startsWith('NL thành phần')) rowClass = 'bg-gray-100 font-semibold';
                    else if (col1.match(/^\d\.\d\.[A-Z]{2}\d[a-z]?$/)) rowClass = 'font-mono';
                    else if (col1.trim() === '' && col2.startsWith('"')) rowClass = 'bg-gray-100/50 italic text-gray-600';

                    return (
                        <tr key={index} className={rowClass}>
                            <td className={`modal-td ${col1.match(/^\d\.\d\.[A-Z]{2}\d[a-z]?$/) ? 'pl-12' : ''}`}>{col1}</td>
                            <td className={`modal-td ${col1.trim() === '' ? 'pl-12' : ''}`}>{col2}</td>
                            <td className="modal-td text-center text-teal-700 font-bold text-lg">{tinHocMark}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

const NlsDescriptionModal: React.FC<NlsDescriptionModalProps> = ({ title, csvData, onClose }) => {
    const tableContent = useMemo(() => parseAndRenderCsv(csvData), [csvData]);

    return (
        <ModalWrapper title={title} onClose={onClose}>
            <div className="modal-body p-4 sm:p-6 overflow-y-auto">
                {tableContent}
            </div>
             <style>{`
                .modal-th, .modal-td { border: 1px solid #e0e0e0; padding: 8px 10px; text-align: left; vertical-align: top; }
                .modal-th { background-color: #f4f7f6; font-size: 0.85em; text-transform: uppercase; }
             `}</style>
        </ModalWrapper>
    );
};

export default NlsDescriptionModal;
