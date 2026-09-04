import { GradeInfo, GradeLevel, QuizItem } from '../types';
import { grade1Questions } from './grade1';
import { grade2Questions } from './grade2';
import { grade3Questions } from './grade3';
import { grade4Questions } from './grade4';
import { grade5Questions } from './grade5';
import { grade6Questions } from './grade6';

export const ALL_QUIZ_QUESTIONS: QuizItem[] = [
  ...grade1Questions,
  ...grade2Questions,
  ...grade3Questions,
  ...grade4Questions,
  ...grade5Questions,
  ...grade6Questions,
];

export const GRADE_METADATA: Record<GradeLevel, GradeInfo> = {
  1: {
    grade: 1,
    title: '새싹 탐정',
    badge: '🌱 1학년',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    borderColor: 'border-emerald-400',
    description: '교실과 방 안에서 매일 만나는 가장 친숙한 학용품과 과일들!',
  },
  2: {
    grade: 2,
    title: '호기심 탐정',
    badge: '🔍 2학년',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50 border-sky-300 text-sky-800',
    borderColor: 'border-sky-400',
    description: '즐거운 놀이기구와 악기, 일상 속 재미있는 물건들의 부분 탐색!',
  },
  3: {
    grade: 3,
    title: '주니어 탐정',
    badge: '⭐ 3학년',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-300 text-amber-800',
    borderColor: 'border-amber-400',
    description: '체육 스포츠 용품, 주방 도구, 호기심 가득한 기초 과학 탐구!',
  },
  4: {
    grade: 4,
    title: '베테랑 탐정',
    badge: '🏆 4학년',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-300 text-indigo-800',
    borderColor: 'border-indigo-400',
    description: '천체 망원경, 각도기, 정밀한 디지털 기기와 야외 탐사 장비!',
  },
  5: {
    grade: 5,
    title: '특급 탐정',
    badge: '🎖️ 5학년',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-300 text-purple-800',
    borderColor: 'border-purple-400',
    description: '재봉틀, 기차 바퀴, 시계 태엽 등 기계 장치와 과학적 원리 추리!',
  },
  6: {
    grade: 6,
    title: '명탐정 마스터',
    badge: '👑 6학년',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-300 text-rose-800',
    borderColor: 'border-rose-400',
    description: '반도체 마이크로칩, 조리개, 제트엔진, 우주 인공위성 최상위 도전!',
  },
};

export function getQuestionsByGrade(grade: GradeLevel): QuizItem[] {
  return ALL_QUIZ_QUESTIONS.filter((q) => q.grade === grade);
}

export function getQuestionById(id: number): QuizItem | undefined {
  return ALL_QUIZ_QUESTIONS.find((q) => q.id === id);
}

export function getTotalQuestionCount(): number {
  return ALL_QUIZ_QUESTIONS.length;
}
