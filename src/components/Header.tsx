import React from 'react';
import { GradeLevel } from '../types';
import { GRADE_METADATA } from '../data/quizData';
import { Volume2, VolumeX, BookOpen, Award, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface HeaderProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  totalSolvedCount: number;
  gradeSolvedCount: number;
  gradeTotalCount: number;
  score: number;
  streak: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStickers: () => void;
  onOpenCertificate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  onSelectGrade,
  totalSolvedCount,
  gradeSolvedCount,
  gradeTotalCount,
  score,
  streak,
  isMuted,
  onToggleMute,
  onOpenStickers,
  onOpenCertificate,
}) => {
  const grades: GradeLevel[] = [1, 2, 3, 4, 5, 6];
  const gradeInfo = GRADE_METADATA[currentGrade];

  return (
    <header className="w-full bg-white/20 backdrop-blur-xl border-b border-white/30 sticky top-0 z-30 shadow-lg text-white">
      <div className="max-w-5xl mx-auto px-4 py-2.5 sm:py-3">
        {/* 상단 바: 로고, 점수, 도감, 자격증, 사운드 토글 */}
        <div className="flex items-center justify-between gap-3">
          {/* 앱 타이틀 */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/30 backdrop-blur-md text-white flex items-center justify-center font-black text-xl shadow-md border border-white/40 transform -rotate-3 hover:rotate-0 transition-transform">
              🔍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm tracking-tight font-['Jua',sans-serif]">
                  이 물건의 정체는?
                </h1>
                <span className="hidden sm:inline-block bg-white/25 backdrop-blur-md text-white border border-white/40 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  100문제 돋보기 퀴즈
                </span>
              </div>
              <p className="text-[11px] text-white/80 hidden sm:block font-medium drop-shadow-2xs">
                초등 1~6학년 맞춤형 부분 확대 추리 퀴즈 게임
              </p>
            </div>
          </div>

          {/* 우측 퀵 컨트롤: 점수, 콤보, 버튼들 */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 연속 콤보 배지 */}
            {streak >= 2 && (
              <div className="flex items-center gap-1 bg-rose-500/90 backdrop-blur-md border border-rose-300 text-white font-black text-xs px-2.5 py-1 rounded-full animate-pulse shadow-md">
                <span>🔥</span>
                <span>{streak}연속!</span>
              </div>
            )}

            {/* 총 점수 */}
            <div className="bg-amber-400/90 backdrop-blur-md border border-amber-200 text-slate-900 font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-md">
              <span className="text-lg">⭐</span>
              <span>{score.toLocaleString()}P</span>
            </div>

            {/* 스티커 도감 버튼 */}
            <button
              id="open-sticker-book-btn"
              type="button"
              onClick={() => {
                playClickSound();
                onOpenStickers();
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-white/20 hover:bg-white/35 backdrop-blur-md text-white border border-white/30 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="100개 물건 스티커 도감"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">도감</span>
              <span className="bg-white/30 text-white text-[11px] px-1.5 py-0.2 rounded-full font-black border border-white/40">
                {totalSolvedCount}/100
              </span>
            </button>

            {/* 명탐정 자격증 버튼 */}
            <button
              id="open-certificate-btn"
              type="button"
              onClick={() => {
                playClickSound();
                onOpenCertificate();
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-white/20 hover:bg-white/35 backdrop-blur-md text-white border border-white/30 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="명탐정 자격증 보기"
            >
              <Award className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">자격증</span>
            </button>

            {/* 소리 켜기/끄기 토글 */}
            <button
              id="toggle-sound-btn"
              type="button"
              onClick={() => {
                playClickSound();
                onToggleMute();
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition-all shadow-sm backdrop-blur-md ${
                isMuted
                  ? 'bg-black/20 text-white/50 border-white/20'
                  : 'bg-white/25 text-white border-white/40 hover:bg-white/35'
              }`}
              title={isMuted ? '효과음 켜기' : '효과음 끄기'}
              aria-label={isMuted ? '효과음 켜기' : '효과음 끄기'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 학년 선택 탭 바 (1학년 ~ 6학년) */}
        <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 max-w-full bg-black/10 backdrop-blur-md p-1 rounded-2xl border border-white/15">
            {grades.map((g) => {
              const meta = GRADE_METADATA[g];
              const isSelected = currentGrade === g;
              return (
                <button
                  key={g}
                  id={`select-grade-${g}-btn`}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onSelectGrade(g);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white/95 text-indigo-700 shadow-lg scale-[1.03]'
                      : 'text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span>{meta.badge}</span>
                  <span className="text-[11px] opacity-90 hidden md:inline">
                    {meta.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 현재 학년 진행도 */}
          <div className="text-xs text-white/90 font-semibold flex items-center gap-2">
            <span className="text-white font-bold drop-shadow-2xs">{gradeInfo.title}</span>
            <span className="bg-white/25 backdrop-blur-md text-white border border-white/30 px-2.5 py-0.5 rounded-lg font-bold text-[11px] shadow-xs">
              {gradeSolvedCount} / {gradeTotalCount} 완료
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
