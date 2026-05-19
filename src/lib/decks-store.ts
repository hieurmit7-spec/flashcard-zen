export type Card = {
  id: string;
  front: string;
  back: string;
  tags: string[];
  state: "new" | "learning" | "review";
  due: boolean;
};

export type Deck = {
  id: string;
  name: string;
  description: string;
  cards: Card[];
};

const uid = () => Math.random().toString(36).slice(2, 10);

const seed: Deck[] = [
  {
    id: "deck-1",
    name: "Tiếng Anh giao tiếp",
    description: "Từ vựng và cụm từ thông dụng hàng ngày",
    cards: [
      { id: uid(), front: "Ephemeral", back: "(adj) Tồn tại trong thời gian rất ngắn; phù du", tags: ["adj", "B2"], state: "review", due: true },
      { id: uid(), front: "Serendipity", back: "(n) Sự may mắn tình cờ khám phá ra điều thú vị", tags: ["n", "C1"], state: "review", due: true },
      { id: uid(), front: "To procrastinate", back: "(v) Trì hoãn, lần lữa công việc", tags: ["v"], state: "learning", due: true },
      { id: uid(), front: "Resilient", back: "(adj) Kiên cường, có khả năng phục hồi nhanh", tags: ["adj"], state: "learning", due: false },
      { id: uid(), front: "Ubiquitous", back: "(adj) Có mặt khắp nơi, phổ biến rộng rãi", tags: ["adj", "C1"], state: "new", due: false },
    ],
  },
  {
    id: "deck-2",
    name: "Thủ đô các nước",
    description: "Geography essentials",
    cards: [
      { id: uid(), front: "Thủ đô của Úc?", back: "Canberra (không phải Sydney)", tags: ["geo"], state: "review", due: true },
      { id: uid(), front: "Thủ đô của Canada?", back: "Ottawa", tags: ["geo"], state: "learning", due: true },
      { id: uid(), front: "Thủ đô của Brazil?", back: "Brasília", tags: ["geo"], state: "new", due: false },
    ],
  },
  {
    id: "deck-3",
    name: "Công thức Toán cơ bản",
    description: "Đại số, hình học và xác suất",
    cards: [
      { id: uid(), front: "Định lý Pythagoras", back: "a² + b² = c² (trong tam giác vuông)", tags: ["geometry"], state: "review", due: true },
      { id: uid(), front: "Diện tích hình tròn", back: "S = π × r²", tags: ["geometry"], state: "learning", due: false },
    ],
  },
];

let decks: Deck[] = seed;
const listeners = new Set<() => void>();

export const decksStore = {
  get: () => decks,
  getDeck: (id: string) => decks.find((d) => d.id === id),
  addCard: (deckId: string, front: string, back: string, tags: string[]) => {
    decks = decks.map((d) =>
      d.id === deckId
        ? { ...d, cards: [...d.cards, { id: uid(), front, back, tags, state: "new", due: true }] }
        : d
    );
    listeners.forEach((l) => l());
  },
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export const countDue = (d: Deck) => d.cards.filter((c) => c.due).length;
export const countLearning = (d: Deck) => d.cards.filter((c) => c.state === "learning").length;
export const countNew = (d: Deck) => d.cards.filter((c) => c.state === "new").length;
