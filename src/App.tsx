import { useState } from 'react';
import { mockHaramieStory } from './data/mockData';
import { WordOrderingActivity } from './components/WordOrderingActivity';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleSuccess = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    // 정답 피드백 후 1.5초 뒤에 다음 장면으로 이동
    setTimeout(() => {
      if (currentStep < mockHaramieStory.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        alert("🎉 축하합니다! 오늘의 영어 어순 스토리북을 완성했습니다!");
        setCurrentStep(0);
        setCompletedSteps([]);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      {/* 헤더 */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🐕</span>
            <div>
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                하지영영어수학학원 LMS
              </h1>
              <p className="text-xs text-slate-400">3D 스토리보드 어순 체득 엔진</p>
            </div>
          </div>
          
          {/* 학습 진척도 */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-500">진행도:</span>
            <div className="w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500" 
                style={{ width: `${(completedSteps.length / mockHaramieStory.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-cyan-400">
              {completedSteps.length}/{mockHaramieStory.length}
            </span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* 왼쪽: 현재까지 완성한 스토리 로드맵 */}
          <div className="bg-slate-900/40 border border-slate-900/60 rounded-3xl p-5 space-y-4 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-400 mb-2">📖 스토리 챕터 맵</h3>
            <div className="space-y-2.5">
              {mockHaramieStory.map((scene, idx) => {
                const isActive = idx === currentStep;
                const isCompleted = completedSteps.includes(idx);
                const isLocked = idx > completedSteps.length;

                return (
                  <button
                    key={idx}
                    onClick={() => !isLocked && setCurrentStep(idx)}
                    disabled={isLocked}
                    className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/5'
                        : isCompleted
                          ? 'bg-slate-900/80 border-emerald-950/60 text-emerald-400 hover:bg-slate-800/50'
                          : 'bg-slate-900/20 border-slate-950 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : isActive 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isActive ? 'text-indigo-300' : 'text-slate-300'}`}>
                        Scene {scene.scene_number}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{scene.script_line}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 오른쪽: 메인 드래그 앤 드롭 학습 영역 */}
          <div className="md:col-span-2">
            <WordOrderingActivity 
              scene={mockHaramieStory[currentStep]} 
              onSuccess={handleSuccess} 
            />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-900/60 bg-slate-950 py-5 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} 하지영영어수학학원. All Rights Reserved.
      </footer>
    </div>
  );
}
