export interface PlanItem {
    tuan: number;
    chuDe: string;
    tenBaiHoc: string;
    tiet: number;
    nls: string[];
    ghiChu: string;
}

export interface NlsIndicator {
    id: string;
    name: string;
}

export interface NlsComponent {
    id: string;
    name: string;
    description: string;
    indicators: NlsIndicator[];
}

export interface NlsDomain {
    id: string;
    name: string;
    thanhPhan: NlsComponent[];
}

export type NlsDatabase = Record<string, string>;

export enum ModalType {
    L123 = 'L123',
    L45 = 'L45',
    NLS_PICKER = 'nlsPicker',
    GEMINI_SUGGEST = 'geminiSuggest',
}
