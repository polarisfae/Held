// ---- Say It: private journal (localStorage only) ----
const JOURNAL_KEY = "stillhere.journal";
const journalInput = document.getElementById("journalInput");
const saveEntryBtn = document.getElementById("saveEntryBtn");
const journalList = document.getElementById("journalList");

function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY)) || [];
  } catch {
    return [];
  }
}

function saveJournal(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

function renderJournal() {
  const entries = loadJournal();
  journalList.innerHTML = "";
  entries
    .slice()
    .reverse()
    .forEach((entry) => {
      const li = document.createElement("li");
      li.className = "journal-entry";

      const dateEl = document.createElement("span");
      dateEl.className = "entry-date";
      dateEl.textContent = new Date(entry.date).toLocaleString();

      const textEl = document.createElement("span");
      textEl.textContent = entry.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "remove";
      deleteBtn.addEventListener("click", () => {
        const remaining = loadJournal().filter((e) => e.id !== entry.id);
        saveJournal(remaining);
        renderJournal();
      });

      li.appendChild(dateEl);
      li.appendChild(textEl);
      li.appendChild(deleteBtn);
      journalList.appendChild(li);
    });
}

saveEntryBtn.addEventListener("click", () => {
  const text = journalInput.value.trim();
  if (!text) return;
  const entries = loadJournal();
  entries.push({ id: Date.now(), text, date: new Date().toISOString() });
  saveJournal(entries);
  journalInput.value = "";
  renderJournal();
});

renderJournal();

// ---- Light One: candle wall (localStorage + starter lights) ----
const CANDLE_KEY = "stillhere.candles";
const STARTER_CANDLES = [
  "for the version of you who kept going anyway",
  "for someone learning how to rest",
  "for a morning that doesn't feel this heavy",
  "for whoever needs to hear it isn't forever"
];

const candleForm = document.getElementById("candleForm");
const candleInput = document.getElementById("candleInput");
const candleWall = document.getElementById("candleWall");

function loadCandles() {
  try {
    const stored = JSON.parse(localStorage.getItem(CANDLE_KEY));
    if (stored && stored.length) return stored;
  } catch {
    // ignore, fall through to starter set
  }
  return STARTER_CANDLES.slice();
}

function saveCandles(candles) {
  localStorage.setItem(CANDLE_KEY, JSON.stringify(candles));
}

function renderCandles() {
  const candles = loadCandles();
  candleWall.innerHTML = "";
  candles.forEach((note) => {
    const div = document.createElement("div");
    div.className = "candle";
    div.innerHTML = `<svg class="flame" viewBox="0 0 40 60" aria-hidden="true" focusable="false">
      <rect x="14" y="28" width="12" height="26" rx="3" fill="rgba(238,242,248,0.1)" stroke="rgba(238,242,248,0.45)" stroke-width="1.5"/>
      <line x1="20" y1="28" x2="20" y2="20" stroke="rgba(238,242,248,0.45)" stroke-width="1.5"/>
      <path d="M20,4 C24,10 25,14 20,20 C15,14 16,10 20,4 Z" fill="currentColor"/>
    </svg><span class="candle-note"></span>`;
    div.querySelector(".candle-note").textContent = note;
    div.addEventListener("click", () => div.classList.toggle("open"));
    candleWall.appendChild(div);
  });
}

candleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const note = candleInput.value.trim();
  if (!note) return;
  const candles = loadCandles();
  candles.push(note);
  saveCandles(candles);
  candleInput.value = "";
  renderCandles();
});

renderCandles();

// ---- Words for it ----
const FEELINGS = {
  Loneliness: "The kind of quiet that isn't peaceful. Being around people and still feeling unreachable. It doesn't mean something is wrong with you — it usually means you're due for a real conversation, not more small talk. That's a fixable kind of missing.",
  Grief: "Not just for people who've died. Grief is what's left when anything you loved ends — a version of your life, a plan, a person you used to be. It doesn't move in a straight line, and it doesn't mean you're stuck. It means it mattered.",
  Drifting: "Going through the days without feeling anchored to any of them. Like you're watching your own life from slightly outside it. This one tends to lift the moment something — anything — pulls your attention all the way in again.",
  "Feeling behind": "The sense that everyone else got a head start. It's a comparison, not a fact — and comparisons are the worst measuring tool for a life that isn't a race. Most people you're measuring yourself against feel behind too.",
  Numbness: "When sadness gets so loud for so long that it goes quiet instead. It can look like calm from the outside. It usually means you've been carrying something without a place to put it down — not that you've run out of feelings for good.",
  Longing: "Wanting something you can't quite name, or can name but can't reach right now. It's proof you still want things. That's not nothing — that's the part of you that hasn't given up."
};

const wordButtonsEl = document.getElementById("wordButtons");
const wordTextEl = document.getElementById("wordText");

Object.keys(FEELINGS).forEach((feeling) => {
  const btn = document.createElement("button");
  btn.className = "word-btn";
  btn.textContent = feeling;
  btn.addEventListener("click", () => {
    document.querySelectorAll(".word-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    wordTextEl.textContent = FEELINGS[feeling];
  });
  wordButtonsEl.appendChild(btn);
});

// ---- One Small Thing ----
const SMALL_THINGS = [
  "Drink a full glass of water. Just that.",
  "Open a window, even for a minute.",
  "Write one true sentence about how you feel, then close the notebook.",
  "Text one person a single word: \"hi\".",
  "Step outside and name three things you can see.",
  "Put on the song you'd play if this feeling were a movie scene.",
  "Wash your face with cold water.",
  "Sit down for two minutes and do nothing else.",
  "Say out loud, to no one, one thing you're tired of carrying."
];

const smallThingBtn = document.getElementById("smallThingBtn");
const smallThingText = document.getElementById("smallThingText");
let lastSmallThing = -1;

smallThingBtn.addEventListener("click", () => {
  let index;
  do {
    index = Math.floor(Math.random() * SMALL_THINGS.length);
  } while (index === lastSmallThing && SMALL_THINGS.length > 1);
  lastSmallThing = index;
  smallThingText.textContent = SMALL_THINGS[index];
});
