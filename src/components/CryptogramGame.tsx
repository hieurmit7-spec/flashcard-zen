import { useEffect, useMemo, useState } from "react";
import { createNumberWordPuzzle, type DeckWord } from "@/lib/cryptogram";

type PuzzleCell =
  | { type: "letter"; number: number; letter: string; letterIndex: number }
  | { type: "space" }
  | { type: "dot" };

export function CryptogramGame({ words, onReplay }: { words: DeckWord[]; onReplay?: () => void }) {
  const [seed, setSeed] = useState(0);
  const [answer, setAnswer] = useState("");
  const [wrongIndices, setWrongIndices] = useState<Record<number, boolean>>({});
  const [isCorrect, setIsCorrect] = useState(false);
  const [prefilledIndices, setPrefilledIndices] = useState<Record<number, boolean>>({});

  const puzzle = useMemo(() => createNumberWordPuzzle(words), [words, seed]);

  const sentenceWithoutDot = useMemo(() => puzzle.targetSentence.replace(/\.$/, ""), [puzzle.targetSentence]);

  const letters = useMemo(() => sentenceWithoutDot.split(""), [sentenceWithoutDot]);

  const cells = useMemo<PuzzleCell[]>(() => {
    let letterIndex = 0;
    return sentenceWithoutDot.split("").map((ch) => {
      if (ch === " ") return { type: "space" };
      if (ch === ".") return { type: "dot" };
      const cell: PuzzleCell = {
        type: "letter",
        number: puzzle.numberByLetter[ch],
        letter: ch,
        letterIndex,
      };
      letterIndex += 1;
      return cell;
    });
  }, [sentenceWithoutDot, puzzle.numberByLetter]);

  const letterCount = useMemo(() => letters.filter((c) => /[A-Z]/.test(c)).length, [letters]);

  const answerChars = useMemo(() => answer.padEnd(letterCount, " ").slice(0, letterCount).split(""), [answer, letterCount]);

  const availableLetters = useMemo(() => Array.from(new Set(letters.filter((c) => /[A-Z]/.test(c)))).sort(), [letters]);


  const keyboardRows = useMemo(() => {
    const rowSizes = [8, 8, 10];
    const out: string[][] = [];
    let index = 0;
    for (const size of rowSizes) {
      out.push(availableLetters.slice(index, index + size));
      index += size;
      if (index >= availableLetters.length) break;
    }
    return out.filter((row) => row.length > 0);
  }, [availableLetters]);

  const hintRemaining = useMemo(() => {
    let count = 0;
    let letterIndex = 0;
    for (const ch of sentenceWithoutDot) {
      if (!/[A-Z]/.test(ch)) continue;
      if ((answerChars[letterIndex] ?? "") !== ch) count++;
      letterIndex++;
    }
    return count;
  }, [sentenceWithoutDot, answerChars]);

  useEffect(() => {
    const allLetterIndices = Array.from({ length: letterCount }, (_, i) => i);
    const shuffled = [...allLetterIndices].sort(() => Math.random() - 0.5);
    const revealCount = Math.max(3, Math.min(6, Math.floor(letterCount * 0.25)));
    const selected = shuffled.slice(0, Math.min(revealCount, letterCount));

    const prefillMap: Record<number, boolean> = {};
    const chars = Array.from({ length: letterCount }, () => " ");

    let letterIdx = 0;
    for (const ch of sentenceWithoutDot) {
      if (!/[A-Z]/.test(ch)) continue;
      if (selected.includes(letterIdx)) {
        chars[letterIdx] = ch;
        prefillMap[letterIdx] = true;
      }
      letterIdx++;
    }

    setAnswer(chars.join(""));
    setPrefilledIndices(prefillMap);
    setWrongIndices({});
    setIsCorrect(false);
  }, [puzzle.targetSentence, sentenceWithoutDot, letterCount]);

  const setCharAt = (idx: number, value: string) => {
    if (isCorrect || prefilledIndices[idx]) return;
    const char = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1);
    const next = [...answerChars];
    next[idx] = char || " ";
    setAnswer(next.join(""));
    setWrongIndices((prev) => {
      const updated = { ...prev };
      delete updated[idx];
      return updated;
    });
  };

  const clearCurrent = () => {
    if (isCorrect) return;
    const next = [...answerChars];
    for (let i = 0; i < next.length; i++) {
      if (!prefilledIndices[i]) next[i] = " ";
    }
    setAnswer(next.join(""));
    setWrongIndices({});
  };

  const fillLetter = (letter: string) => {
    if (isCorrect) return;
    const next = [...answerChars];
    const insertAt = next.findIndex((c, i) => c === " " && !prefilledIndices[i]);
    if (insertAt === -1) return;
    next[insertAt] = letter;
    setAnswer(next.join(""));
  };

  const revealOneCell = () => {
    if (isCorrect) return;
    const wrong: number[] = [];
    let letterIdx = 0;
    for (const ch of sentenceWithoutDot) {
      if (!/[A-Z]/.test(ch)) continue;
      if ((answerChars[letterIdx] ?? "") !== ch) wrong.push(letterIdx);
      letterIdx++;
    }
    if (wrong.length === 0) return;
    const picked = wrong[Math.floor(Math.random() * wrong.length)];

    let expected = "";
    let cursor = 0;
    for (const ch of sentenceWithoutDot) {
      if (!/[A-Z]/.test(ch)) continue;
      if (cursor === picked) {
        expected = ch;
        break;
      }
      cursor++;
    }

    if (!expected) return;
    const next = [...answerChars];
    next[picked] = expected;
    setAnswer(next.join(""));
    setWrongIndices((prev) => {
      const updated = { ...prev };
      delete updated[picked];
      return updated;
    });
  };

  const checkAnswer = () => {
    let letterIdx = 0;
    const wrong: Record<number, boolean> = {};
    for (const ch of sentenceWithoutDot) {
      if (!/[A-Z]/.test(ch)) continue;
      if ((answerChars[letterIdx] ?? "") !== ch) wrong[letterIdx] = true;
      letterIdx++;
    }
    setWrongIndices(wrong);
    const ok = Object.keys(wrong).length === 0;
    setIsCorrect(ok);
  };

  const replay = () => {
    setAnswer("");
    setWrongIndices({});
    setIsCorrect(false);
    setPrefilledIndices({});
    setSeed((x) => x + 1);
    onReplay?.();
  };

  const decodedPreview = useMemo(() => {
    let letterIdx = 0;
    return sentenceWithoutDot
      .split("")
      .map((ch) => {
        if (!/[A-Z]/.test(ch)) return ch;
        const guess = answerChars[letterIdx] ?? " ";
        letterIdx++;
        return guess === " " ? "_" : guess;
      })
      .join("");
  }, [sentenceWithoutDot, answerChars]);

  const sentenceNumbers = useMemo(
    () =>
      cells
        .map((cell) => {
          if (cell.type === "space") return "   ";
          if (cell.type === "dot") return ".";
          return `${cell.number}`;
        })
        .join(" "),
    [cells],
  );

  return (
    <div className="rounded-3xl border border-border bg-gradient-to-b from-card to-accent/10 p-5 shadow-sm md:p-6">
      <div className="rounded-xl border border-border bg-accent/20 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Hint</p>
        <p className="mt-2 text-sm text-foreground">{puzzle.hint}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card/70 p-3">
        <p className="text-xs text-muted-foreground">Dãy số câu đố: {sentenceNumbers}</p>
        <p className="mt-1 text-sm font-medium text-foreground">Đáp án đang điền: {decodedPreview}{isCorrect ? "." : ""}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-background/90 p-3">
        <div className="mt-2 flex flex-wrap items-end gap-2">
          {cells.map((cell, idx) => {
            if (cell.type === "space") {
              return <div key={`space-${idx}`} className="h-12 w-4" />;
            }
            if (cell.type === "dot") {
              return (
                <div key={`dot-${idx}`} className="h-12 w-6 text-center text-2xl font-bold leading-[48px] text-foreground">
                  .
                </div>
              );
            }

            const char = answerChars[cell.letterIndex] === " " ? "" : answerChars[cell.letterIndex];
            const isWrongCell = !!wrongIndices[cell.letterIndex];

            return (
              <div key={`input-${idx}`} className="flex flex-col items-center gap-1">
                <input
                  value={char}
                  maxLength={1}
                  onChange={(e) => setCharAt(cell.letterIndex, e.target.value)}
                  className={`h-12 w-10 rounded-lg border-2 bg-background text-center text-xl font-bold uppercase outline-none transition ${
                    isWrongCell ? "border-red-500 text-red-600" : "border-border text-foreground"
                  } ${isCorrect ? "opacity-70" : ""} ${prefilledIndices[cell.letterIndex] ? "bg-emerald-50 border-emerald-300 text-emerald-700" : ""}`}
                  disabled={isCorrect || !!prefilledIndices[cell.letterIndex]}
                />
                <span className="text-[11px] text-muted-foreground">{cell.number}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card/80 p-3">
        {keyboardRows.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex justify-center gap-1.5">
            {row.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => fillLetter(letter)}
                disabled={isCorrect}
                className="h-10 min-w-9 rounded-lg border border-border bg-background px-2.5 text-sm font-semibold text-foreground transition active:scale-95 disabled:opacity-50"
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={clearCurrent} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent" disabled={isCorrect}>
          Xóa đáp án
        </button>
        <button onClick={checkAnswer} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent" disabled={isCorrect}>
          Kiểm tra
        </button>
        <button onClick={revealOneCell} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent" disabled={isCorrect || hintRemaining === 0}>
          Gợi ý 1 ô ({hintRemaining})
        </button>
        <button onClick={replay} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">
          Tạo câu mới
        </button>
        <span className={`text-sm ${isCorrect ? "text-green-600" : "text-muted-foreground"}`}>{isCorrect ? "Chính xác!" : "Giải mã câu"}</span>
      </div>

      {!isCorrect && Object.keys(wrongIndices).length > 0 && <p className="mt-2 text-sm text-red-600">Có ô sai (màu đỏ), bạn sửa lại rồi bấm Kiểm tra.</p>}
    </div>
  );
}
