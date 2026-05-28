import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { MemoryMatchGame, type MemoryFlashcard } from "@/components/MemoryMatchGame";
import { fetchDueCardsByDeck } from "@/lib/flashcards-api";

export const Route = createFileRoute("/memory-match/$deckId")({
  component: MemoryMatchPage,
  head: () => ({ meta: [{ title: "Memory Match — Flashly" }] }),
});

const shuffle = <T,>(arr: T[]): T[] => {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

function MemoryMatchPage() {
  const { deckId } = Route.useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState<MemoryFlashcard[]>([]);

  const loadRandomCards = useCallback(async () => {
    const data = await fetchDueCardsByDeck(deckId);
    const picked = shuffle(data)
      .slice(0, 10)
      .map((c) => ({ id: c.id, front: c.front_content, back: c.back_content.split(" — ").slice(-1)[0] || c.back_content }));
    setCards(picked);
  }, [deckId]);

  useEffect(() => {
    void loadRandomCards();
  }, [loadRandomCards]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate({ to: "/" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Memory Match</h1>
        <p className="mb-6 text-sm text-muted-foreground">Lật thẻ và tìm cặp từ vựng - nghĩa tiếng Việt.</p>
        <MemoryMatchGame flashcards={cards} onReplay={() => void loadRandomCards()} recordKey={deckId} />
      </main>
    </div>
  );
}
