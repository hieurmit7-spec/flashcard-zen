import { useEffect, useMemo, useState } from "react";

export type MemoryFlashcard = {
  id: string;
  front: string;
  back: string;
};

type CardSide = "front" | "back";
type CompareStatus = "idle" | "match" | "mismatch";

type PlayCard = {
  playId: string;
  flashcardId: string;
  side: CardSide;
  content: string;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const toPlayCards = (flashcards: MemoryFlashcard[]): PlayCard[] =>
  shuffle(
    flashcards.flatMap((fc) => [
      { playId: `${fc.id}-f-${crypto.randomUUID()}`, flashcardId: fc.id, side: "front" as const, content: fc.front },
      { playId: `${fc.id}-b-${crypto.randomUUID()}`, flashcardId: fc.id, side: "back" as const, content: fc.back },
    ])
  );

export function MemoryMatchGame({ flashcards, onReplay, recordKey = "default" }: { flashcards: MemoryFlashcard[]; onReplay?: () => void; recordKey?: string }) {
  const [cards, setCards] = useState<PlayCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<PlayCard[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [mismatch, setMismatch] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [compareStatus, setCompareStatus] = useState<CompareStatus>("idle");
  const [flipCount, setFlipCount] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const bestScoreStorageKey = `memory-match-best-${recordKey}`;
  const resetGame = () => {
    setCards(toPlayCards(flashcards));
    setFlippedIds([]);
    setSelected([]);
    setMatched(new Set());
    setMismatch([]);
    setLocked(false);
    setCompareStatus("idle");
    setFlipCount(0);
  };

  const saveBestScore = (score: number) => {
    if (typeof window === "undefined") return;
    const next = bestScore == null || score < bestScore ? score : bestScore;
    setBestScore(next);
    window.localStorage.setItem(bestScoreStorageKey, String(next));
  };

  const loadBestScore = () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(bestScoreStorageKey);
    const parsed = raw ? Number(raw) : null;
    setBestScore(Number.isFinite(parsed) ? parsed : null);
  };

  useEffect(() => {
    loadBestScore();
  }, [bestScoreStorageKey]);

  useEffect(() => {
    if (matched.size > 0 && matched.size === flashcards.length) saveBestScore(flipCount);
  }, [matched.size, flashcards.length, flipCount]);

  useEffect(() => {
    resetGame();
  }, [flashcards]);

  const done = useMemo(() => matched.size > 0 && matched.size === flashcards.length, [matched, flashcards.length]);

  const isFaceUp = (c: PlayCard) => flippedIds.includes(c.playId) || matched.has(c.flashcardId);

  const onFlip = (card: PlayCard) => {
    if (locked || matched.has(card.flashcardId) || flippedIds.includes(card.playId)) return;

    setFlipCount((prev) => prev + 1);
    const next = [...selected, card];
    setSelected(next);
    setFlippedIds((p) => [...p, card.playId]);

    if (next.length !== 2) return;

    setLocked(true);
    const [a, b] = next;
    const ok = a.flashcardId === b.flashcardId;

    if (ok) {
      setCompareStatus("match");
      setTimeout(() => {
        setMatched((prev) => new Set(prev).add(a.flashcardId));
        setSelected([]);
        setCompareStatus("idle");
        setLocked(false);
      }, 220);
      return;
    }

    setCompareStatus("mismatch");
    setMismatch([a.playId, b.playId]);
    setTimeout(() => {
      setFlippedIds((prev) => prev.filter((id) => id !== a.playId && id !== b.playId));
      setMismatch([]);
      setSelected([]);
      setCompareStatus("idle");
      setLocked(false);
    }, 1000);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <p>Ghép đúng: <span className="font-semibold text-foreground">{matched.size}</span> / {flashcards.length}</p>
          <p>Lượt lật: <span className="font-semibold text-foreground">{flipCount}</span>{bestScore != null ? <> · Kỷ lục: <span className="font-semibold text-foreground">{bestScore}</span></> : null}</p>
        </div>
        <button onClick={() => { if (onReplay) { onReplay(); return; } resetGame(); }} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent">Chơi lại</button>
      </div>
      {done && <p className="mb-4 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">Hoàn thành!</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => {
          const faceUp = isFaceUp(card);
          const isMatched = matched.has(card.flashcardId);
          const isMismatch = mismatch.includes(card.playId) && compareStatus === "mismatch";

          return (
            <button key={card.playId} onClick={() => onFlip(card)} disabled={isMatched || locked} className="relative h-28 w-full [perspective:1000px] sm:h-32">
              <div className={`relative h-full w-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d] ${faceUp ? "[transform:rotateY(180deg)]" : ""}`}>
                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-border bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 [backface-visibility:hidden]">
                  <div className="h-10 w-10 rounded-full border border-white/40 bg-white/10" />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center rounded-xl border p-3 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] ${isMatched ? "border-green-500 bg-green-50 text-green-700" : isMismatch ? "border-red-500 bg-red-50" : "border-slate-200 bg-white"}`}>
                  <span className="line-clamp-3 text-base font-semibold sm:text-lg">{card.content}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
