export type DeckWord = {
  word: string;
  meaning: string;
};

export type NumberWordPuzzleToken =
  | { type: "letter"; char: string; number: number }
  | { type: "separator"; char: string };

export type NumberWordPuzzle = {
  targetSentence: string;
  hint: string;
  numberByLetter: Record<string, number>;
  puzzleTokens: NumberWordPuzzleToken[];
  usedNumbers: number[];
};

export type CryptogramPuzzle = {
  plainSentence: string;
  cipherSentence: string;
  mapping: Record<string, string>;
  usedWords: DeckWord[];
};
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_POOL = Array.from({ length: 26 }, (_, i) => i + 1);

const shuffle = <T,>(arr: T[]): T[] => {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const uniqueByWord = (words: DeckWord[]) => {
  const seen = new Set<string>();
  const out: DeckWord[] = [];
  for (const w of words) {
    const key = w.word.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ word: w.word.trim(), meaning: w.meaning.trim() });
  }
  return out;
};

const pickWords = (words: DeckWord[]): DeckWord[] => {
  const clean = uniqueByWord(words).filter((w) => /^[a-zA-Z ]+$/.test(w.word));
  const sorted = clean.sort((a, b) => a.word.length - b.word.length);
  const count = Math.min(3, sorted.length);
  return shuffle(sorted).slice(0, count);
};

const buildSentence = (picked: DeckWord[]) => {
  const lower = picked.map((w) => w.word.toLowerCase());
  if (lower.length >= 3) return `${lower[0]} ${lower[1]} ${lower[2]}.`;
  if (lower.length === 2) return `${lower[0]} ${lower[1]}.`;
  return `${lower[0] ?? "word"}.`;
};

const buildSimpleNumberSentence = (focusWord: string) => {
  const templates = [
    `I SEE ${focusWord}.`,
    `WE LEARN ${focusWord}.`,
    `THE ${focusWord} IS NICE.`,
    `THIS ${focusWord} IS GOOD.`,
    `I USE ${focusWord} TODAY.`,
    `WE LIKE ${focusWord} A LOT.`,
    `A ${focusWord} CAN HELP.`,
    `MY ${focusWord} IS READY.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)] ?? `I SEE ${focusWord}.`;
};

export const decodeWithGuesses = (cipherSentence: string, guesses: Record<string, string>) =>
  cipherSentence
    .split("")
    .map((ch) => {
      const up = ch.toUpperCase();
      if (!(up in guesses) || !guesses[up]) return "_";
      const guessed = guesses[up].toLowerCase();
      return ch === ch.toUpperCase() ? guessed.toUpperCase() : guessed;
    })
    .map((ch, i) => (/[a-zA-Z]/.test(cipherSentence[i]) ? ch : cipherSentence[i]))
    .join("");

export const isSolvedByGuesses = (plainSentence: string, mapping: Record<string, string>, guesses: Record<string, string>) => {
  const expected = Object.fromEntries(Object.entries(mapping).map(([plain, cipher]) => [cipher, plain]));
  const letters = new Set(plainSentence.toUpperCase().split("").filter((c) => /[A-Z]/.test(c)));
  for (const cipherChar of letters) {
    const g = guesses[cipherChar]?.toUpperCase();
    if (!g || g !== expected[cipherChar]) return false;
  }
  return true;
};

export const getCipherAlphabet = (cipherSentence: string) =>
  Array.from(new Set(cipherSentence.toUpperCase().split("").filter((c) => /[A-Z]/.test(c)))).sort();

export const getExpectedPlainFromCipher = (mapping: Record<string, string>) =>
  Object.fromEntries(Object.entries(mapping).map(([plain, cipher]) => [cipher, plain]));

const createSubstitution = () => {
  const plain = LETTERS.split("");
  let cipher = shuffle(plain);
  while (cipher.some((c, i) => c === plain[i])) cipher = shuffle(plain);
  return Object.fromEntries(plain.map((p, i) => [p, cipher[i]]));
};

const encode = (text: string, mapping: Record<string, string>) =>
  text
    .split("")
    .map((ch) => {
      const up = ch.toUpperCase();
      if (!(up in mapping)) return ch;
      const mapped = mapping[up];
      return ch === ch.toLowerCase() ? mapped.toLowerCase() : mapped;
    })
    .join("");

export const createCryptogramPuzzle = (words: DeckWord[]): CryptogramPuzzle => {
  const usedWords = pickWords(words);
  const plainSentence = buildSentence(usedWords);
  const mapping = createSubstitution();
  const cipherSentence = encode(plainSentence, mapping);
  return { plainSentence, cipherSentence, mapping, usedWords };
};

export const createNumberWordPuzzle = (words: DeckWord[]): NumberWordPuzzle => {
  const pickedWords = pickWords(words);
  const picked = pickedWords[0];
  const focusWord = (picked?.word ?? "TRADE").trim().toUpperCase();
  const targetSentence = buildSimpleNumberSentence(focusWord);
  const hint = picked?.meaning ?? "Decode the English sentence.";

  const uniqueLetters = Array.from(new Set(targetSentence.split("").filter((ch) => /[A-Z]/.test(ch))));
  const shuffledNumbers = shuffle(NUMBER_POOL);

  const numberByLetter: Record<string, number> = {};
  uniqueLetters.forEach((letter, idx) => {
    numberByLetter[letter] = shuffledNumbers[idx];
  });

  const puzzleTokens: NumberWordPuzzleToken[] = targetSentence.split("").map((char) => {
    if (!/[A-Z]/.test(char)) return { type: "separator", char };
    return { type: "letter", char, number: numberByLetter[char] };
  });

  const usedNumbers = Array.from(new Set(puzzleTokens.filter((token) => token.type === "letter").map((token) => token.number))).sort((a, b) => a - b);

  return {
    targetSentence,
    hint,
    numberByLetter,
    puzzleTokens,
    usedNumbers,
  };
};

