import { supabase } from "@/lib/supabase";
import { calculateSm2, type ReviewRating } from "@/lib/sm2";

export type Deck = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
};

export type CardImage = {
  id: string;
  card_id: string;
  image_url: string;
  source: string;
  rank: number;
};

export type Card = {
  id: string;
  deck_id: string;
  front_content: string;
  back_content: string;
  created_at: string;
};

export type StudyProgress = {
  id: string;
  user_id: string;
  card_id: string;
  interval: number;
  ease_factor: number;
  next_review_date: string;
};

export const getCurrentUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) return null;
  return data.user.id;
};

const UNIT_3_DECK_ID = "unit-3-local";
const UNIT_4_DECK_ID = "unit-4-local";
const UNIT_5_DECK_ID = "unit-5-local";
const MOWISI_UNIT_2_DECK_ID = "mowisi-unit-2-local";

const MOWISI_UNIT_2_CARDS: Array<{ front_content: string; back_content: string }> = [
  { front_content: "critical", back_content: "adj — rất quan trọng, cần thiết" },
  { front_content: "protectionist legislations", back_content: "n — chính sách bảo hộ" },
  { front_content: "free trade", back_content: "n — thương mại tự do" },
  { front_content: "specialize in", back_content: "v — chuyên môn hóa về" },
  { front_content: "tackle", back_content: "v — giải quyết" },
  { front_content: "counterintuitive", back_content: "adj — phản trực giác, khó tin" },
  { front_content: "robust", back_content: "adj — mạnh mẽ" },
  { front_content: "leverage", back_content: "v — tận dụng" },
  { front_content: "restrictive tariff", back_content: "n — thuế quan nhằm hạn chế (hạn chế hàng nhập khẩu)" },
  { front_content: "wrongheadedly", back_content: "adv — một cách sai lầm, biết sai nhưng vẫn ngoan cố" },
  { front_content: "go awry", back_content: "v — trở nên tồi tệ, không đúng dự định" },
  { front_content: "opt for", back_content: "v — lựa chọn" },
  { front_content: "protectionist measure", back_content: "n — biện pháp bảo hộ" },
  { front_content: "import quota", back_content: "n — hạn ngạch nhập khẩu" },
  { front_content: "financial prosperity", back_content: "n — sự thịnh vượng tài chính" },
  { front_content: "market superiority", back_content: "n — vị thế vượt trội trên thị trường" },
  { front_content: "retaliatory", back_content: "adj — nhằm trả đũa" },
  { front_content: "rally", back_content: "v — tập hợp lại" },
  { front_content: "savvy", back_content: "adj — khôn ngoan" },
  { front_content: "opportunity cost", back_content: "n — chi phí cơ hội" },
  { front_content: "incur", back_content: "v — phát sinh (chi phí)" },
  { front_content: "prospective", back_content: "adj — tương lai, sắp tới" },
  { front_content: "innumerable", back_content: "adj — vô số, không đếm xuể" },
  { front_content: "analogous", back_content: "adj — tương tự" },
  { front_content: "ostensibly", back_content: "adv — bề ngoài là, tỏ ra là" },
  { front_content: "devolve into", back_content: "v — biến thành" },
  { front_content: "hiccup", back_content: "n — trục trặc" },
  { front_content: "sanctions", back_content: "n — chế tài, hình phạt" },
  { front_content: "enact", back_content: "v — ban hành đạo luật" },
  { front_content: "even-handed", back_content: "adj — công bằng, không thiên vị" },
];

const UNIT_3_CARDS: Array<{ front_content: string; back_content: string }> = [
  { front_content: "needle", back_content: "n — kim tiêm" },
  { front_content: "contagious", back_content: "adj — lây lan, lây nhiễm" },
  { front_content: "epidemic", back_content: "n — dịch bệnh, nạn dịch" },
  { front_content: "eradicate", back_content: "v — diệt trừ, xóa bỏ" },
  { front_content: "infiltrate", back_content: "v — xâm nhập" },
  { front_content: "sterilize", back_content: "v — làm vô sinh" },
  { front_content: "symptom", back_content: "n — triệu chứng" },
  { front_content: "trauma", back_content: "n — tổn thương, chấn thương" },
  { front_content: "autism", back_content: "n — chứng tự kỷ" },
  { front_content: "outbreak", back_content: "n — sự bùng phát dịch bệnh" },
  { front_content: "polio", back_content: "n — bệnh bại liệt" },
  { front_content: "paralysis", back_content: "n — chứng bại liệt" },
  { front_content: "antigen", back_content: "n — kháng nguyên" },
  { front_content: "antibody", back_content: "n — kháng thể" },
  { front_content: "pathogen", back_content: "n — mầm bệnh" },
  { front_content: "ward off", back_content: "v — đẩy lùi" },
  { front_content: "trigger", back_content: "v — kích hoạt" },
  { front_content: "the bona fide disease", back_content: "n — bệnh thật" },
  { front_content: "attenuated", back_content: "adj — bị làm suy yếu" },
  { front_content: "inoculate", back_content: "v — tiêm chủng" },
  { front_content: "render", back_content: "v — làm cho" },
  { front_content: "livelong immunity", back_content: "n — sự miễn dịch trọn đời" },
  { front_content: "administer", back_content: "v — cung cấp vaccine cho người bệnh (đường uống hoặc tiêm)" },
  { front_content: "mutate", back_content: "v — đột biến" },
  { front_content: "elicit", back_content: "v — kích thích, gây ra" },
  { front_content: "maladies", back_content: "n — bệnh tật" },
  { front_content: "nonreplicating", back_content: "adj — không có khả năng nhân lên" },
  { front_content: "well tolerated", back_content: "adj — được dung nạp tốt (ít tác dụng phụ)" },
  { front_content: "foresee", back_content: "v — thấy trước" },
  { front_content: "utilize", back_content: "v — sử dụng" },
];

const UNIT_4_CARDS: Array<{ front_content: string; back_content: string }> = [
  { front_content: "disciples", back_content: "n — đệ tử, học trò" },
  { front_content: "cultivate", back_content: "v — gieo trồng, vun xới" },
  { front_content: "prevailing", back_content: "adj — thịnh hành, phổ biến" },
  { front_content: "hallmark", back_content: "n — dấu ấn" },
  { front_content: "approach", back_content: "n, v — tiếp cận, cách tiếp cận" },
  { front_content: "deferential", back_content: "adj — tôn kính, cung kính" },
  { front_content: "flourish", back_content: "v — phát triển mạnh mẽ" },
  { front_content: "envision", back_content: "v — hình dung, mường tượng" },
  { front_content: "contemporary", back_content: "adj — đương thời, đương đại" },
  { front_content: "hypothesize", back_content: "v — đưa ra giả thuyết" },
  { front_content: "doctrine", back_content: "n — học thuyết, giáo lý" },
  { front_content: "betterment", back_content: "n — sự cải thiện, sự tốt hơn" },
  { front_content: "pepper", back_content: "v — hỏi dồn dập" },
  { front_content: "dialectic", back_content: "n — phép biện chứng" },
  { front_content: "ambiguity", back_content: "n — sự tối nghĩa, mơ hồ" },
  { front_content: "conceive", back_content: "v — nhìn nhận, nhận định" },
  { front_content: "manipulation", back_content: "n — sự thao túng" },
  { front_content: "unskillfully", back_content: "adv — một cách vụng về" },
  { front_content: "inherent ability", back_content: "n — khả năng vốn có" },
  { front_content: "hone", back_content: "v — trau dồi" },
  { front_content: "intellectual", back_content: "adj — thuộc về trí tuệ" },
  { front_content: "beyond", back_content: "prep — vượt ra ngoài" },
  { front_content: "encompass", back_content: "v — bao gồm" },
  { front_content: "spatially constrained", back_content: "adj — bị giới hạn về mặt không gian" },
  { front_content: "usher in", back_content: "v — mở ra" },
  { front_content: "ruthlessly", back_content: "adv — một cách tàn nhẫn, tàn bạo" },
  { front_content: "virtue", back_content: "n — đức hạnh" },
  { front_content: "extant", back_content: "adj — còn lại, còn tồn tại (theo thời gian)" },
  { front_content: "ethnocentric", back_content: "adj — phân biệt dân tộc" },
  { front_content: "overstated", back_content: "v — nói quá, phóng đại" },
];

const UNIT_5_CARDS: Array<{ front_content: string; back_content: string }> = [
  { front_content: "plagued", back_content: "adj — bị ảnh hưởng nghiêm trọng" },
  { front_content: "filtration", back_content: "n — sự lọc" },
  { front_content: "conventional", back_content: "adj — truyền thống, thông thường" },
  { front_content: "scalable", back_content: "adj — có thể mở rộng, có thể phát triển theo quy mô lớn" },
  { front_content: "potential", back_content: "n — tiềm năng" },
  { front_content: "empirically", back_content: "adv — thực tế" },
  { front_content: "respiratory system", back_content: "n — hệ hô hấp" },
  { front_content: "pollutant", back_content: "n — chất ô nhiễm" },
  { front_content: "particulate", back_content: "n — hạt" },
  { front_content: "penetrate", back_content: "v — xuyên qua, thâm nhập" },
  { front_content: "diffuse", back_content: "v — khuếch tán, phân tán" },
  { front_content: "cardiovascular system", back_content: "n — hệ thống tim mạch" },
  { front_content: "combustion", back_content: "n — sự đốt cháy" },
  { front_content: "exhaust", back_content: "n — khí thải" },
  { front_content: "vehicular pollution", back_content: "n — ô nhiễm do phương tiện giao thông" },
  { front_content: "ashma", back_content: "n — bệnh hen xuyễn" },
  { front_content: "eliminate", back_content: "v — loại bỏ, loại trừ" },
  { front_content: "stationary", back_content: "adj — đứng im" },
  { front_content: "scrutiny", back_content: "n — sự giám sát chặt chẽ" },
  { front_content: "advent", back_content: "n — sự ra đời, sự có mặt" },
  { front_content: "have merit", back_content: "v — xứng đáng được công nhận" },
  { front_content: "deplorable", back_content: "adj — tồi tệ, tệ hại" },
  { front_content: "absorb", back_content: "v — hấp thụ, hấp thu" },
  { front_content: "sustainable", back_content: "adj — bền vững, thân thiện với môi trường" },
  { front_content: "culprits", back_content: "n — thủ phạm, nguyên nhân" },
  { front_content: "stringent", back_content: "adj — nghiêm ngặt, nghiêm khắc" },
  { front_content: "wither", back_content: "v — làm khô héo" },
  { front_content: "stride", back_content: "n — bước tiến" },
  { front_content: "aggregate", back_content: "adj — tổng" },
  { front_content: "fine particulate", back_content: "n — hạt mịn" },
];

const ensureDeckWithCards = async (
  title: string,
  description: string,
  cards: Array<{ front_content: string; back_content: string }>
) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { data: existing, error: findErr } = await supabase
    .from("decks")
    .select("id")
    .eq("user_id", userId)
    .eq("title", title)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing?.id) return;

  const { data: deck, error: createDeckErr } = await supabase
    .from("decks")
    .insert({ user_id: userId, title, description })
    .select("id")
    .single();

  if (createDeckErr) {
    if (createDeckErr.code === "23505" || createDeckErr.code === "409") return;
    throw createDeckErr;
  }

  const { error: createCardsErr } = await supabase
    .from("cards")
    .insert(cards.map((c) => ({ deck_id: deck.id, ...c })));
  if (createCardsErr) throw createCardsErr;
};

const ensureUnit3Deck = async () =>
  ensureDeckWithCards("unit 3", "Vocabulary flashcards for unit 3", UNIT_3_CARDS);

const ensureUnit4Deck = async () =>
  ensureDeckWithCards("unit 4", "Vocabulary flashcards for unit 4", UNIT_4_CARDS);

const ensureUnit5Deck = async () =>
  ensureDeckWithCards("unit 5", "Vocabulary flashcards for unit 5", UNIT_5_CARDS);

const ensureMowisiUnit2Deck = async () =>
  ensureDeckWithCards("mowisi unit 2", "Vocabulary flashcards for mowisi unit 2", MOWISI_UNIT_2_CARDS);

const hasDeckTitle = (rows: Deck[], title: string) => rows.some((d) => d.title === title);

const makeLocalDeck = (id: string, title: string, description: string): Deck => ({
  id,
  user_id: "local",
  title,
  description,
  created_at: new Date().toISOString(),
});

const makeLocalCards = (
  deckId: string,
  cards: Array<{ front_content: string; back_content: string }>,
  prefix: string
): Array<Card & { progress: StudyProgress | null; images: CardImage[] }> => {
  const today = new Date().toISOString();
  return cards.map((c, idx) => ({
    id: `${prefix}-${idx + 1}`,
    deck_id: deckId,
    front_content: c.front_content,
    back_content: c.back_content,
    created_at: today,
    progress: null,
    images: [],
  }));
};

const getLocalDeckConfig = (deckId: string) => {
  if (deckId === UNIT_3_DECK_ID) return { cards: UNIT_3_CARDS, prefix: "unit-3-card" };
  if (deckId === UNIT_4_DECK_ID) return { cards: UNIT_4_CARDS, prefix: "unit-4-card" };
  if (deckId === UNIT_5_DECK_ID) return { cards: UNIT_5_CARDS, prefix: "unit-5-card" };
  if (deckId === MOWISI_UNIT_2_DECK_ID) return { cards: MOWISI_UNIT_2_CARDS, prefix: "mowisi-unit-2-card" };
  return null;
};

const addFallbackDecks = (rows: Deck[]): Deck[] => {
  const next = [...rows];
  if (!hasDeckTitle(next, "unit 3")) {
    next.unshift(makeLocalDeck(UNIT_3_DECK_ID, "unit 3", "Vocabulary flashcards for unit 3"));
  }
  if (!hasDeckTitle(next, "unit 4")) {
    next.unshift(makeLocalDeck(UNIT_4_DECK_ID, "unit 4", "Vocabulary flashcards for unit 4"));
  }
  if (!hasDeckTitle(next, "unit 5")) {
    next.unshift(makeLocalDeck(UNIT_5_DECK_ID, "unit 5", "Vocabulary flashcards for unit 5"));
  }
  if (!hasDeckTitle(next, "mowisi unit 2")) {
    next.unshift(makeLocalDeck(MOWISI_UNIT_2_DECK_ID, "mowisi unit 2", "Vocabulary flashcards for mowisi unit 2"));
  }
  return next;
};

const ensureSeedDecks = async () => {
  await ensureUnit3Deck();
  await ensureUnit4Deck();
  await ensureUnit5Deck();
  await ensureMowisiUnit2Deck();
};

export const fetchDecks = async (): Promise<Deck[]> => {
  await ensureSeedDecks();
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return addFallbackDecks(data ?? []);
};
export const fetchDueCardsByDeck = async (deckId: string): Promise<Array<Card & { progress: StudyProgress | null; images: CardImage[] }>> => {
  const userId = await getCurrentUserId();

  const localDeck = getLocalDeckConfig(deckId);
  if (localDeck) return makeLocalCards(deckId, localDeck.cards, localDeck.prefix);

  const { data: cards, error: cardsError } = await supabase.from("cards").select("*").eq("deck_id", deckId);
  if (cardsError) throw cardsError;
  if (!cards || cards.length === 0) return [];

  const cardIds = cards.map((c) => c.id);
  const progressPromise = userId
    ? supabase.from("study_progress").select("*").eq("user_id", userId).in("card_id", cardIds)
    : Promise.resolve({ data: [], error: null });
  const [{ data: progressRows, error: progressError }, { data: imageRows, error: imageError }] = await Promise.all([
    progressPromise,
    supabase.from("card_images").select("*").in("card_id", cardIds).order("rank", { ascending: true }),
  ]);
  if (progressError) throw progressError;
  if (imageError) throw imageError;

  const progressMap = new Map((progressRows ?? []).map((p) => [p.card_id, p as StudyProgress]));
  const imagesMap = new Map<string, CardImage[]>();
  for (const row of imageRows ?? []) {
    const list = imagesMap.get(row.card_id) ?? [];
    list.push(row as CardImage);
    imagesMap.set(row.card_id, list);
  }

  const today = new Date().toISOString().slice(0, 10);

  return cards
    .map((c) => ({ ...(c as Card), progress: progressMap.get(c.id) ?? null, images: imagesMap.get(c.id) ?? [] }))
    .filter((c) => !c.progress || c.progress.next_review_date <= today);
};

export const createCard = async (deckId: string, front: string, back: string) => {
  const { data, error } = await supabase
    .from("cards")
    .insert({ deck_id: deckId, front_content: front, back_content: back })
    .select("*")
    .single();
  if (error) throw error;
  return data as Card;
};

export const reviewCard = async (cardId: string, rating: ReviewRating) => {
  const userId = await getCurrentUserId();
  const { data: existing, error: existingError } = await supabase
    .from("study_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("card_id", cardId)
    .maybeSingle();
  if (existingError) throw existingError;

  const next = calculateSm2(
    { interval: existing?.interval ?? 0, easeFactor: Number(existing?.ease_factor ?? 2.5) },
    rating
  );

  const { data, error } = await supabase
    .from("study_progress")
    .upsert(
      {
        user_id: userId,
        card_id: cardId,
        interval: next.interval,
        ease_factor: next.easeFactor,
        next_review_date: next.nextReviewDate,
      },
      { onConflict: "user_id,card_id" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data as StudyProgress;
};