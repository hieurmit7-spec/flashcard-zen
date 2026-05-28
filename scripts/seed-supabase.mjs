import { createClient } from "@supabase/supabase-js";

const url = "https://zotxwytmwbwdemsstiqa.supabase.co";
const key = "sb_secret_4y4VW_NAXTyGR0GSnWhbLg_7rze3E9h";
const supabase = createClient(url, key);

const userEmail = "seed-bot@local.flashly";
const userPassword = "Flashly!23456";

const cards = [
  ["Tactical Loss", "noun phrase — A small loss that you accept on purpose to gain a bigger advantage later. — Thua co chien thuat"],
  ["Strategic", "adjective — Carefully planned to achieve a long-term goal. — Mang tinh chien luoc"],
  ["The Vast Number Of", "phrase — A very large amount of something. — So luong khong lo"],
  ["Resource Allocation", "noun phrase — The process of deciding how to share limited things (time, money, people) among different needs. — Phan bo nguon luc"],
  ["Eventual", "adjective — Happening at the end of a process or period of time. — Cuoi cung, sau cung"],
  ["Antiquity", "noun — The ancient past, especially the period of Greek and Roman civilizations. — Thoi co dai"],
  ["Downfall", "noun — A loss of power, prosperity, or status; the cause of ruin. — Su sup do"],
  ["Cede", "verb — To give up power, territory, or rights, especially unwillingly. — Nhuong lai, nhuong"],
  ["Scarcely", "adverb — Hardly; almost not; only just. — Hau nhu khong"],
  ["Make Perfect Sense", "phrase — To be completely logical and easy to understand. — Hoan toan hop ly"],
  ["Resuscitate", "verb — To revive or bring back to life, consciousness, or use. — Hoi sinh, lam song lai"],
  ["Indisputable", "adjective — Unable to be challenged or denied; unquestionable. — Khong the choi cai"],
  ["Episodic", "adjective — Related to specific, individual events or episodes in life. — Theo tung su kien"],
  ["Generic", "adjective — Common and not specific; relating to a general type. — Chung chung"],
  ["Correspond To", "verb phrase — To match or be directly related to something else. — Tuong ung voi"],
  ["Life-Threatening Events", "noun phrase — Dangerous situations that could cause death. — Su kien de doa tinh mang"],
  ["Fluid", "adjective — Able to change easily; not fixed or rigid. — Linh hoat / Hay thay doi"],
  ["Sphere", "noun — An area of activity, interest, or influence. — Linh vuc / Pham vi"],
  ["Self-Identity", "noun — The way a person sees and defines who they are. — Ban sac ca nhan"],
  ["Unify", "verb — To bring different people together to form one group. — Thong nhat, doan ket"],
  ["Foster", "verb — To help something grow or develop. — Nuoi duong, thuc day"],
  ["Equivalent", "noun — Something that has the same value or function as another thing. — Su tuong duong / Thay the"],
  ["Patriotism", "noun — Love and devotion to one's country. — Long yeu nuoc"],
  ["Engage In", "verb phrase — To participate or become involved in an activity. — Tham gia vao"],
  ["Nationalistic Pride", "noun phrase — A strong feeling of pride in one's nation, often expressed through support of national symbols or teams. — Niem tu hao dan toc"],
  ["Reinforcement", "noun — The process of strengthening or encouraging a behavior or idea. — Su cung co"],
  ["Diplomatic Status", "noun phrase — The position or standing of a country in international relations. — Vi the ngoai giao"],
  ["Allegiance", "noun — Loyalty or commitment to a leader, group, or cause. — Su trung thanh"],
  ["Discipline", "noun — The practice of training people to obey rules or a code of behavior; self-control. — Ky luat"],
  ["Predominantly", "adverb — Mainly; for the most part. — Chu yeu, phan lon"],
  ["Curb", "verb — To restrain or keep in check; to control or limit something. — Kiem che, han che"],
  ["Lateral", "adjective — A creative, indirect way of thinking or solving problems. — Sang tao, gian tiep"],
  ["Passive", "adjective — Not actively participating; just receiving information without engaging. — Thu dong"],
  ["Strategy", "noun — A carefully made plan designed to achieve a long-term goal. — Chien luoc"],
];

async function main() {
  const created = await supabase.auth.admin.createUser({
    email: userEmail,
    password: userPassword,
    email_confirm: true,
  });

  let userId = created.data.user?.id;
  if (!userId) {
    const users = await supabase.auth.admin.listUsers();
    userId = users.data.users.find((u) => u.email === userEmail)?.id;
  }
  if (!userId) throw new Error("Cannot get seed user id");

  const { data: existingDeck } = await supabase
    .from("decks")
    .select("id")
    .eq("user_id", userId)
    .eq("title", "unit 1")
    .maybeSingle();

  let deckId = existingDeck?.id;
  if (!deckId) {
    const ins = await supabase
      .from("decks")
      .insert({ user_id: userId, title: "unit 1", description: "Vocabulary flashcards from unit-1-sigma" })
      .select("id")
      .single();
    if (ins.error) throw ins.error;
    deckId = ins.data.id;
  }

  const existingCards = await supabase.from("cards").select("front_content").eq("deck_id", deckId);
  if (existingCards.error) throw existingCards.error;
  const existingSet = new Set((existingCards.data ?? []).map((x) => x.front_content));

  const toInsert = cards
    .filter(([front]) => !existingSet.has(front))
    .map(([front_content, back_content]) => ({ deck_id: deckId, front_content, back_content }));

  if (toInsert.length > 0) {
    const insCards = await supabase.from("cards").insert(toInsert);
    if (insCards.error) throw insCards.error;
  }

  const count = await supabase.from("cards").select("id", { count: "exact", head: true }).eq("deck_id", deckId);

  console.log(JSON.stringify({ ok: true, userEmail, userPassword, userId, deckId, inserted: toInsert.length, total: count.count ?? 0 }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});