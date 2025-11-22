
import { PlanItem, NlsDatabase } from '../types';

// Make TypeScript aware of the global XLSX object from the CDN script
declare const XLSX: any;

export const exportToExcel = (planData: PlanItem[], nlsDatabase: NlsDatabase, selectedClass: string, subject: string): void => {
    if (typeof XLSX === 'undefined') {
        alert('Could not export to Excel. The SheetJS library is missing.');
        return;
    }
    
    const exportData: (string | number)[][] = [];
    const headers = ["Tuần", "Chủ đề/Mạch nội dung", "Tên bài học", "Tiết", "Năng lực số phát triển (Mã)", "Mô tả Năng lực số", "Ghi chú"];
    exportData.push(headers);

    planData.forEach(item => {
        const codes = item.nls;
        const codeString = codes.join('; ');
        const descriptions = codes.map(code => `(${nlsDatabase[code] || '...'})`).join('; ');

        const rowData = [
            item.tuan,
            item.chuDe,
            item.tenBaiHoc,
            item.tiet,
            codeString,
            descriptions,
            item.ghiChu
        ];
        exportData.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    
    ws['!cols'] = [
        { wch: 5 },  // Tuần
        { wch: 30 }, // Chủ đề
        { wch: 40 }, // Tên bài học
        { wch: 5 },  // Tiết
        { wch: 20 }, // Mã NLS
        { wch: 50 }, // Mô tả NLS
        { wch: 10 }  // Ghi chú
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KHDH_NLS');
    
    XLSX.writeFile(wb, `KHDH_${subject}_Lop${selectedClass}_NLS.xlsx`);
};