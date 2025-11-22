
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-teal-700 text-white p-6 sm:p-8 border-b-4 border-teal-900">
            <h1 className="text-2xl md:text-3xl font-bold">
                Ứng dụng Xây dựng Kế hoạch NLS
            </h1>
            <p className="mt-1 text-base md:text-lg opacity-90">
                Dựa trên Công văn 3456/BGDĐT-GDPT và KHDH môn Tin học (ĐH Vinh)
            </p>
        </header>
    );
};

export default Header;
