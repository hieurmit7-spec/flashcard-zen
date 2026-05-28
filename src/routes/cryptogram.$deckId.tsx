import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CryptogramGame } from "@/components/CryptogramGame";
import { fetchDueCardsByDeck } from "@/lib/flashcards-api";
import type { DeckWord } from "@/lib/cryptogram";

export const Route = createFileRoute("/cryptogram/$deckId")({
  component: CryptogramPage,
  head: () => ({ meta: [{ title: "Cryptogram — Flashly" }] }),
});

function parseMeaning(back: string) {
  const parts = back.split(" — ");
  return parts[parts.length - 1] ?? back;
}

function CryptogramPage() {
  const { deckId } = Route.useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState<DeckWord[]>([]);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      const rows = await fetchDueCardsByDeck(deckId);
      if (!alive) return;
      setWords(rows.map((c) => ({ word: c.front_content, meaning: parseMeaning(c.back_content) })));
    };
    void run();
    return () => {
      alive = false;
    };
  }, [deckId]);

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
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Number Sentence Puzzle</h1>
        <p className="mb-6 text-sm text-muted-foreground">Giải mã một câu tiếng Anh ngắn bằng cách điền chữ cái theo số (1-26).</p>
        <CryptogramGame words={words} />
      </main>
    </div>
  );
}
