import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizItem } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, Award, BookOpen, Star } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface ResultModalProps {
  item: QuizItem;
  isOpen: boolean;
  onNext: () => void;
  onOpenStickers: () => void;
  isGradeCompleted: boolean;
  earnedPoints: number;
  streak: number;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  item,
  isOpen,
  onNext,
  onOpenStickers,
  isGradeCompleted,
  earnedPoints,
  streak,
}) => {
  useEffect(() => {
    if (isOpen) {
      // 신나는 폭죽 효과
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
      });

      if (isGradeCompleted) {
        setTimeout(() => {
          confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.4 },
          });
        }, 400);
      }
    }
  }, [isOpen, isGradeCompleted]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white/85 backdrop-blur-2xl rounded-[36px] p-6 sm:p-7 shadow-2xl border border-white/60 overflow-hidden flex flex-col gap-4 animate-scale-in">
        {/* 상단 축하 배너 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/90 text-white border border-emerald-300 px-3 py-1 rounded-full text-xs font-black mb-2 shadow-sm backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>정답입니다! 명탐정 추리 성공!</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Jua',sans-serif]">
            이 물건은 바로 &lsquo;<span className="text-indigo-600">{item.name}</span>&rsquo;!
          </h3>

          <div className="flex items-center justify-center gap-3 mt-1.5">
            <span className="text-xs font-bold text-slate-600">
              🏷️ {item.category}
            </span>
            <span className="text-xs font-extrabold text-indigo-700 bg-white/80 px-2.5 py-0.5 rounded-lg border border-white/80 shadow-2xs">
              +{earnedPoints}점 획득 {streak >= 2 ? `(🔥 ${streak}연속 콤보)` : ''}
            </span>
          </div>
        </div>

        {/* 전체 실물 사진 카드 */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-inner border border-white/60 bg-slate-900">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
            🔍 전체 모습 확인 완료
          </div>
        </div>

        {/* 초등학생 눈높이 재미있는 상식 박스 */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 text-left shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>이 물건의 신기한 비밀!</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {item.fact}
          </p>
        </div>

        {/* 학년 전체 완료 특별 메시지 */}
        {isGradeCompleted && (
          <div className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-white rounded-2xl p-3.5 text-center shadow-md border border-white/30">
            <p className="font-black text-base font-['Jua',sans-serif]">
              🎉 {item.grade}학년 돋보기 퀴즈를 모두 해결했습니다!
            </p>
            <p className="text-xs opacity-90 mt-0.5">
              다음 학년으로 넘어가 더 높은 난이도의 물건들에 도전해보세요!
            </p>
          </div>
        )}

        {/* 하단 액션 버튼 */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            id="modal-view-sticker-btn"
            type="button"
            onClick={() => {
              playClickSound();
              onOpenStickers();
            }}
            className="flex-1 py-3 px-3 bg-white/70 hover:bg-white text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-white/60 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>도감 확인</span>
          </button>

          <button
            id="modal-next-question-btn"
            type="button"
            onClick={() => {
              playClickSound();
              onNext();
            }}
            className="flex-2 py-3.5 px-4 bg-white/95 hover:bg-white text-indigo-700 font-black text-sm sm:text-base rounded-2xl shadow-lg border border-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>다음 문제로 GO!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
