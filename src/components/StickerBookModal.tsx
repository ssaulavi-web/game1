import React, { useState } from 'react';
import { ALL_QUIZ_QUESTIONS, GRADE_METADATA } from '../data/quizData';
import { GradeLevel, QuizItem } from '../types';
import { X, Lock, CheckCircle2, Search, Sparkles, Filter } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface StickerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  solvedIds: number[];
  onSelectQuizToPlay: (item: QuizItem) => void;
}

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  onClose,
  solvedIds,
  onSelectQuizToPlay,
}) => {
  const [activeGradeFilter, setActiveGradeFilter] = useState<number>(0); // 0: 전체
  const [onlySolved, setOnlySolved] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<QuizItem | null>(null);

  if (!isOpen) return null;

  const filteredItems = ALL_QUIZ_QUESTIONS.filter((item) => {
    if (activeGradeFilter !== 0 && item.grade !== activeGradeFilter) {
      return false;
    }
    if (onlySolved && !solvedIds.includes(item.id)) {
      return false;
    }
    return true;
  });

  const solvedCount = solvedIds.length;
  const totalCount = ALL_QUIZ_QUESTIONS.length;
  const percent = Math.round((solvedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white/90 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-white/60 flex flex-col overflow-hidden animate-scale-in">
        {/* 모달 상단 헤더 */}
        <div className="p-4 sm:p-5 border-b border-white/40 bg-white/40 backdrop-blur-md flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/70 text-indigo-700 flex items-center justify-center font-black text-xl shadow-md border border-white/80 backdrop-blur-sm">
              📖
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Jua',sans-serif]">
                100개 물건 스티커 도감
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                정답을 맞힌 물건들의 스티커를 모아 도감을 완성해보세요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-amber-400/90 backdrop-blur-md text-slate-900 border border-amber-200 px-3.5 py-1 rounded-2xl text-xs font-black shadow-xs">
              {solvedCount} / {totalCount} 수집 ({percent}%)
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/60 hover:bg-white text-slate-600 transition-colors border border-white/60 shadow-2xs"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 진행도 게이지 바 */}
        <div className="w-full bg-black/10 h-2">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* 필터 탭 바 */}
        <div className="px-4 py-2.5 bg-white/30 backdrop-blur-md border-b border-white/30 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveGradeFilter(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shadow-2xs ${
                activeGradeFilter === 0
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/60 text-slate-700 hover:bg-white border border-white/50'
              }`}
            >
              전체 (100)
            </button>
            {([1, 2, 3, 4, 5, 6] as GradeLevel[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveGradeFilter(g);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap shadow-2xs ${
                  activeGradeFilter === g
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/60 text-slate-700 hover:bg-white border border-white/50'
                }`}
              >
                {GRADE_METADATA[g].badge}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlySolved}
              onChange={(e) => {
                playClickSound();
                setOnlySolved(e.target.checked);
              }}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>수집 완료된 물건만 보기</span>
          </label>
        </div>

        {/* 100개 스티커 그리드 영역 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredItems.map((item) => {
              const isSolved = solvedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playClickSound();
                    if (isSolved) {
                      setPreviewItem(item);
                    } else {
                      onSelectQuizToPlay(item);
                      onClose();
                    }
                  }}
                  className={`group relative rounded-2xl p-2.5 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden text-left shadow-xs ${
                    isSolved
                      ? 'bg-white/70 hover:bg-white backdrop-blur-md border-white/80 hover:shadow-md hover:-translate-y-0.5'
                      : 'bg-white/30 border-dashed border-white/50 hover:bg-white/45 opacity-80'
                  }`}
                >
                  {/* 스티커 썸네일 */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 mb-2">
                    {isSolved ? (
                      <>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white p-1 rounded-full shadow">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/10 text-slate-500">
                        <Lock className="w-6 h-6 mb-1 opacity-60" />
                        <span className="text-[10px] font-bold">미발견 #{item.id}</span>
                      </div>
                    )}

                    <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20">
                      {item.grade}학년
                    </div>
                  </div>

                  {/* 스티커 정보 */}
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {isSolved ? item.name : `? ${item.category}`}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {isSolved ? item.category : '퀴즈를 풀어 밝혀내세요'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">해당하는 스티커가 없습니다.</p>
              <p className="text-xs mt-1">필터를 변경하거나 퀴즈를 풀어보세요!</p>
            </div>
          )}
        </div>

        {/* 선택한 스티커 상세 미리보기 팝업 (열람 시) */}
        {previewItem && (
          <div className="absolute inset-0 z-20 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] p-5 max-w-sm w-full shadow-2xl border border-white animate-scale-in">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-slate-200">
                <img
                  src={previewItem.imageUrl}
                  alt={previewItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xl font-black text-slate-900 font-['Jua',sans-serif]">
                  {previewItem.name}
                </h4>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  {previewItem.grade}학년 {previewItem.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-slate-200 mt-2 leading-relaxed">
                💡 {previewItem.fact}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onSelectQuizToPlay(previewItem);
                    setPreviewItem(null);
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors"
                >
                  이 문제 다시 풀기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setPreviewItem(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
