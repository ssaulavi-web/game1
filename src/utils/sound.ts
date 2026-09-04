// Web Audio API based sound synthesizer for elementary school quiz
// Completely self-contained, zero latency, no network assets required

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('quiz_sound_muted', muted ? 'true' : 'false');
  }
}

export function getInitialMuted(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('quiz_sound_muted') === 'true';
  }
  return false;
}

// 1. 정답 효과음 (밝고 경쾌한 실로폰/마림바 아르페지오 + 반짝임)
export function playCorrectSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // 따뜻하고 맑은 종소리 느낌
    osc.frequency.setValueAtTime(freq, now + idx * 0.07);

    // 하모닉 배음 추가로 풍성함
    gain.gain.setValueAtTime(0, now + idx * 0.07);
    gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.07 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.07);
    osc.stop(now + idx * 0.07 + 0.5);
  });
}

// 2. 오답 효과음 (아이들이 무서워하지 않는 귀여운 통통 만화 효과음)
export function playWrongSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);

  // 두 번째 살짝 튀는 보잉음
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(180, now + 0.18);
  osc2.frequency.exponentialRampToValueAtTime(110, now + 0.45);

  gain2.gain.setValueAtTime(0, now + 0.18);
  gain2.gain.linearRampToValueAtTime(0.18, now + 0.2);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc2.start(now + 0.18);
  osc2.stop(now + 0.45);
}

// 3. 힌트 열람 효과음 (마법의 반짝임 하프 소리)
export function playHintSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [659.25, 783.99, 987.77, 1174.66, 1567.98]; // E5, G5, B5, D6, G6

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);

    gain.gain.setValueAtTime(0, now + idx * 0.05);
    gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.05 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.05);
    osc.stop(now + idx * 0.05 + 0.4);
  });
}

// 4. 버튼 클릭/톡톡 사운드
export function playClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

// 5. 줌아웃 / 렌즈 이동 사운드
export function playZoomSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(250, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
}

// 6. 대성공 / 학년 클리어 팡파레
export function playVictorySound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const chordSeq = [
    { freqs: [523.25, 659.25, 783.99], time: 0, duration: 0.15 },
    { freqs: [523.25, 659.25, 783.99], time: 0.18, duration: 0.15 },
    { freqs: [523.25, 659.25, 783.99], time: 0.36, duration: 0.2 },
    { freqs: [698.46, 880.0, 1046.5], time: 0.6, duration: 0.3 },
    { freqs: [783.99, 987.77, 1174.66, 1567.98], time: 0.95, duration: 0.8 },
  ];

  const now = ctx.currentTime;
  chordSeq.forEach(({ freqs, time, duration }) => {
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.14, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration + 0.05);
    });
  });
}
