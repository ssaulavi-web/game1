import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Search, Sparkles, RefreshCw } from 'lucide-react';
import { playZoomSound, playClickSound } from '../utils/sound';

interface MagnifierViewProps {
  imageUrl: string;
  name: string;
  cropX: number;
  cropY: number;
  baseZoom: number;
  isRevealed: boolean;
  zoomedOutHint: boolean;
  onToggleZoomOutHint?: () => void;
}

export const MagnifierView: React.FC<MagnifierViewProps> = ({
  imageUrl,
  name,
  cropX,
  cropY,
  baseZoom,
  isRevealed,
  zoomedOutHint,
  onToggleZoomOutHint,
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // 문제나 이미지가 바뀔 때 로딩/에러 상태 즉시 초기화
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setOffset({ x: 0, y: 0 });
  }, [imageUrl, retryKey]);

  // 브라우저 캐시에 이미 로드되어 있는 경우 즉각 감지
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      setHasError(false);
    }
  }, [imageUrl, retryKey]);

  // 줌 레벨 계산: 정답 공개 시 1x, 힌트 사용 시 40% 축소, 기본 줌
  const currentZoom = isRevealed
    ? 1
    : zoomedOutHint
    ? Math.max(1.35, baseZoom * 0.6)
    : baseZoom;

  const currentOriginX = isRevealed ? 50 : Math.min(92, Math.max(8, cropX + offset.x));
  const currentOriginY = isRevealed ? 50 : Math.min(92, Math.max(8, cropY + offset.y));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isRevealed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 ~ +0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    // 마우스로 최대 ±8% 범위 살짝 엿보기
    setOffset({ x: relX * 12, y: relY * 12 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const handleZoomToggle = () => {
    playZoomSound();
    if (onToggleZoomOutHint) {
      onToggleZoomOutHint();
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 돋보기 프레임 외곽 (프로스티드 글래스) */}
      <div className="relative w-full max-w-md aspect-square sm:aspect-[4/3] rounded-[36px] p-3 sm:p-3.5 bg-white/30 backdrop-blur-2xl shadow-2xl border border-white/50">
        {/* 렌즈 원형/둥근 뷰포트 */}
        <div
          id="magnifier-viewport"
          className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950/85 cursor-crosshair shadow-inner border-2 border-white/40"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* 로딩 인디케이터 */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-sky-200 z-10 backdrop-blur-sm">
              <Search className="w-10 h-10 animate-bounce mb-2 text-sky-400" />
              <p className="text-sm font-semibold tracking-wide">실물 사진 탐색 중...</p>
            </div>
          )}

          {/* 이미지 로드 실패 시 안내 및 다시 시도 */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 text-sky-100 p-6 text-center backdrop-blur-md z-10">
              <p className="text-base font-bold mb-1">🖼️ 사진 연결 대기 중</p>
              <p className="text-xs text-slate-300 mb-3">네트워크 상태를 확인하고 아래 버튼을 눌러보세요.</p>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setHasError(false);
                  setIsLoaded(false);
                  setRetryKey((k) => k + 1);
                }}
                className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>사진 다시 불러오기</span>
              </button>
            </div>
          )}

          <img
            ref={imgRef}
            key={`${imageUrl}-${retryKey}`}
            src={retryKey > 0 ? `${imageUrl}&retry=${retryKey}` : imageUrl}
            alt={isRevealed ? name : '추리 퀴즈 사진'}
            onLoad={() => {
              setIsLoaded(true);
              setHasError(false);
            }}
            onError={() => {
              setHasError(true);
              setIsLoaded(false);
            }}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              !isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              transform: `scale(${currentZoom})`,
              transformOrigin: `${currentOriginX}% ${currentOriginY}%`,
            }}
            referrerPolicy="no-referrer"
          />

          {/* 돋보기 렌즈 반사광 효과 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30" />

          {/* 미공개 상태일 때 렌즈 십자선 & 돋보기 배지 */}
          {!isRevealed && (
            <>
              {/* 조준 십자선 */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/60" />
                <div className="absolute w-12 h-[1px] bg-white/60" />
                <div className="absolute h-12 w-[1px] bg-white/60" />
              </div>

              {/* 확대 배율 뱃지 */}
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white border border-white/30 text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-sky-300" />
                <span>{currentZoom.toFixed(1)}x 정밀 확대</span>
              </div>

              {/* 마우스 안내 */}
              <div className="hidden sm:block absolute bottom-3 left-3 bg-black/40 backdrop-blur-md text-white/90 text-[11px] px-2.5 py-1 rounded-lg border border-white/20">
                🖱️ 사진 위를 움직이면 주변을 살짝 엿볼 수 있어요!
              </div>
            </>
          )}

          {/* 정답 공개 시 반짝이 오버레이 */}
          {isRevealed && (
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-600/85 backdrop-blur-md border border-emerald-300/60 text-white px-4 py-2 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
                <span className="font-bold text-white text-base">전체 모습 공개!</span>
              </div>
              <span className="text-xs bg-emerald-800/80 text-emerald-100 px-2 py-0.5 rounded-md font-semibold border border-emerald-400/40">1.0x 전체 사진</span>
            </div>
          )}
        </div>
      </div>

      {/* 줌아웃 힌트 버튼 (정답 미공개 시) */}
      {!isRevealed && onToggleZoomOutHint && (
        <div className="mt-3 flex items-center gap-2">
          <button
            id="zoom-out-hint-btn"
            type="button"
            onClick={handleZoomToggle}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md backdrop-blur-md ${
              zoomedOutHint
                ? 'bg-white/95 text-indigo-700 shadow-lg ring-2 ring-white/60'
                : 'bg-white/25 hover:bg-white/40 text-white border border-white/40'
            }`}
          >
            {zoomedOutHint ? (
              <>
                <ZoomIn className="w-4 h-4 text-indigo-700" />
                <span>원래 배율로 다시 확대하기</span>
              </>
            ) : (
              <>
                <ZoomOut className="w-4 h-4 text-white" />
                <span>조금 더 멀리서 보기 (힌트 -35%)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
