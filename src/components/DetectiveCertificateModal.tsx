import React, { useState } from 'react';
import { GradeLevel } from '../types';
import { GRADE_METADATA } from '../data/quizData';
import { X, Award, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface DetectiveCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGrade: GradeLevel;
  solvedCount: number;
  totalCount: number;
  score: number;
  highestStreak: number;
}

export const DetectiveCertificateModal: React.FC<DetectiveCertificateModalProps> = ({
  isOpen,
  onClose,
  currentGrade,
  solvedCount,
  totalCount,
  score,
  highestStreak,
}) => {
  const [studentName, setStudentName] = useState('어린이 탐정');
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const currentGradeMeta = GRADE_METADATA[currentGrade];
  const isMaster = solvedCount >= 100;

  const detectiveTitle = isMaster
    ? '전설의 대명탐정 마스터'
    : `${currentGrade}학년 ${currentGradeMeta.title}`;

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-white/60 overflow-hidden flex flex-col animate-scale-in">
        {/* 상단 닫기 바 */}
        <div className="p-3.5 bg-white/40 backdrop-blur-md flex items-center justify-between border-b border-white/30">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>초등 명탐정 자격증</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/60 hover:bg-white text-slate-600 transition-colors border border-white/60 shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 인쇄 대상 상장 프레임 */}
        <div className="p-6 sm:p-8 bg-white/75 backdrop-blur-md text-center relative border-4 border-indigo-200/80 m-4 rounded-[28px] shadow-inner">
          {/* 장식 코너 */}
          <div className="absolute top-2 left-2 text-indigo-400 text-lg">✦</div>
          <div className="absolute top-2 right-2 text-indigo-400 text-lg">✦</div>
          <div className="absolute bottom-2 left-2 text-indigo-400 text-lg">✦</div>
          <div className="absolute bottom-2 right-2 text-indigo-400 text-lg">✦</div>

          <div className="inline-block bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-full mb-3 shadow-2xs">
            제 2026-{solvedCount.toString().padStart(3, '0')}호
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Jua',sans-serif] tracking-wider mb-2">
            명 탐 정 임 명 장
          </h3>
          <p className="text-xs text-indigo-600 font-bold tracking-widest mb-6">
            DETECTIVE CERTIFICATE OF EXCELLENCE
          </p>

          {/* 학생 이름 입력 */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 border-b-2 border-indigo-400 pb-1 px-3">
              <span className="text-xs text-slate-500 font-bold">성명 :</span>
              {isEditing ? (
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  maxLength={10}
                  className="text-lg font-black text-slate-900 text-center bg-white/90 rounded px-2 py-0.5 outline-none border border-indigo-300 font-['Jua',sans-serif]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xl font-black text-slate-900 hover:text-indigo-700 font-['Jua',sans-serif] flex items-center gap-1"
                  title="클릭하여 이름 수정"
                >
                  <span>{studentName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">✏️</span>
                </button>
              )}
            </div>
          </div>

          {/* 직위 배지 */}
          <div className="my-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-white px-5 py-2.5 rounded-2xl shadow-md font-['Jua',sans-serif] text-base sm:text-lg border border-white/30">
              <Sparkles className="w-5 h-5 text-yellow-200" />
              <span>칭호 : {detectiveTitle}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-md mx-auto my-4">
            위 어린이는 &lsquo;이 물건의 정체는?&rsquo; 돋보기 추리 퀴즈에서 뛰어난
            관찰력과 날카로운 직관으로 사물의 비밀을 밝혀내었기에{' '}
            <strong className="text-indigo-700 font-black">{currentGrade}학년 우수 탐정</strong>으로
            임명합니다.
          </p>

          {/* 탐정 활약 기록 */}
          <div className="grid grid-cols-3 gap-2 bg-white/70 backdrop-blur-sm rounded-2xl p-3 max-w-sm mx-auto my-4 text-center border border-white/80 shadow-xs">
            <div>
              <p className="text-[10px] text-slate-500 font-bold">해결한 물건</p>
              <p className="text-base font-black text-indigo-900">{solvedCount} / {totalCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold">총 탐정 점수</p>
              <p className="text-base font-black text-indigo-900">{score.toLocaleString()}P</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold">최고 연속 콤보</p>
              <p className="text-base font-black text-indigo-900">{highestStreak}회</p>
            </div>
          </div>

          {/* 날짜 및 직인 */}
          <div className="mt-6 flex items-center justify-between px-4 sm:px-8 text-xs text-slate-600 font-bold">
            <span>{today}</span>
            <div className="flex items-center gap-2">
              <span className="font-['Jua',sans-serif] text-slate-800 text-sm">
                돋보기 탐정단장
              </span>
              <div className="w-11 h-11 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-[10px] border-2 border-rose-700 shadow-sm leading-tight p-1 rotate-6">
                <span>탐정<br />직인</span>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/30 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white/70 hover:bg-white text-slate-800 border border-white/70 font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>자격증 인쇄/저장</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
