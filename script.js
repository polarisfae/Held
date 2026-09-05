// ---- Say It: private journal (localStorage only) ----
const JOURNAL_KEY = "stillhere.journal";
const journalInput = document.getElementById("journalInput");
const saveEntryBtn = document.getElementById("saveEntryBtn");
const exportJournalBtn = document.getElementById("exportJournalBtn");
const journalList = document.getElementById("journalList");
const saveConfirmation = document.getElementById("saveConfirmation");
let saveConfirmationTimeout;

function showSaveConfirmation(message = "Saved.", isWarning = false) {
  clearTimeout(saveConfirmationTimeout);
  saveConfirmation.textContent = message;
  saveConfirmation.classList.toggle("warning", isWarning);
  saveConfirmation.classList.add("visible");
  saveConfirmationTimeout = setTimeout(() => {
    saveConfirmation.classList.remove("visible");
  }, isWarning ? 5000 : 2200);
}

function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY)) || [];
  } catch {
    return [];
  }
}

function saveJournal(entries) {
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
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
      deleteBtn.setAttribute("aria-label", `Remove entry from ${dateEl.textContent}`);
      let confirmTimeout;
      deleteBtn.addEventListener("click", () => {
        if (deleteBtn.dataset.confirming !== "true") {
          deleteBtn.dataset.confirming = "true";
          deleteBtn.textContent = "sure?";
          deleteBtn.setAttribute("aria-label", `Confirm removing entry from ${dateEl.textContent}`);
          confirmTimeout = setTimeout(() => {
            deleteBtn.dataset.confirming = "false";
            deleteBtn.textContent = "remove";
            deleteBtn.setAttribute("aria-label", `Remove entry from ${dateEl.textContent}`);
          }, 3000);
          return;
        }
        clearTimeout(confirmTimeout);
        const remaining = loadJournal().filter((e) => e.id !== entry.id);
        saveJournal(remaining);
        renderJournal();
        journalInput.focus();
      });

      li.appendChild(dateEl);
      li.appendChild(textEl);
      li.appendChild(deleteBtn);
      journalList.appendChild(li);
    });
  exportJournalBtn.hidden = entries.length === 0;
}

saveEntryBtn.addEventListener("click", () => {
  const text = journalInput.value.trim();
  if (!text) return;
  const entries = loadJournal();
  entries.push({ id: Date.now(), text, date: new Date().toISOString() });
  const success = saveJournal(entries);
  if (!success) {
    showSaveConfirmation("Couldn't save — this browser may be blocking storage for this site. Your words are still here, but copy them somewhere safe before leaving the page.", true);
    return;
  }
  journalInput.value = "";
  renderJournal();
  showSaveConfirmation();
});

exportJournalBtn.addEventListener("click", () => {
  const entries = loadJournal();
  if (!entries.length) return;
  const text = entries
    .map((entry) => `${new Date(entry.date).toLocaleString()}\n${entry.text}`)
    .join("\n\n---\n\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "held-journal.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

renderJournal();

// ---- Light One: candle wall (localStorage + starter lights) ----
const CANDLE_KEY = "stillhere.candles";
const STARTER_CANDLES = [
  "for the version of you who kept going anyway",
  "for someone learning how to rest",
  "for a morning that doesn't feel this heavy",
  "for whoever needs to hear it isn't forever",
  "for the small thing that got you through today",
  "for the you that hasn't shown up yet, but will"
];

const candleForm = document.getElementById("candleForm");
const candleInput = document.getElementById("candleInput");
const candleWall = document.getElementById("candleWall");
const candleCharCount = document.getElementById("candleCharCount");

function updateCandleCharCount() {
  const remaining = candleInput.maxLength - candleInput.value.length;
  candleCharCount.textContent = `${remaining} characters left`;
  candleCharCount.classList.remove("warning");
}

candleInput.addEventListener("input", updateCandleCharCount);
updateCandleCharCount();

function makeCandleId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadCandles() {
  let candles = null;
  try {
    const stored = JSON.parse(localStorage.getItem(CANDLE_KEY));
    if (stored && stored.length) candles = stored;
  } catch {
    // ignore, fall through to starter set
  }
  if (!candles) {
    candles = STARTER_CANDLES.map((text) => ({ id: makeCandleId(), text }));
    saveCandles(candles);
    return candles;
  }
  // migrate older localStorage data (a plain array of strings) to {id, text}
  if (typeof candles[0] === "string") {
    candles = candles.map((text) => ({ id: makeCandleId(), text }));
    saveCandles(candles);
  }
  return candles;
}

function saveCandles(candles) {
  try {
    localStorage.setItem(CANDLE_KEY, JSON.stringify(candles));
    return true;
  } catch {
    return false;
  }
}

const openCandleIds = new Set();

function renderCandles() {
  const candles = loadCandles();
  candleWall.innerHTML = "";
  candles.forEach(({ id, text: note }) => {
    const noteId = `candle-note-${id}`;
    const isOpen = openCandleIds.has(id);

    const wrapper = document.createElement("div");
    wrapper.className = isOpen ? "candle open" : "candle";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "candle-toggle";
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-controls", noteId);
    toggleBtn.innerHTML = `<svg class="flame" viewBox="0 0 40 60" aria-hidden="true" focusable="false">
      <rect x="14" y="28" width="12" height="26" rx="3" fill="rgba(238,242,248,0.1)" stroke="rgba(238,242,248,0.45)" stroke-width="1.5"/>
      <line x1="20" y1="28" x2="20" y2="20" stroke="rgba(238,242,248,0.45)" stroke-width="1.5"/>
      <path d="M20,4 C24,10 25,14 20,20 C15,14 16,10 20,4 Z" fill="currentColor"/>
    </svg>`;
    const noteEl = document.createElement("div");
    noteEl.className = "candle-note";
    noteEl.id = noteId;

    const noteText = document.createElement("p");
    noteText.className = "candle-note-text";
    noteText.textContent = note;

    const letGoBtn = document.createElement("button");
    letGoBtn.type = "button";
    letGoBtn.className = "let-go-btn";
    letGoBtn.textContent = "let it go";
    letGoBtn.tabIndex = isOpen ? 0 : -1;

    toggleBtn.addEventListener("click", () => {
      const nowOpen = wrapper.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(nowOpen));
      letGoBtn.tabIndex = nowOpen ? 0 : -1;
      if (nowOpen) {
        openCandleIds.add(id);
      } else {
        openCandleIds.delete(id);
      }
    });

    letGoBtn.addEventListener("click", () => {
      const current = loadCandles().filter((c) => c.id !== id);
      saveCandles(current);
      openCandleIds.delete(id);
      renderCandles();
      candleInput.focus();
    });

    noteEl.appendChild(noteText);
    noteEl.appendChild(letGoBtn);
    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(noteEl);
    candleWall.appendChild(wrapper);
  });
}

candleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const note = candleInput.value.trim();
  if (!note) return;
  const candles = loadCandles();
  candles.push({ id: makeCandleId(), text: note });
  const success = saveCandles(candles);
  if (!success) {
    candleCharCount.textContent = "Couldn't light it — this browser may be blocking storage for this site.";
    candleCharCount.classList.add("warning");
    return;
  }
  candleInput.value = "";
  updateCandleCharCount();
  renderCandles();
});

renderCandles();

// ---- Words for it ----
const FEELINGS = {
  Loneliness: "The kind of quiet that isn't peaceful. Being around people and still feeling unreachable. Nothing is wrong with you for feeling it — you're likely just overdue for one honest conversation instead of another round of small talk. This kind of missing has a fix.",
  Grief: "Not just for people who've died. Grief is what's left when anything you loved ends — a version of your life, a plan, a person you used to be. It doesn't move in a straight line, and it doesn't mean you're stuck. It means it mattered.",
  Drifting: "Going through the days without feeling anchored to any of them. Like you're watching your own life from slightly outside it. This one tends to lift the moment something — anything — pulls your attention all the way in again.",
  "Feeling behind": "The sense that everyone else got a head start. It's a comparison, not a fact — and comparisons are the worst measuring tool for a life that isn't a race. Most people you're measuring yourself against feel behind too.",
  Numbness: "When sadness gets so loud for so long that it goes quiet instead. It can look like calm from the outside. It usually means you've been carrying something without a place to put it down — not that you've run out of feelings for good.",
  Longing: "Wanting something you can't quite name, or can name but can't reach right now. It's proof you still want things, which isn't nothing. It's the part of you that hasn't given up.",
  Overwhelm: "When there's no single problem to point at, just too many small ones stacked at once. It's not that you're fragile — it's that a normal amount of weight becomes a lot when there's nowhere to set any of it down for a minute.",
  Emptiness: "The absence of feeling, rather than a feeling itself. It's disorienting because there's nothing to point to. Think of it less as a closed door and more as a held breath — it doesn't stay held forever.",
  Shame: "The belief that the problem isn't what you did, but what you are. It's almost always louder than the truth and quieter than it deserves to be challenged. Most of what shame tells you doesn't survive being said out loud to someone safe.",
  "Losing hope": "When it stops feeling worth it to picture things getting better. That's the feeling talking, not a forecast — hope has a way of returning in small, unannounced amounts, usually before you've decided to let it back in."
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
  "Say out loud, to no one, one thing you're tired of carrying.",
  "Stretch your arms above your head and hold it for ten seconds.",
  "Make your bed, even if it's the only thing you do today.",
  "Look at one old photo that makes you feel something good.",
  "Write down tomorrow's date and one small thing you could do then.",
  "Eat something that isn't out of habit — actually taste it.",
  "Unclench your jaw. Drop your shoulders. Just once."
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

// ---- Clear everything ----
const clearAllBtn = document.getElementById("clearAllBtn");
let clearAllTimeout;

clearAllBtn.addEventListener("click", () => {
  if (clearAllBtn.dataset.confirming !== "true") {
    clearAllBtn.dataset.confirming = "true";
    clearAllBtn.textContent = "Click again to permanently clear your journal and candles";
    clearAllTimeout = setTimeout(() => {
      clearAllBtn.dataset.confirming = "false";
      clearAllBtn.textContent = "Clear everything I've saved on this device";
    }, 4000);
    return;
  }
  clearTimeout(clearAllTimeout);
  try {
    localStorage.removeItem(JOURNAL_KEY);
    localStorage.removeItem(CANDLE_KEY);
  } catch {
    // if storage is blocked, there's nothing saved to clear
  }
  renderJournal();
  renderCandles();
  clearAllBtn.dataset.confirming = "false";
  clearAllBtn.textContent = "Cleared.";
  setTimeout(() => {
    clearAllBtn.textContent = "Clear everything I've saved on this device";
  }, 3000);
});
