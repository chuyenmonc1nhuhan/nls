
import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { NlsDomain } from '../../types';

interface NlsPickerModalProps {
    nlsTree: NlsDomain[];
    existingCodes: string[];
    onClose: () => void;
    onSave: (selectedCodes: string[]) => void;
}

const NlsPickerModal: React.FC<NlsPickerModalProps> = ({ nlsTree, existingCodes, onClose, onSave }) => {
    const [selected, setSelected] = useState<Set<string>>(new Set(existingCodes));

    const handleToggle = (code: string) => {
        const newSelected = new Set(selected);
        if (newSelected.has(code)) {
            newSelected.delete(code);
        } else {
            newSelected.add(code);
        }
        setSelected(newSelected);
    };

    const handleSave = () => {
        onSave(Array.from(selected));
    };

    const footer = (
        <>
            <button onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold transition">Hủy</button>
            <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition ml-3">Lưu thay đổi</button>
        </>
    );

    return (
        <ModalWrapper title="Gắn Năng lực số cho Bài học" onClose={onClose} footer={footer} maxWidthClass="max-w-3xl">
            <div className="p-4 sm:p-6 overflow-y-auto">
                <div className="space-y-2">
                    {nlsTree.map(mien => (
                        <details key={mien.id} className="border rounded-lg overflow-hidden">
                            <summary className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer font-bold list-none flex items-center gap-3">
                                <span className="details-marker text-teal-600 font-bold"></span> {mien.name}
                            </summary>
                            <div className="p-3 space-y-2">
                                {mien.thanhPhan.map(tp => (
                                    <details key={tp.id} className="border rounded-md">
                                        <summary className="p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer font-semibold list-none flex items-center gap-2">
                                            <span className="details-marker text-gray-500"></span> {tp.name}
                                        </summary>
                                        <div className="p-3">
                                            <p className="text-sm italic text-gray-600 mb-3 pb-2 border-b border-dashed">{tp.description}</p>
                                            <div className="space-y-2">
                                                {tp.indicators.map(ind => (
                                                    <label key={ind.id} className="flex items-center gap-3 p-2 rounded hover:bg-teal-50 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selected.has(ind.id)}
                                                            onChange={() => handleToggle(ind.id)}
                                                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                        />
                                                        <div>
                                                            <span className="font-mono text-sm font-semibold bg-gray-200 text-teal-800 px-1.5 py-0.5 rounded">{ind.id}</span>
                                                            <span className="ml-2 text-sm">{ind.name}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
            <style>{`
                details > summary { list-style: none; }
                details > summary::-webkit-details-marker { display: none; }
                details > summary .details-marker::before { content: '+'; }
                details[open] > summary .details-marker::before { content: '−'; }
            `}</style>
        </ModalWrapper>
    );
};

export default NlsPickerModal;
