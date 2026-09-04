import React, { useState, useEffect } from 'react';
import { GradeLevel, QuizItem, UserProgress } from './types';
import { ALL_QUIZ_QUESTIONS, GRADE_METADATA, getQuestionsByGrade } from './data/quizData';
import {
  playCorrectSound,
  playWrongSound,
  playVictorySound,
  playClickSound,
  setMuted,
  getInitialMuted,
} from './utils/sound';
import { Header } from './components/Header';
import { MagnifierView } from './components/MagnifierView';
import { QuizCard } from './components/QuizCard';
import { ResultModal } from './components/ResultModal';
import { StickerBookModal } from './components/StickerBookModal';
import { DetectiveCertificateModal } from './components/DetectiveCertificateModal';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Sparkles,
  Award,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY = 'object_quiz_elementary_v1';

export default function App() {
  const [isMuted, setIsMutedState] = useState(getInitialMuted);
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [zoomedOutHint, setZoomedOutHint] = useState(false);
  const [earnedPointsThisTurn, setEarnedPointsThisTurn] = useState(100);

  // 진행도 상태
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            solvedIds: Array.isArray(parsed.solvedIds) ? parsed.solvedIds : [],
            score: typeof parsed.score === 'number' ? parsed.score : 0,
            streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
            highestStreak: typeof parsed.highestStreak === 'number' ? parsed.highestStreak : 0,
            gradeProgress: parsed.gradeProgress || {
              1: { solved: 0, total: 16 },
              2: { solved: 0, total: 17 },
              3: { solved: 0, total: 17 },
              4: { solved: 0, total: 17 },
              5: { solved: 0, total: 16 },
              6: { solved: 0, total: 17 },
            },
          };
        }
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    }
    return {
      solvedIds: [],
      score: 0,
      streak: 0,
      highestStreak: 0,
      gradeProgress: {
        1: { solved: 0, total: 16 },
        2: { solved: 0, total: 17 },
        3: { solved: 0, total: 17 },
        4: { solved: 0, total: 17 },
        5: { solved: 0, total: 16 },
        6: { solved: 0, total: 17 },
      },
    };
  });

  // 모달 상태
  const [showResultModal, setShowResultModal] = useState(false);
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // 로컬스토리지 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const currentGradeQuestions = getQuestionsByGrade(currentGrade);
  const currentItem = currentGradeQuestions[currentQuestionIndex] || currentGradeQuestions[0];

  // 학년 변경 시 문제 인덱스 및 힌트 상태 초기화
  const handleSelectGrade = (grade: GradeLevel) => {
    setCurrentGrade(grade);
    setCurrentQuestionIndex(0);
    setIsRevealed(false);
    setZoomedOutHint(false);
  };

  // 정답 검사 핸들러
  const handleAnswer = (selectedName: string): boolean => {
    const isCorrect =
      selectedName.trim() === currentItem.name.trim() ||
      (currentItem.aliases &&
        currentItem.aliases.some((a) => a.trim() === selectedName.trim()));

    if (isCorrect) {
      // 정답 효과음
      playCorrectSound();
      setIsRevealed(true);

      const isAlreadySolved = progress.solvedIds.includes(currentItem.id);
      const newStreak = progress.streak + 1;
      const bonus = newStreak >= 3 ? 50 : newStreak >= 2 ? 20 : 0;
      const points = 100 + bonus;
      setEarnedPointsThisTurn(points);

      setProgress((prev) => {
        const nextSolved = isAlreadySolved
          ? prev.solvedIds
          : [...prev.solvedIds, currentItem.id];

        const nextScore = prev.score + (isAlreadySolved ? 20 : points);
        const nextHighestStreak = Math.max(prev.highestStreak, newStreak);

        return {
          ...prev,
          solvedIds: nextSolved,
          score: nextScore,
          streak: newStreak,
          highestStreak: nextHighestStreak,
        };
      });

      // 정답 결과 모달 띄우기
      setTimeout(() => {
        setShowResultModal(true);
      }, 400);

      // 학년 완료 검사
      const solvedInCurrentGrade = progress.solvedIds.filter((id) =>
        currentGradeQuestions.some((q) => q.id === id)
      ).length + (isAlreadySolved ? 0 : 1);

      if (solvedInCurrentGrade === currentGradeQuestions.length) {
        setTimeout(() => {
          playVictorySound();
        }, 800);
      }

      return true;
    } else {
      // 오답 효과음
      playWrongSound();
      setProgress((prev) => ({
        ...prev,
        streak: 0,
      }));
      return false;
    }
  };

  // 다음 문제로 이동
  const handleNextQuestion = () => {
    setShowResultModal(false);
    setIsRevealed(false);
    setZoomedOutHint(false);

    if (currentQuestionIndex < currentGradeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 해당 학년 마지막 문제 완료 시 다음 학년으로 이동 안내
      if (currentGrade < 6) {
        const nextGrade = (currentGrade + 1) as GradeLevel;
        setCurrentGrade(nextGrade);
        setCurrentQuestionIndex(0);
      } else {
        // 6학년까지 모두 완주!
        setCurrentQuestionIndex(0);
      }
    }
  };

  // 이전 문제로 이동
  const handlePrevQuestion = () => {
    playClickSound();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsRevealed(false);
      setZoomedOutHint(false);
    }
  };

  // 문제 직접 선택 (도감 등에서)
  const handleSelectQuizItem = (item: QuizItem) => {
    setCurrentGrade(item.grade);
    const questions = getQuestionsByGrade(item.grade);
    const index = questions.findIndex((q) => q.id === item.id);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
    }
    setIsRevealed(false);
    setZoomedOutHint(false);
  };

  // 랜덤 셔플 문제 이동
  const handleRandomQuestion = () => {
    playClickSound();
    const randomIndex = Math.floor(Math.random() * currentGradeQuestions.length);
    setCurrentQuestionIndex(randomIndex);
    setIsRevealed(false);
    setZoomedOutHint(false);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMutedState(nextMuted);
    setMuted(nextMuted);
  };

  const currentGradeSolvedCount = progress.solvedIds.filter((id) =>
    currentGradeQuestions.some((q) => q.id === id)
  ).length;

  const isCurrentGradeCompleted =
    currentGradeSolvedCount === currentGradeQuestions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 flex flex-col justify-between selection:bg-white/40 selection:text-white">
      {/* 고정 헤더 */}
      <Header
        currentGrade={currentGrade}
        onSelectGrade={handleSelectGrade}
        totalSolvedCount={progress.solvedIds.length}
        gradeSolvedCount={currentGradeSolvedCount}
        gradeTotalCount={currentGradeQuestions.length}
        score={progress.score}
        streak={progress.streak}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenStickers={() => setShowStickerModal(true)}
        onOpenCertificate={() => setShowCertificateModal(true)}
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-5xl w-full mx-auto px-4 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* 학년 테마 알림 배너 (프로스티드 글래스) */}
        <div className="mb-4 bg-white/25 backdrop-blur-xl rounded-2xl p-3 border border-white/35 shadow-lg flex items-center justify-between flex-wrap gap-2 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {GRADE_METADATA[currentGrade].badge.split(' ')[0]}
            </span>
            <div>
              <span className="font-extrabold text-sm text-white drop-shadow-2xs">
                {GRADE_METADATA[currentGrade].title} 단계
              </span>
              <span className="text-xs text-white/85 ml-2 font-medium">
                {GRADE_METADATA[currentGrade].description}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="prev-btn"
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevQuestion}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/35 disabled:opacity-30 disabled:hover:bg-white/20 text-white transition-all border border-white/30 backdrop-blur-sm"
              title="이전 문제"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-white px-1.5 drop-shadow-2xs">
              {currentQuestionIndex + 1} / {currentGradeQuestions.length}
            </span>
            <button
              id="next-btn"
              type="button"
              disabled={currentQuestionIndex === currentGradeQuestions.length - 1}
              onClick={() => {
                playClickSound();
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsRevealed(false);
                setZoomedOutHint(false);
              }}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/35 disabled:opacity-30 disabled:hover:bg-white/20 text-white transition-all border border-white/30 backdrop-blur-sm"
              title="다음 문제"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="random-btn"
              type="button"
              onClick={handleRandomQuestion}
              className="ml-1 p-1.5 px-2.5 rounded-xl bg-white/30 hover:bg-white/50 text-white transition-colors flex items-center gap-1 text-xs font-bold border border-white/40 backdrop-blur-md shadow-xs"
              title="랜덤 문제로 이동"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">랜덤</span>
            </button>
          </div>
        </div>

        {/* 2열 반응형 그리드: 왼쪽 돋보기 뷰포트 / 오른쪽 퀴즈 카드 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 왼쪽: 돋보기 인터랙티브 뷰어 (5컬럼) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <MagnifierView
              imageUrl={currentItem.imageUrl}
              name={currentItem.name}
              cropX={currentItem.cropX}
              cropY={currentItem.cropY}
              baseZoom={currentItem.zoomLevel}
              isRevealed={isRevealed}
              zoomedOutHint={zoomedOutHint}
              onToggleZoomOutHint={() => setZoomedOutHint(!zoomedOutHint)}
            />

            {/* 이미 해결된 문제 표시 */}
            {progress.solvedIds.includes(currentItem.id) && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-white bg-emerald-600/80 backdrop-blur-md border border-emerald-300/60 font-bold px-3.5 py-1 rounded-full shadow-md">
                <span>✨</span>
                <span>이미 도감에 수집한 물건이에요!</span>
              </div>
            )}
          </div>

          {/* 오른쪽: 퀴즈 카드 (7컬럼) */}
          <div className="lg:col-span-7">
            <QuizCard
              item={currentItem}
              questionIndex={currentQuestionIndex}
              totalInGrade={currentGradeQuestions.length}
              isRevealed={isRevealed}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
              streak={progress.streak}
              zoomedOutHint={zoomedOutHint}
              onToggleZoomOutHint={() => setZoomedOutHint(!zoomedOutHint)}
            />
          </div>
        </div>

        {/* 하단 100문제 진행 현황 바 */}
        <div className="mt-6 bg-white/25 backdrop-blur-xl rounded-[28px] p-4 sm:p-5 border border-white/35 shadow-xl text-white">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white mb-2.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>전체 100문제 정복 도전기</span>
            </span>
            <span className="text-white font-black drop-shadow-2xs">
              {progress.solvedIds.length} / {ALL_QUIZ_QUESTIONS.length} 물건 발견 완료 (
              {Math.round((progress.solvedIds.length / ALL_QUIZ_QUESTIONS.length) * 100)}%)
            </span>
          </div>

          {/* 6개 학년 세그먼트 게이지 바 */}
          <div className="grid grid-cols-6 gap-1.5 h-3.5 rounded-full bg-black/20 p-0.5 overflow-hidden border border-white/20 backdrop-blur-sm">
            {([1, 2, 3, 4, 5, 6] as GradeLevel[]).map((grade) => {
              const questions = getQuestionsByGrade(grade);
              const solved = progress.solvedIds.filter((id) =>
                questions.some((q) => q.id === id)
              ).length;
              const fillRatio = questions.length > 0 ? solved / questions.length : 0;

              return (
                <div
                  key={grade}
                  onClick={() => handleSelectGrade(grade)}
                  className="relative h-full bg-white/20 rounded-xs overflow-hidden cursor-pointer hover:bg-white/35 transition-colors"
                  title={`${grade}학년: ${solved}/${questions.length} 완료`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-amber-300 to-yellow-300 transition-all duration-300 shadow-inner"
                    style={{ width: `${fillRatio * 100}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] text-white/90 font-bold mt-2 px-1 drop-shadow-2xs">
            <span>🌱 1학년</span>
            <span>🔍 2학년</span>
            <span>⭐ 3학년</span>
            <span>🏆 4학년</span>
            <span>🎖️ 5학년</span>
            <span>👑 6학년</span>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-4 mb-4 mx-4 flex justify-center">
        <div className="bg-black/20 backdrop-blur-md px-6 sm:px-10 py-2.5 rounded-full text-white/90 font-medium text-xs border border-white/20 shadow-lg text-center">
          ‘이 물건의 정체는?’ 초등학생 1~6학년 맞춤 100문제 돋보기 추리 퀴즈 게임 🔍
        </div>
      </footer>

      {/* 정답 확인 모달 */}
      <ResultModal
        item={currentItem}
        isOpen={showResultModal}
        onNext={handleNextQuestion}
        onOpenStickers={() => {
          setShowResultModal(false);
          setShowStickerModal(true);
        }}
        isGradeCompleted={isCurrentGradeCompleted}
        earnedPoints={earnedPointsThisTurn}
        streak={progress.streak}
      />

      {/* 스티커 도감 모달 */}
      <StickerBookModal
        isOpen={showStickerModal}
        onClose={() => setShowStickerModal(false)}
        solvedIds={progress.solvedIds}
        onSelectQuizToPlay={handleSelectQuizItem}
      />

      {/* 명탐정 자격증 모달 */}
      <DetectiveCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        currentGrade={currentGrade}
        solvedCount={progress.solvedIds.length}
        totalCount={ALL_QUIZ_QUESTIONS.length}
        score={progress.score}
        highestStreak={progress.highestStreak}
      />
    </div>
  );
}
