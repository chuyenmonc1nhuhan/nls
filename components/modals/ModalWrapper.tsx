
import React, { ReactNode } from 'react';

interface ModalWrapperProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
    headerColorClass?: string;
    maxWidthClass?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ 
    title, 
    onClose, 
    children, 
    footer, 
    headerColorClass = 'bg-teal-700 border-b-4 border-teal-900', 
    maxWidthClass = 'max-w-4xl' 
}) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-xl shadow-2xl flex flex-col w-full ${maxWidthClass} max-h-[90vh] overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex justify-between items-center p-4 sm:p-5 text-white ${headerColorClass}`}>
                    <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-3xl font-bold leading-none opacity-70 hover:opacity-100 transition-opacity">&times;</button>
                </div>

                {children}

                {footer && (
                    <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 text-right">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalWrapper;
