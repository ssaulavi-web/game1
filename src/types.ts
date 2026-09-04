export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface QuizItem {
  id: number;
  grade: GradeLevel;
  name: string; // 정답 명칭
  aliases?: string[]; // 인정 유사어 (예: '휴대폰', '스마트폰', '핸드폰')
  category: string; // 카테고리 (학용품, 과일/음식, 생활용품, 악기, 과학도구 등)
  hintChosung: string; // 초성 힌트 (예: 'ㅇㅍ')
  hintUsage: string; // 용도 및 특징 힌트
  fact: string; // 정답 공개 시 초등학생 눈높이 재미있는 상식
  imageUrl: string; // 고화질 실물 이미지
  cropX: number; // 0~100 (확대 중심 X 좌표 %)
  cropY: number; // 0~100 (확대 중심 Y 좌표 %)
  zoomLevel: number; // 기본 확대 배율 (예: 2.5 ~ 5.0)
  options: string[]; // 4지선다 보기 (4개)
  syllables?: string[]; // 단어 조각 섞기용 음절 풀
}

export interface UserProgress {
  solvedIds: number[]; // 맞힌 문제 ID 목록
  score: number;
  streak: number;
  highestStreak: number;
  gradeProgress: Record<GradeLevel, { solved: number; total: number }>;
}

export interface GradeInfo {
  grade: GradeLevel;
  title: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}
