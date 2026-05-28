import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { fetchDecks, fetchDueCardsByDeck, type Deck } from "@/lib/flashcards-api";

export const Route = createFileRoute("/dictionary")({
  head: () => ({
    meta: [{ title: "Từ điển — Flashly" }],
  }),
  component: DictionaryPage,
});

type DictionaryItem = {
  id: string;
  deckId: string;
  deckTitle: string;
  word: string;
  meaning: string;
};

function DictionaryPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [items, setItems] = useState<DictionaryItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDeckId, setSelectedDeckId] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const deckRows = await fetchDecks();
        if (!alive) return;
        setDecks(deckRows);

        const cardGroups = await Promise.all(
          deckRows.map(async (deck) => ({
            deck,
            cards: await fetchDueCardsByDeck(deck.id),
          }))
        );
        if (!alive) return;

        const flatItems: DictionaryItem[] = cardGroups.flatMap(({ deck, cards }) =>
          cards.map((card) => ({
            id: card.id,
            deckId: deck.id,
            deckTitle: deck.title,
            word: card.front_content,
            meaning: card.back_content,
          }))
        );

        setItems(flatItems);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Không tải được dữ liệu từ điển");
      }
    };

    void run();
    return () => {
      alive = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const deckMatched = selectedDeckId === "all" || item.deckId === selectedDeckId;
      if (!deckMatched) return false;
      if (!q) return true;

      return item.word.toLowerCase().includes(q) || item.meaning.toLowerCase().includes(q);
    });
  }, [items, search, selectedDeckId]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Từ điển tra từ</h1>
          <p className="mt-1.5 text-muted-foreground">Tra nhanh từ vựng theo bộ bài và từ khóa.</p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </header>

        <section className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3 sm:p-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm từ hoặc nghĩa..."
            className="sm:col-span-2 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <select
            value={selectedDeckId}
            onChange={(e) => setSelectedDeckId(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Tất cả bộ bài</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.title}
              </option>
            ))}
          </select>
        </section>

        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">{filteredItems.length} kết quả</p>
          {filteredItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-1 text-xs text-muted-foreground">{item.deckTitle}</div>
              <h2 className="text-base font-semibold tracking-tight">{item.word}</h2>
              <p className="mt-1 text-sm text-foreground/90">{item.meaning}</p>
            </article>
          ))}
          {filteredItems.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Không tìm thấy từ phù hợp.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
