import { useState, useEffect } from 'react';

interface Scene {
  scene_number: number;
  image_url: string;
  script_line: string;
  word_order_question: string;
  word_order_answer: string[];
}

interface WordOrderingActivityProps {
  scene: Scene;
  onSuccess: () => void;
}

export function WordOrderingActivity({ scene, onSuccess }: WordOrderingActivityProps) {
  // 사용자가 섞어놓은 단어 카드 리스트
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  // 사용자가 올린 정답 정렬 슬롯
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  // 정답 제출 상태 피드백
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  useEffect(() => {
    // 단어를 무작위로 섞음 (처음 로딩 시)
    const words = [...scene.word_order_answer];
    // 단어가 우연히 순서대로 섞이는 것을 방지
    let isSame = true;
    while (isSame && words.length > 1) {
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
      isSame = words.every((w, idx) => w === scene.word_order_answer[idx]);
    }
    setShuffledWords(words);
    setPlacedWords([]);
    setStatus('idle');
  }, [scene]);

  // 단어 클릭 시 이동
  const handleWordClick = (word: string, fromPlaced: boolean) => {
    if (status === 'success') return;
    setStatus('idle');
    
    if (fromPlaced) {
      // 선택 슬롯에서 대기 카드로 이동
      setPlacedWords(prev => prev.filter(w => w !== word));
      setShuffledWords(prev => [...prev, word]);
    } else {
      // 대기 카드에서 선택 슬롯으로 이동
      setShuffledWords(prev => prev.filter(w => w !== word));
      setPlacedWords(prev => [...prev, word]);
    }
  };

  // 정답 검증 로직
  const handleCheckAnswer = () => {
    const isCorrect = 
      placedWords.length === scene.word_order_answer.length &&
      placedWords.every((word, idx) => word === scene.word_order_answer[idx]);

    if (isCorrect) {
      setStatus('success');
      onSuccess();
    } else {
      setStatus('fail');
      // 오답 시 0.8초 후 초기화
      setTimeout(() => {
        setShuffledWords([...scene.word_order_answer].sort(() => Math.random() - 0.5));
        setPlacedWords([]);
        setStatus('idle');
      }, 1000);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-6 max-w-2xl mx-auto overflow-hidden">
      {/* 1. 스토리 이미지 & 대본 매핑 */}
      <div className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800/50">
        <img 
          src={scene.image_url} 
          alt={`Scene ${scene.scene_number}`} 
          className={`w-full h-full object-cover transition-all duration-1000 ${
            status === 'success' ? 'scale-105 filter-none brightness-105' : 'blur-[4px] grayscale opacity-45'
          }`} 
        />
        
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
          <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Scene {scene.scene_number}</span>
          <p className="text-white text-lg font-bold mt-1 leading-snug">{scene.script_line}</p>
        </div>

        {/* 잠금 표시 */}
        {status !== 'success' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-slate-950/80 px-4 py-2 rounded-full border border-slate-700/50 text-slate-300 text-xs font-semibold backdrop-blur-sm shadow-lg flex items-center space-x-1.5">
              <span>🔒 어순을 정렬하여 스토리보드를 완성하세요</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. 단어 조립 슬롯 */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-400">문장을 순서대로 정렬하세요:</div>
        <div className={`min-h-[72px] p-3.5 rounded-2xl border-2 flex flex-wrap gap-2.5 items-center transition-all duration-300 ${
          status === 'success' 
            ? 'bg-emerald-950/20 border-emerald-500/80 shadow-lg shadow-emerald-500/10' 
            : status === 'fail' 
              ? 'bg-rose-950/20 border-rose-500/80 shadow-lg shadow-rose-500/10 animate-wiggle' 
              : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          {placedWords.length === 0 && (
            <span className="text-slate-600 text-sm italic mx-auto">아래 단어 카드를 클릭하여 문장을 만드세요.</span>
          )}
          {placedWords.map((word, idx) => (
            <button
              key={`placed-${idx}`}
              onClick={() => handleWordClick(word, true)}
              disabled={status === 'success'}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white rounded-xl font-bold shadow-md shadow-cyan-500/10 active:scale-95 transition-all cursor-pointer"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 대기 중인 단어 카드 풀 */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2.5 justify-center min-h-[48px]">
          {shuffledWords.map((word, idx) => (
            <button
              key={`shuffled-${idx}`}
              onClick={() => handleWordClick(word, false)}
              className="px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 hover:border-slate-500 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 상태 피드백 및 정답 제출 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="text-sm font-semibold">
          {status === 'success' && <span className="text-emerald-400 flex items-center">🎉 Excellent! 정답입니다.</span>}
          {status === 'fail' && <span className="text-rose-400 flex items-center">❌ Try Again! 오답입니다.</span>}
        </div>
        <div className="flex space-x-2">
          {placedWords.length > 0 && status !== 'success' && (
            <button 
              onClick={() => { setShuffledWords([...scene.word_order_answer].sort(() => Math.random() - 0.5)); setPlacedWords([]); }} 
              className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              초기화
            </button>
          )}
          <button
            onClick={handleCheckAnswer}
            disabled={placedWords.length === 0 || status === 'success'}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/10 active:scale-98 cursor-pointer"
          >
            정답 확인
          </button>
        </div>
      </div>
    </div>
  );
}
