import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zotxwytmwbwdemsstiqa.supabase.co",
  "sb_secret_6qXe9kXThUxGRZ7chS28iA_zy2qPc_N"
);

const wikiSearch = async (query) => {
  const urls = [
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`,
    `https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=${encodeURIComponent(query)}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "flashcard-zen-bot/1.0 (educational)",
          "Accept": "application/json,text/html;q=0.9,*/*;q=0.8",
        },
      });
      const text = await res.text();
      const data = JSON.parse(text);
      const pages = Object.values(data?.query?.pages ?? {});
      const found = pages
        .map((p) => p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url)
        .filter(Boolean)
        .slice(0, 12);
      if (found.length > 0) return found;
    } catch {
      continue;
    }
  }

  return [];
};

const levelFromWord = (front) => {
  const n = front.length;
  if (n <= 7) return 2;
  if (n <= 14) return 3;
  return 4;
};

const cleanQuery = (front) => front.replace(/[-_]/g, " ").replace(/[^a-zA-Z0-9\s]/g, "").trim();

async function main() {
  const { data: cards, error } = await supabase
    .from("cards")
    .select("id, front_content")
    .order("created_at", { ascending: true });
  if (error) throw error;

  for (const card of cards ?? []) {
    const wanted = levelFromWord(card.front_content);
    const query = cleanQuery(card.front_content);
    const urls = await wikiSearch(query);
    const picked = Array.from(new Set(urls)).slice(0, wanted);

    if (picked.length === 0) continue;

    const payload = picked.map((u, idx) => ({
      card_id: card.id,
      image_url: u,
      source: "wikimedia",
      rank: idx,
    }));

    const { error: insErr } = await supabase
      .from("card_images")
      .upsert(payload, { onConflict: "card_id,image_url" });

    if (insErr) {
      console.error("insert failed", card.front_content, insErr.message);
    } else {
      console.log(`ok ${card.front_content} -> ${picked.length}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});