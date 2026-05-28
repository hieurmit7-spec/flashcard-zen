import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Settings2, BookOpen, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { fetchDecks, fetchDueCardsByDeck, type Deck } from "@/lib/flashcards-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flashly — Học hiệu quả với flashcard" },
      { name: "description", content: "Ứng dụng học flashcard tối giản, lấy cảm hứng từ Anki." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [dueMap, setDueMap] = useState<Record<string, number>>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const rows = await fetchDecks();
        if (!alive) return;
        setDecks(rows);
        const entries = await Promise.all(rows.map(async (d) => [d.id, (await fetchDueCardsByDeck(d.id)).length] as const));
        if (!alive) return;
        setDueMap(Object.fromEntries(entries));
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Không tải được dữ liệu");
      }
    };
    void run();
    return () => {
      alive = false;
    };
  }, []);

  const totalDue = Object.values(dueMap).reduce((s, n) => s + n, 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Chào buổi sáng</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Bộ bài của bạn
          </h1>
          <p className="mt-2 text-muted-foreground">
            Bạn có <span className="font-medium text-due">{totalDue} thẻ</span> cần ôn hôm nay.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => {
            const due = dueMap[deck.id] ?? 0;
            const learning = 0;
            const fresh = 0;
            return (
              <article
                key={deck.id}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-foreground">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <button
                    aria-label="Chỉnh sửa bộ bài"
                    className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
                  >
                    <Settings2 className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="text-lg font-semibold tracking-tight">{deck.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {deck.description}
                </p>

                <div className="mt-5 flex items-center gap-4 text-sm">
                  <Stat label="Cần ôn" value={due} color="due" />
                  <Stat label="Đang học" value={learning} color="learning" />
                  <Stat label="Đã học" value={fresh} color="muted" />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-2">
                  <Link
                    to="/study/$deckId"
                    params={{ deckId: deck.id }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Học ngay
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/memory-match/$deckId"
                      params={{ deckId: deck.id }}
                      className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent"
                    >
                      Memory Match
                    </Link>
                    <Link
                      to="/cryptogram/$deckId"
                      params={{ deckId: deck.id }}
                      className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent"
                    >
                      Cryptogram
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: "due" | "learning" | "muted" }) {
  const colorClass =
    color === "due" ? "text-due" : color === "learning" ? "text-learning" : "text-muted-foreground";
  return (
    <div className="flex flex-col">
      <span className={`text-base font-semibold ${colorClass}`}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
