export type ReviewRating = "again" | "hard" | "good" | "easy";

export type SM2State = {
  interval: number;
  easeFactor: number;
};

export type SM2Result = {
  interval: number;
  easeFactor: number;
  nextReviewDate: string;
};

const MIN_EASE_FACTOR = 1.3;

const toISODate = (date: Date) => date.toISOString().slice(0, 10);

export const calculateSm2 = (state: SM2State, rating: ReviewRating): SM2Result => {
  const qualityMap: Record<ReviewRating, number> = { again: 0, hard: 3, good: 4, easy: 5 };
  const q = qualityMap[rating];

  let interval = state.interval || 0;
  let easeFactor = state.easeFactor || 2.5;

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < MIN_EASE_FACTOR) easeFactor = MIN_EASE_FACTOR;

  if (q < 3) {
    interval = 1;
  } else if (interval <= 0) {
    interval = q === 5 ? 4 : 1;
  } else if (interval === 1) {
    interval = q === 5 ? 6 : 3;
  } else {
    const base = Math.max(1, Math.round(interval * easeFactor));
    if (rating === "hard") interval = Math.max(1, Math.round(base * 0.8));
    else if (rating === "easy") interval = Math.max(1, Math.round(base * 1.3));
    else interval = base;
  }

  const next = new Date();
  next.setDate(next.getDate() + interval);

  return {
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDate: toISODate(next),
  };
};