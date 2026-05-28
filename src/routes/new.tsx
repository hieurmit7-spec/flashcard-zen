import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { createCard, fetchDecks, type Deck } from "@/lib/flashcards-api";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [{ title: "Thẻ mới — Flashly" }],
  }),
  component: NewCard,
});

function NewCard() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [deckId, setDeckId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const rows = await fetchDecks();
        if (!alive) return;
        setDecks(rows);
        setDeckId(rows[0]?.id ?? "");
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Không tải được bộ bài");
      }
    };
    void run();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate({ to: "/" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [tags, setTags] = useState("");
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim() || !deckId) return;
    try {
      await createCard(deckId, front.trim(), back.trim());
      setSaved(true);
      setTimeout(() => navigate({ to: "/" }), 600);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lưu thẻ thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Thêm thẻ mới</h1>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <p className="mt-1.5 text-muted-foreground">
            Soạn một thẻ flashcard mới và thêm vào bộ bài.
          </p>
        </header>

        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <Field label="Bộ bài">
            <select
              value={deckId}
              onChange={(e) => setDeckId(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {decks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Mặt trước">
            <input
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Câu hỏi hoặc từ vựng…"
              className="w-full rounded-lg border border-input bg-background px-4 py-3.5 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field label="Mặt sau">
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={4}
              placeholder="Đáp án hoặc giải nghĩa…"
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field label="Thẻ (Tags)" hint="Phân tách bởi dấu phẩy">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="v.d. tiếng-anh, B2, idiom"
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={saved}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {saved ? <><Check className="h-4 w-4" /> Đã lưu</> : "Lưu thẻ"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
