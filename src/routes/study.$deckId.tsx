import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { decksStore } from "@/lib/decks-store";

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
  const deck = decksStore.getDeck(deckId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const cards = useMemo(() => deck?.cards ?? [], [deck]);

  if (!deck) return <NotFound />;

  const total = cards.length;
  const card = cards[index];
  const progress = total === 0 ? 0 : ((index + (flipped ? 0.5 : 0)) / total) * 100;

  const grade = (_g: "again" | "hard" | "good" | "easy") => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setFlipped(false);
    setIndex((i) => i + 1);
  };

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
            Bạn đã ôn xong {total} thẻ trong "{deck.name}".
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
                  <p className="mt-4 text-xl leading-relaxed text-foreground sm:text-2xl">
                    {card.back}
                  </p>
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
