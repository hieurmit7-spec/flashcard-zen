import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { fetchDecks, fetchDueCardsByDeck, reviewCard, type Deck } from "@/lib/flashcards-api";

export const Route = createFileRoute("/study/$deckId")({
  head: () => ({
    meta: [{ title: "Ôn tập — Flashly" }],
  }),
  component: StudyPage,
  notFoundComponent: () => <NotFound />,
});

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link to="/" className="text-primary underline">Quay về Dashboard</Link>
    </div>
  );
}

function StudyPage() {
  const { deckId } = Route.useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Array<{ id: string; front: string; back: string; tags: string[]; images: string[] }>>([]);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const decks = await fetchDecks();
        const d = decks.find((x) => x.id === deckId) ?? null;
        if (!alive) return;
        setDeck(d);
        if (!d) return;
        const due = await fetchDueCardsByDeck(deckId);
        if (!alive) return;
        setCards(
          due.map((c) => ({
            id: c.id,
            front: c.front_content,
            back: c.back_content,
            tags: [],
            images: (c.images ?? []).map((img) => img.image_url),
          }))
        );
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Không tải được dữ liệu học");
      }
    };
    void run();
    return () => {
      alive = false;
    };
  }, [deckId]);

  const total = cards.length;
  const card = cards[index];
  const progress = total === 0 ? 0 : ((index + (flipped ? 0.5 : 0)) / total) * 100;

  const grade = async (g: "again" | "hard" | "good" | "easy") => {
    try {
      if (card) await reviewCard(card.id, g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được kết quả ôn tập");
    }
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  useEffect(() => {
    if (!card?.front || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(card.front);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [card?.id]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate({ to: "/" });
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
        return;
      }
      if (!flipped) return;
      if (e.key === "1") void grade("again");
      if (e.key === "2") void grade("hard");
      if (e.key === "3") void grade("good");
      if (e.key === "4") void grade("easy");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flipped, card?.id, index, total, navigate]);

  if (!deck) return <NotFound />;

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar onBack={() => navigate({ to: "/" })} current={total} total={total} progress={100} />
        <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-good/15 text-good">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Hoàn thành!</h1>
          <p className="mt-2 text-muted-foreground">
            Bạn đã ôn xong {total} thẻ trong "{deck.title}".
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Về Dashboard
          </Link>
        </main>
      </div>
    );
  }

  if (total === 0 || !card) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar onBack={() => navigate({ to: "/" })} current={0} total={0} progress={0} />
        <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Chưa có thẻ cần ôn</h1>
          <p className="mt-2 text-muted-foreground">Hãy quay lại Dashboard hoặc thêm thẻ mới.</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Về Dashboard
          </Link>
        </main>
      </div>
    );
  }

  const parts = card.back.split(" — ");
  const viMeaning = parts[parts.length - 1] ?? card.back;
  const enMeaning = parts.slice(0, -1).join(" — ");

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        onBack={() => navigate({ to: "/" })}
        current={index + 1}
        total={total}
        progress={progress}
      />

      <main className="mx-auto flex max-w-2xl flex-col px-4 pb-12 pt-10 sm:pt-16">
        <div
          className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)] sm:p-12"
          style={{ perspective: "1200px" }}
        >
          <div
            key={`${card.id}-${flipped}`}
            className="animate-flip-in"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="text-center">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Mặt trước
              </span>
              <p className="mt-4 text-3xl font-semibold leading-snug tracking-tight sm:text-4xl">
                {card.front}
              </p>
            </div>

            {flipped && (
              <>
                <div className="my-8 h-px bg-border" />
                <div className="text-center">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Mặt sau
                  </span>
                  <p className="mt-4 text-3xl font-semibold leading-relaxed text-foreground sm:text-4xl">
                    {viMeaning}
                  </p>
                  {enMeaning && (
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {enMeaning}
                    </p>
                  )}
                  {card.images.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {card.images.map((src) => (
                        <img
                          key={src}
                          src={src}
                          alt={card.front}
                          loading="lazy"
                          className="h-24 w-full rounded-lg object-cover border border-border"
                        />
                      ))}
                    </div>
                  )}
                  {card.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {card.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8">
          {!flipped ? (
            <button
              onClick={() => setFlipped(true)}
              className="w-full rounded-xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Hiện đáp án
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <GradeButton label="Lại" hint="1 phút" onClick={() => grade("again")} variant="again" />
              <GradeButton label="Khó" hint="6 phút" onClick={() => grade("hard")} variant="hard" />
              <GradeButton label="Tốt" hint="10 phút" onClick={() => grade("good")} variant="good" />
              <GradeButton label="Dễ" hint="4 ngày" onClick={() => grade("easy")} variant="easy" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TopBar({
  onBack,
  current,
  total,
  progress,
}: {
  onBack: () => void;
  current: number;
  total: number;
  progress: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-2xl items-center gap-4 px-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <div className="flex-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-sm tabular-nums text-muted-foreground">
          Thẻ {current}/{total}
        </span>
      </div>
    </header>
  );
}

function GradeButton({
  label,
  hint,
  onClick,
  variant,
}: {
  label: string;
  hint: string;
  onClick: () => void;
  variant: "again" | "hard" | "good" | "easy";
}) {
  const styles: Record<string, string> = {
    again: "bg-again text-again-foreground hover:brightness-110",
    hard: "bg-hard text-hard-foreground hover:brightness-110",
    good: "bg-good text-good-foreground hover:brightness-110",
    easy: "bg-easy text-easy-foreground hover:brightness-110",
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-all active:scale-[0.98] ${styles[variant]}`}
    >
      <span>{label}</span>
      <span className="mt-0.5 text-[11px] font-normal opacity-80">{hint}</span>
    </button>
  );
}
