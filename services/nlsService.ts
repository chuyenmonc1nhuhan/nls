
import { NlsDatabase, NlsDomain, NlsComponent } from '../types';

const parseSingleCsv = (csvData: string) => {
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    const tree: NlsDomain[] = [];
    const db: NlsDatabase = {};
    let currentMien: NlsDomain | null = null;
    let currentThanhPhan: NlsComponent | null = null;

    lines.forEach(line => {
        if (line.startsWith('BẢNG') || line.startsWith('L1-L2-L3') || line.startsWith('L4-L5')) {
            return;
        }

        let col1 = '', col2 = '';
        const firstComma = line.indexOf(',');
        const lastComma = line.lastIndexOf(',');

        if (firstComma === -1) { col1 = line.trim(); }
        else if (firstComma === lastComma) {
            col1 = line.substring(0, firstComma).trim();
            col2 = line.substring(firstComma + 1).trim().replace(/^"|"$/g, '');
        } else {
            col1 = line.substring(0, firstComma).trim();
            col2 = line.substring(firstComma + 1, lastComma).trim().replace(/^"|"$/g, '');
        }

        if (!col1 && !col2) return;

        if (col1.startsWith('Miền NL')) {
            currentMien = { id: col1, name: col2, thanhPhan: [] };
            tree.push(currentMien);
        } else if (col1.startsWith('NL thành phần')) {
            currentThanhPhan = { id: col1, name: col2, description: '', indicators: [] };
            if (currentMien) currentMien.thanhPhan.push(currentThanhPhan);
        } else if (col1.trim() === '' && col2.startsWith('"')) {
            if (currentThanhPhan) currentThanhPhan.description = col2.replace(/^"|"$/g, '');
        } else if (col1.match(/^\d\.\d\.[A-Z]{2}\d[a-z]?$/)) {
            const cleanId = col1.replace(/\.$/, '');
            const indicator = { id: cleanId, name: col2 };
            if (currentThanhPhan) currentThanhPhan.indicators.push(indicator);
            if (!db[indicator.id]) {
                db[indicator.id] = indicator.name;
            }
        }
    });
    return { tree, db };
};

export const parseNlsCsvData = (csvL123: string, csvL45: string) => {
    const { tree: treeL123, db: db1 } = parseSingleCsv(csvL123);
    const { tree: treeL45, db: db2 } = parseSingleCsv(csvL45);
    
    const combinedDb = { ...db1, ...db2 };

    return { db: combinedDb, treeL123, treeL45 };
};
