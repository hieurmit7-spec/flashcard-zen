export type Card = {
  id: string;
  front: string;
  back: string;
  tags: string[];
  state: "new" | "learning" | "review";
  due: boolean;
};

export type Deck = {
  id: string;
  name: string;
  description: string;
  cards: Card[];
};

const uid = () => Math.random().toString(36).slice(2, 10);

const seed: Deck[] = [
  {
    id: "unit-1",
    name: "unit 1",
    description: "Vocabulary flashcards from unit-1-sigma",
    cards: [
      { id: uid(), front: "Tactical Loss", back: "noun phrase — A small loss that you accept on purpose to gain a bigger advantage later. — Thua co chien thuat", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Strategic", back: "adjective — Carefully planned to achieve a long-term goal. — Mang tinh chien luoc", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "The Vast Number Of", back: "phrase — A very large amount of something. — So luong khong lo", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Resource Allocation", back: "noun phrase — The process of deciding how to share limited things (time, money, people) among different needs. — Phan bo nguon luc", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Eventual", back: "adjective — Happening at the end of a process or period of time. — Cuoi cung, sau cung", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Antiquity", back: "noun — The ancient past, especially the period of Greek and Roman civilizations. — Thoi co dai", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Downfall", back: "noun — A loss of power, prosperity, or status; the cause of ruin. — Su sup do", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Cede", back: "verb — To give up power, territory, or rights, especially unwillingly. — Nhuong lai, nhuong", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Scarcely", back: "adverb — Hardly; almost not; only just. — Hau nhu khong", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Make Perfect Sense", back: "phrase — To be completely logical and easy to understand. — Hoan toan hop ly", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Resuscitate", back: "verb — To revive or bring back to life, consciousness, or use. — Hoi sinh, lam song lai", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Indisputable", back: "adjective — Unable to be challenged or denied; unquestionable. — Khong the choi cai", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Episodic", back: "adjective — Related to specific, individual events or episodes in life. — Theo tung su kien", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Generic", back: "adjective — Common and not specific; relating to a general type. — Chung chung", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Correspond To", back: "verb phrase — To match or be directly related to something else. — Tuong ung voi", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Life-Threatening Events", back: "noun phrase — Dangerous situations that could cause death. — Su kien de doa tinh mang", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Fluid", back: "adjective — Able to change easily; not fixed or rigid. — Linh hoat / Hay thay doi", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Sphere", back: "noun — An area of activity, interest, or influence. — Linh vuc / Pham vi", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Self-Identity", back: "noun — The way a person sees and defines who they are. — Ban sac ca nhan", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Unify", back: "verb — To bring different people together to form one group. — Thong nhat, doan ket", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Foster", back: "verb — To help something grow or develop. — Nuoi duong, thuc day", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Equivalent", back: "noun — Something that has the same value or function as another thing. — Su tuong duong / Thay the", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Patriotism", back: "noun — Love and devotion to one's country. — Long yeu nuoc", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Engage In", back: "verb phrase — To participate or become involved in an activity. — Tham gia vao", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Nationalistic Pride", back: "noun phrase — A strong feeling of pride in one's nation, often expressed through support of national symbols or teams. — Niem tu hao dan toc", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Reinforcement", back: "noun — The process of strengthening or encouraging a behavior or idea. — Su cung co", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Diplomatic Status", back: "noun phrase — The position or standing of a country in international relations. — Vi the ngoai giao", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Allegiance", back: "noun — Loyalty or commitment to a leader, group, or cause. — Su trung thanh", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Discipline", back: "noun — The practice of training people to obey rules or a code of behavior; self-control. — Ky luat", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Predominantly", back: "adverb — Mainly; for the most part. — Chu yeu, phan lon", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Curb", back: "verb — To restrain or keep in check; to control or limit something. — Kiem che, han che", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Lateral", back: "adjective — A creative, indirect way of thinking or solving problems. — Sang tao, gian tiep", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Passive", back: "adjective — Not actively participating; just receiving information without engaging. — Thu dong", tags: ["unit1"], state: "new", due: true },
      { id: uid(), front: "Strategy", back: "noun — A carefully made plan designed to achieve a long-term goal. — Chien luoc", tags: ["unit1"], state: "new", due: true }
    ]
  },
  {
    id: "unit-3",
    name: "unit 3",
    description: "Vocabulary flashcards for unit 3",
    cards: [
      { id: uid(), front: "needle", back: "n — kim tiêm", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "contagious", back: "adj — lây lan, lây nhiễm", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "epidemic", back: "n — dịch bệnh, nạn dịch", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "eradicate", back: "v — diệt trừ, xóa bỏ", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "infiltrate", back: "v — xâm nhập", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "sterilize", back: "v — làm vô sinh", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "symptom", back: "n — triệu chứng", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "trauma", back: "n — tổn thương, chấn thương", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "autism", back: "n — chứng tự kỷ", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "outbreak", back: "n — sự bùng phát dịch bệnh", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "polio", back: "n — bệnh bại liệt", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "paralysis", back: "n — chứng bại liệt", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "antigen", back: "n — kháng nguyên", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "antibody", back: "n — kháng thể", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "pathogen", back: "n — mầm bệnh", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "ward off", back: "v — đẩy lùi", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "trigger", back: "v — kích hoạt", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "the bona fide disease", back: "n — bệnh thật", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "attenuated", back: "adj — bị làm suy yếu", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "inoculate", back: "v — tiêm chủng", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "render", back: "v — làm cho", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "livelong immunity", back: "n — sự miễn dịch trọn đời", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "administer", back: "v — cung cấp vaccine cho người bệnh (đường uống hoặc tiêm)", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "mutate", back: "v — đột biến", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "elicit", back: "v — kích thích, gây ra", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "maladies", back: "n — bệnh tật", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "nonreplicating", back: "adj — không có khả năng nhân lên", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "well tolerated", back: "adj — được dung nạp tốt (ít tác dụng phụ)", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "foresee", back: "v — thấy trước", tags: ["unit3"], state: "new", due: true },
      { id: uid(), front: "utilize", back: "v — sử dụng", tags: ["unit3"], state: "new", due: true }
    ]
  },
  {
    id: "unit-5",
    name: "unit 5",
    description: "Vocabulary flashcards for unit 5",
    cards: [
      { id: uid(), front: "plagued", back: "adj — bị ảnh hưởng nghiêm trọng", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "filtration", back: "n — sự lọc", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "conventional", back: "adj — truyền thống, thông thường", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "scalable", back: "adj — có thể mở rộng, có thể phát triển theo quy mô lớn", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "potential", back: "n — tiềm năng", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "empirically", back: "adv — thực tế", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "respiratory system", back: "n — hệ hô hấp", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "pollutant", back: "n — chất ô nhiễm", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "particulate", back: "n — hạt", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "penetrate", back: "v — xuyên qua, thâm nhập", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "diffuse", back: "v — khuếch tán, phân tán", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "cardiovascular system", back: "n — hệ thống tim mạch", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "combustion", back: "n — sự đốt cháy", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "exhaust", back: "n — khí thải", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "vehicular pollution", back: "n — ô nhiễm do phương tiện giao thông", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "ashma", back: "n — bệnh hen xuyễn", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "eliminate", back: "v — loại bỏ, loại trừ", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "stationary", back: "adj — đứng im", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "scrutiny", back: "n — sự giám sát chặt chẽ", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "advent", back: "n — sự ra đời, sự có mặt", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "have merit", back: "v — xứng đáng được công nhận", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "deplorable", back: "adj — tồi tệ, tệ hại", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "absorb", back: "v — hấp thụ, hấp thu", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "sustainable", back: "adj — bền vững, thân thiện với môi trường", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "culprits", back: "n — thủ phạm, nguyên nhân", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "stringent", back: "adj — nghiêm ngặt, nghiêm khắc", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "wither", back: "v — làm khô héo", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "stride", back: "n — bước tiến", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "aggregate", back: "adj — tổng", tags: ["unit5"], state: "new", due: true },
      { id: uid(), front: "fine particulate", back: "n — hạt mịn", tags: ["unit5"], state: "new", due: true }
    ]
  }
];

let decks: Deck[] = seed;
const listeners = new Set<() => void>();

export const decksStore = {
  get: () => decks,
  getDeck: (id: string) => decks.find((d) => d.id === id),
  addCard: (deckId: string, front: string, back: string, tags: string[]) => {
    decks = decks.map((d) =>
      d.id === deckId
        ? { ...d, cards: [...d.cards, { id: uid(), front, back, tags, state: "new", due: true }] }
        : d
    );
    listeners.forEach((l) => l());
  },
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export const countDue = (d: Deck) => d.cards.filter((c) => c.due).length;
export const countLearning = (d: Deck) => d.cards.filter((c) => c.state === "learning").length;
export const countNew = (d: Deck) => d.cards.filter((c) => c.state === "new").length;
