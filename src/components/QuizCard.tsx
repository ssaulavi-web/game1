import React, { useState, useEffect } from 'react';
import { QuizItem } from '../types';
import { Lightbulb, HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { playClickSound, playHintSound } from '../utils/sound';

interface QuizCardProps {
  item: QuizItem;
  questionIndex: number;
  totalInGrade: number;
  isRevealed: boolean;
  onAnswer: (selectedName: string) => boolean; // returns whether correct
  onNextQuestion: () => void;
  streak: number;
  zoomedOutHint: boolean;
  onToggleZoomOutHint: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  item,
  questionIndex,
  totalInGrade,
  isRevealed,
  onAnswer,
  onNextQuestion,
  streak,
  zoomedOutHint,
  onToggleZoomOutHint,
}) => {
  const [showChosung, setShowChosung] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState<string | null>(null);
  const [useSyllableMode, setUseSyllableMode] = useState(false);
  const [assembledLetters, setAssembledLetters] = useState<string[]>([]);
  const [scrambledPool, setScrambledPool] = useState<string[]>([]);

  // 문제 변경 시 상태 리셋
  useEffect(() => {
    setShowChosung(false);
    setShowUsage(false);
    setSelectedOption(null);
    setWrongAttempt(null);
    setAssembledLetters([]);

    // 음절 모드를 위한 글자 풀 생성
    const correctLetters = item.name.split('');
    // 다른 보기들의 글자들도 섞기
    const distractorLetters = item.options
      .flatMap((opt) => opt.split(''))
      .filter((char) => !correctLetters.includes(char))
      .slice(0, 4);

    const pool = [...correctLetters, ...distractorLetters].sort(() => Math.random() - 0.5);
    setScrambledPool(pool);
  }, [item.id, item.name, item.options]);

  const handleOptionClick = (option: string) => {
    if (isRevealed) return;
    playClickSound();
    setSelectedOption(option);
    const isCorrect = onAnswer(option);
    if (!isCorrect) {
      setWrongAttempt(option);
      setTimeout(() => {
        setWrongAttempt(null);
      }, 1200);
    }
  };

  const handleChosungHint = () => {
    if (showChosung) return;
    playHintSound();
    setShowChosung(true);
  };

  const handleUsageHint = () => {
    if (showUsage) return;
    playHintSound();
    setShowUsage(true);
  };

  // 음절 모드에서 글자 터치
  const handleLetterTap = (letter: string, indexInPool: number) => {
    playClickSound();
    const newAssembled = [...assembledLetters, letter];
    setAssembledLetters(newAssembled);

    // 풀에서 제거
    const newPool = [...scrambledPool];
    newPool.splice(indexInPool, 1);
    setScrambledPool(newPool);

    // 글자 완성 검사
    const fullWord = newAssembled.join('');
    if (fullWord.length === item.name.length) {
      const isCorrect = onAnswer(fullWord);
      if (!isCorrect) {
        setWrongAttempt(fullWord);
        setTimeout(() => {
          setWrongAttempt(null);
          // 리셋
          setAssembledLetters([]);
          const pool = [...item.name.split(''), ...scrambledPool].sort(() => Math.random() - 0.5);
          setScrambledPool(pool);
        }, 1200);
      }
    }
  };

  const handleResetLetters = () => {
    playClickSound();
    setAssembledLetters([]);
    const correctLetters = item.name.split('');
    const distractorLetters = item.options
      .flatMap((opt) => opt.split(''))
      .filter((char) => !correctLetters.includes(char))
      .slice(0, 4);
    setScrambledPool([...correctLetters, ...distractorLetters].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="w-full bg-white/30 backdrop-blur-2xl rounded-[36px] p-5 sm:p-7 shadow-2xl border border-white/50 flex flex-col justify-between gap-5 text-slate-900">
      {/* 퀴즈 헤더 정보 */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-white/90 text-indigo-700 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
              Q{questionIndex + 1}
            </span>
            <span className="text-xs font-bold text-white/90 drop-shadow-2xs">
              {item.grade}학년 퀴즈 {questionIndex + 1} / {totalInGrade} (전체 #{item.id})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="bg-white/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/40 shadow-xs">
              🏷️ {item.category}
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white font-['Jua',sans-serif] tracking-tight drop-shadow-sm">
          돋보기 속 이 물건의 정체는 무엇일까요?
        </h2>
        <p className="text-sm text-white/90 mt-1 font-medium drop-shadow-2xs">
          확대된 사진의 특징을 자세히 관찰하고 정답을 골라보세요!
        </p>
      </div>

      {/* 힌트 박스 영역 */}
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 border border-white/30 shadow-inner flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-white">
            <Lightbulb className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>탐정 단서 힌트</span>
          </div>
          <span className="text-[11px] text-white/80 font-medium">필요할 때 열어보세요</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* 초성 힌트 */}
          <button
            id="hint-chosung-btn"
            type="button"
            onClick={handleChosungHint}
            className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between backdrop-blur-md ${
              showChosung
                ? 'bg-white/90 text-slate-900 border-white shadow-sm'
                : 'bg-white/40 hover:bg-white/60 text-slate-900 border-white/50 shadow-xs'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>🔤 초성 힌트:</span>
              <strong className="text-sm text-indigo-700 font-black">
                {showChosung ? item.hintChosung : '??'}
              </strong>
            </span>
            {!showChosung && (
              <span className="text-[10px] bg-white/70 text-indigo-900 px-2 py-0.5 rounded font-bold border border-white/60">
                열기
              </span>
            )}
          </button>

          {/* 용도 힌트 */}
          <button
            id="hint-usage-btn"
            type="button"
            onClick={handleUsageHint}
            className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between backdrop-blur-md ${
              showUsage
                ? 'bg-white/90 text-slate-900 border-white shadow-sm'
                : 'bg-white/40 hover:bg-white/60 text-slate-900 border-white/50 shadow-xs'
            }`}
          >
            <span className="truncate pr-1">
              <span>💡 설명 힌트: </span>
              <span className="font-medium">
                {showUsage ? item.hintUsage : '용도와 생김새 단서'}
              </span>
            </span>
            {!showUsage && (
              <span className="text-[10px] bg-white/70 text-indigo-900 px-2 py-0.5 rounded font-bold shrink-0 border border-white/60">
                열기
              </span>
            )}
          </button>
        </div>

        {/* 용도 힌트가 열렸을 때 전체 텍스트 펼침 */}
        {showUsage && (
          <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-white text-xs sm:text-sm text-slate-800 font-medium leading-relaxed shadow-sm animate-fade-in">
            📌 {item.hintUsage}
          </div>
        )}
      </div>

      {/* 오답 피드백 알림 */}
      {wrongAttempt && (
        <div className="bg-rose-500/90 backdrop-blur-md border border-rose-300 text-white p-3 rounded-2xl text-center text-sm font-bold shadow-lg animate-bounce flex items-center justify-center gap-2">
          <XCircle className="w-5 h-5 text-white" />
          <span>아쉬워요! &apos;{wrongAttempt}&apos;은(는) 아니에요. 다시 한 번 추리해보세요!</span>
        </div>
      )}

      {/* 입력 방식 전환 탭 (4지선다 vs 음절 블록) */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-white/90 drop-shadow-2xs">
          {useSyllableMode ? '🔠 글자를 순서대로 터치하세요' : '🔘 4개 보기 중 정답을 선택하세요'}
        </span>
        <button
          id="toggle-syllable-mode-btn"
          type="button"
          onClick={() => {
            playClickSound();
            setUseSyllableMode(!useSyllableMode);
          }}
          className="text-xs text-yellow-200 hover:text-white font-bold underline flex items-center gap-1 transition-colors drop-shadow-2xs"
        >
          <span>{useSyllableMode ? '👉 4지선다 보기로 풀기' : '👉 글자 맞추기로 풀기'}</span>
        </button>
      </div>

      {/* 모드 1: 4지선다 선택지 버튼 */}
      {!useSyllableMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {item.options.map((option, idx) => {
            const isThisSelected = selectedOption === option;
            const isCorrectOption = option === item.name || (item.aliases && item.aliases.includes(option));
            const isThisWrong = wrongAttempt === option;

            let buttonStyle = 'bg-white/65 hover:bg-white/90 backdrop-blur-md text-slate-800 border-white/60 hover:border-white shadow-md hover:scale-[1.01] active:scale-[0.98]';
            if (isRevealed) {
              if (isCorrectOption) {
                buttonStyle = 'bg-emerald-500/95 text-white border-emerald-300 shadow-lg ring-2 ring-white/80 font-black';
              } else if (isThisSelected) {
                buttonStyle = 'bg-rose-100/70 text-rose-800 border-rose-300 opacity-60';
              } else {
                buttonStyle = 'bg-white/30 text-slate-500 border-white/20 opacity-50';
              }
            } else if (isThisWrong) {
              buttonStyle = 'bg-rose-500/90 text-white border-rose-300 shadow-md animate-pulse';
            }

            const badges = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={option}
                id={`quiz-option-${idx}-btn`}
                type="button"
                disabled={isRevealed}
                onClick={() => handleOptionClick(option)}
                className={`w-full py-3.5 px-4 rounded-2xl border-2 text-left font-bold text-base sm:text-lg transition-all flex items-center justify-between ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-2xs ${
                      isRevealed && isCorrectOption
                        ? 'bg-white text-emerald-700'
                        : 'bg-white/70 text-indigo-900'
                    }`}
                  >
                    {badges[idx]}
                  </span>
                  <span>{option}</span>
                </div>
                {isRevealed && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* 모드 2: 글자 조각 맞추기 모드 */
        <div className="flex flex-col gap-3">
          {/* 조합 중인 단어 슬롯 */}
          <div className="min-h-[52px] bg-white/20 backdrop-blur-md border-2 border-dashed border-white/40 rounded-2xl p-2.5 flex items-center justify-center gap-2">
            {assembledLetters.length === 0 ? (
              <span className="text-xs text-white/90 font-semibold drop-shadow-2xs">
                아래 글자 타일을 눌러 단어를 완성하세요!
              </span>
            ) : (
              assembledLetters.map((char, i) => (
                <span
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white/95 text-indigo-700 font-black text-lg flex items-center justify-center shadow-md animate-scale-in font-['Jua',sans-serif]"
                >
                  {char}
                </span>
              ))
            )}
            {assembledLetters.length > 0 && !isRevealed && (
              <button
                type="button"
                onClick={handleResetLetters}
                className="ml-2 p-1.5 rounded-lg bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm border border-white/40"
                title="다시 놓기"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 선택 가능한 글자 풀 타일 */}
          <div className="flex flex-wrap gap-2 justify-center py-1">
            {scrambledPool.map((letter, idx) => (
              <button
                key={`${letter}-${idx}`}
                type="button"
                disabled={isRevealed}
                onClick={() => handleLetterTap(letter, idx)}
                className="w-12 h-12 rounded-2xl bg-white/75 hover:bg-white text-slate-900 border border-white/80 text-xl font-black font-['Jua',sans-serif] shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center backdrop-blur-sm"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 정답 공개 완료 후 다음 문제 이동 버튼 */}
      {isRevealed && (
        <div className="pt-2 flex items-center justify-end">
          <button
            id="next-question-btn"
            type="button"
            onClick={onNextQuestion}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/95 hover:bg-white text-indigo-700 font-black text-base rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 border border-white"
          >
            <span>다음 문제 도전하기</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
