
import React, { useState, useEffect, useCallback } from 'react';
import { PlanItem, NlsDatabase, NlsDomain, ModalType } from './types';
import { planData_VinhGoc, planData_CV3456_Mapped, csvDataL123, csvDataL45, planData_CongNghe_Raw, planData_CongNghe_Mapped } from './constants';
import { parseNlsCsvData } from './services/nlsService';
import { exportToExcel } from './services/exportService';
import { getGeminiSuggestion, getGeminiLessonPlan, integrateNlsIntoLessonPlan } from './services/geminiService';
import Header from './components/Header';
import Controls from './components/Controls';
import Instructions from './components/Instructions';
import PlanTable from './components/PlanTable';
import NlsDescriptionModal from './components/modals/NlsDescriptionModal';
import NlsPickerModal from './components/modals/NlsPickerModal';
import GeminiSuggestModal from './components/modals/GeminiSuggestModal';

const App: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState<string>('3');
    const [selectedSubject, setSelectedSubject] = useState<string>('TinHoc');
    const [planData, setPlanData] = useState<PlanItem[]>([]);
    const [isPlanLoaded, setIsPlanLoaded] = useState<boolean>(false);
    const [nlsDatabase, setNlsDatabase] = useState<NlsDatabase>({});
    const [nlsTreeL123, setNlsTreeL123] = useState<NlsDomain[]>([]);
    const [nlsTreeL45, setNlsTreeL45] = useState<NlsDomain[]>([]);

    // Modal States
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);
    
    // Picker State
    const [pickerRowIndex, setPickerRowIndex] = useState<number | null>(null);

    // Gemini State
    const [geminiRowIndex, setGeminiRowIndex] = useState<number | null>(null);
    const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);
    const [geminiSuggestion, setGeminiSuggestion] = useState<string | null>(null);
    const [geminiError, setGeminiError] = useState<string | null>(null);
    
    // Gemini Lesson Plan State
    const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
    const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
    const [planError, setPlanError] = useState<string | null>(null);

    // Gemini Integration State
    const [isIntegrating, setIsIntegrating] = useState<boolean>(false);
    const [integratedPlan, setIntegratedPlan] = useState<string | null>(null);
    const [integrationError, setIntegrationError] = useState<string | null>(null);


    useEffect(() => {
        const { db, treeL123, treeL45 } = parseNlsCsvData(csvDataL123, csvDataL45);
        setNlsDatabase(db);
        setNlsTreeL123(treeL123);
        setNlsTreeL45(treeL45);
    }, []);

    const handleLoadPlan = useCallback(() => {
        let data: PlanItem[] = [];
        if (selectedSubject === 'TinHoc') {
            // Default to loading the Mapped (CV 3456) version for Tin Hoc
            data = planData_CV3456_Mapped[selectedClass] || [];
        } else {
            // Default to loading the Mapped version for Cong Nghe (simulating CV 3456 auto-build)
            data = planData_CongNghe_Mapped[selectedClass] || [];
        }
        
        // Deep copy to ensure state updates trigger re-renders
        setPlanData(JSON.parse(JSON.stringify(data)));
        setIsPlanLoaded(true);
    }, [selectedClass, selectedSubject]);

    const handleFillGoc = useCallback(() => {
        let data: PlanItem[] = [];
        if (selectedSubject === 'TinHoc') {
            data = planData_VinhGoc[selectedClass] || [];
        } else {
             // Load Cong Nghe Raw data (Empty NLS)
            data = planData_CongNghe_Raw[selectedClass] || [];
        }
        setPlanData(JSON.parse(JSON.stringify(data)));
    }, [selectedClass, selectedSubject]);

    const handleAutoBuild = useCallback(() => {
        let data: PlanItem[] = [];
        if (selectedSubject === 'TinHoc') {
            data = planData_CV3456_Mapped[selectedClass] || [];
        } else {
            data = planData_CongNghe_Mapped[selectedClass] || [];
        }
        setPlanData(JSON.parse(JSON.stringify(data)));
    }, [selectedClass, selectedSubject]);

    const handleExport = useCallback(() => {
        exportToExcel(planData, nlsDatabase, selectedClass, selectedSubject);
    }, [planData, nlsDatabase, selectedClass, selectedSubject]);

    const openPicker = (index: number) => {
        setPickerRowIndex(index);
        setActiveModal(ModalType.NLS_PICKER);
    };

    const saveNlsForPicker = (selectedCodes: string[]) => {
        if (pickerRowIndex !== null) {
            const newPlan = [...planData];
            newPlan[pickerRowIndex].nls = selectedCodes;
            setPlanData(newPlan);
        }
        closeModal();
    };

    const openGeminiSuggest = async (index: number) => {
        setGeminiRowIndex(index);
        setGeminiSuggestion(null);
        setGeminiError(null);
        setGeneratedPlan(null);
        setPlanError(null);
        setIntegratedPlan(null);
        setIntegrationError(null);
        setActiveModal(ModalType.GEMINI_SUGGEST);
        setIsGeminiLoading(true);

        const item = planData[index];
        
        try {
            const suggestion = await getGeminiSuggestion(
                item.tenBaiHoc, 
                item.nls, 
                nlsDatabase, 
                selectedClass,
                selectedSubject
            );
            setGeminiSuggestion(suggestion);
        } catch (err: any) {
            setGeminiError(err.message || "Có lỗi xảy ra khi gọi Gemini.");
        } finally {
            setIsGeminiLoading(false);
        }
    };
    
    const handleGenerateFullPlan = async () => {
        if (geminiRowIndex === null || !geminiSuggestion) return;
        
        setIsGeneratingPlan(true);
        setPlanError(null);
        
        const item = planData[geminiRowIndex];

        try {
            const plan = await getGeminiLessonPlan(
                item.tenBaiHoc,
                item.nls,
                nlsDatabase,
                selectedClass,
                geminiSuggestion,
                selectedSubject
            );
            setGeneratedPlan(plan);
        } catch (err: any) {
             setPlanError(err.message || "Có lỗi xảy ra khi tạo giáo án.");
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const handleIntegratePlan = async (userContent: string) => {
        if (geminiRowIndex === null) return;
        
        setIsIntegrating(true);
        setIntegrationError(null);
        
        const item = planData[geminiRowIndex];
        
        try {
             const integrated = await integrateNlsIntoLessonPlan(
                item.tenBaiHoc,
                item.nls,
                nlsDatabase,
                selectedClass,
                userContent,
                selectedSubject
             );
             setIntegratedPlan(integrated);
        } catch (err: any) {
            setIntegrationError(err.message || "Có lỗi xảy ra khi tích hợp giáo án.");
        } finally {
            setIsIntegrating(false);
        }
    }

    const closeModal = () => {
        setActiveModal(null);
        setPickerRowIndex(null);
        setGeminiRowIndex(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
            <Header />
            <Controls
                selectedClass={selectedClass}
                onClassChange={setSelectedClass}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                onLoadPlan={handleLoadPlan}
                onFillGoc={handleFillGoc}
                onAutoBuild={handleAutoBuild}
                onShowL123={() => setActiveModal(ModalType.L123)}
                onShowL45={() => setActiveModal(ModalType.L45)}
                onExport={handleExport}
                isPlanLoaded={isPlanLoaded}
            />
            <Instructions />
            
            <main className="p-4 sm:p-6">
                <PlanTable
                    planData={planData}
                    nlsDatabase={nlsDatabase}
                    isPlanLoaded={isPlanLoaded}
                    onAttachNls={openPicker}
                    onSuggestGemini={openGeminiSuggest}
                />
            </main>

            {/* Modals */}
            {activeModal === ModalType.L123 && (
                <NlsDescriptionModal
                    title="Tra cứu Năng lực số (Lớp 1-2-3)"
                    csvData={csvDataL123}
                    onClose={closeModal}
                />
            )}
            {activeModal === ModalType.L45 && (
                <NlsDescriptionModal
                    title="Tra cứu Năng lực số (Lớp 4-5)"
                    csvData={csvDataL45}
                    onClose={closeModal}
                />
            )}
            {activeModal === ModalType.NLS_PICKER && pickerRowIndex !== null && (
                <NlsPickerModal
                    nlsTree={selectedClass === '3' ? nlsTreeL123 : nlsTreeL45}
                    existingCodes={planData[pickerRowIndex].nls}
                    onClose={closeModal}
                    onSave={saveNlsForPicker}
                />
            )}
            {activeModal === ModalType.GEMINI_SUGGEST && geminiRowIndex !== null && (
                <GeminiSuggestModal
                    isLoading={isGeminiLoading}
                    suggestion={geminiSuggestion}
                    error={geminiError}
                    lessonTitle={planData[geminiRowIndex].tenBaiHoc}
                    nlsString={planData[geminiRowIndex].nls.map(c => `${c}: ${nlsDatabase[c] || ''}`).join('\n')}
                    onClose={closeModal}
                    onGeneratePlan={handleGenerateFullPlan}
                    isGeneratingPlan={isGeneratingPlan}
                    generatedPlan={generatedPlan}
                    planError={planError}
                    onIntegratePlan={handleIntegratePlan}
                    isIntegrating={isIntegrating}
                    integratedPlan={integratedPlan}
                    integrationError={integrationError}
                />
            )}
        </div>
    );
};

export default App;
