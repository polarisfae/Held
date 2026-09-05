const SITES = {
  sad: [
    { name: "Window Swap", url: "https://window-swap.com", description: "Look out of a stranger's window somewhere else in the world. Weirdly calming." },
    { name: "r/aww", url: "https://www.reddit.com/r/aww/", description: "A steady stream of cute animals. Simple, reliable comfort." },
    { name: "The Dodo", url: "https://www.thedodo.com", description: "Heartwarming animal rescue stories, if you need a good cry that turns into a smile." },
    { name: "Good News Network", url: "https://www.goodnewsnetwork.org", description: "Only positive news. Sometimes the world needs a reminder it's not all bad." },
    { name: "Calm", url: "https://www.calm.com", description: "Guided breathing and meditation for when things feel heavy." },
    { name: "7 Cups", url: "https://www.7cups.com", description: "Free, anonymous emotional support from trained listeners, any time." },
    { name: "Unsplash", url: "https://unsplash.com", description: "Endless beautiful, free photography. Good for a quiet scroll." },
    { name: "Weavesilk", url: "https://weavesilk.com", description: "Draw glowing, symmetrical silk patterns. Oddly soothing to fidget with." }
  ],
  happy: [
    { name: "This Is Colossal", url: "https://www.thisiscolossal.com", description: "Art, design, and visual culture that's a joy to look at." },
    { name: "r/MadeMeSmile", url: "https://www.reddit.com/r/MadeMeSmile/", description: "Exactly what it says on the tin." },
    { name: "Radio Garden", url: "https://radio.garden", description: "Spin a globe and listen to live radio from anywhere on Earth." }
  ],
  bored: [
    { name: "Neal.fun", url: "https://neal.fun", description: "A collection of strange, delightful little interactive toys and games." },
    { name: "The Useless Web", url: "https://theuselessweb.com", description: "Click a button, land on a random weird corner of the internet." },
    { name: "Wikipedia Random Article", url: "https://en.wikipedia.org/wiki/Special:Random", description: "Fall down a rabbit hole you didn't plan on." }
  ],
  anxious: [
    { name: "Headspace", url: "https://www.headspace.com", description: "Short guided meditations to help settle a racing mind." },
    { name: "MyNoise", url: "https://mynoise.net", description: "Customizable ambient soundscapes for focus or calm." },
    { name: "Do Nothing for 2 Minutes", url: "https://www.donothingfor2minutes.com", description: "Forces you to sit still and just listen to waves. Harder than it sounds." }
  ],
  angry: [
    { name: "Boil the Frog", url: "https://boilthefrog.gjcam.uk", description: "A geography guessing game that quietly pulls your focus elsewhere." },
    { name: "Punch a wall (harmlessly)", url: "https://www.gamesforwork.com", description: "A pile of quick browser games to burn off some energy." },
    { name: "Just the recipe", url: "https://justtherecipe.com", description: "Strip the rambling life story out of any recipe page. Satisfying in its own petty way." }
  ],
  tired: [
    { name: "Lofi Girl", url: "https://www.youtube.com/@LofiGirl", description: "Endless lo-fi beats for doing absolutely nothing productive." },
    { name: "Marinara Timer", url: "https://www.marinaratimer.com", description: "A no-nonsense timer if you're trying to talk yourself into a short break." }
  ]
};

const MOOD_LABELS = {
  sad: "Sad",
  happy: "Happy",
  bored: "Bored",
  anxious: "Anxious",
  angry: "Angry",
  tired: "Tired"
};

const shownByMood = {};
let currentMood = null;

const moodsEl = document.getElementById("moods");
const resultEl = document.getElementById("result");
const resultMoodEl = document.getElementById("resultMood");
const siteNameEl = document.getElementById("siteName");
const siteDescriptionEl = document.getElementById("siteDescription");
const visitLinkEl = document.getElementById("visitLink");
const newOneBtn = document.getElementById("newOneBtn");

Object.keys(MOOD_LABELS).forEach((mood) => {
  const btn = document.createElement("button");
  btn.className = "mood-btn";
  btn.textContent = MOOD_LABELS[mood];
  btn.addEventListener("click", () => selectMood(mood, btn));
  moodsEl.appendChild(btn);
});

function selectMood(mood, btn) {
  currentMood = mood;
  document.querySelectorAll(".mood-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  showRecommendation(mood);
}

function showRecommendation(mood) {
  const pool = SITES[mood];
  if (!shownByMood[mood] || shownByMood[mood].length >= pool.length) {
    shownByMood[mood] = [];
  }

  const remaining = pool
    .map((_, i) => i)
    .filter((i) => !shownByMood[mood].includes(i));

  const pickIndex = remaining[Math.floor(Math.random() * remaining.length)];
  shownByMood[mood].push(pickIndex);

  const site = pool[pickIndex];
  resultMoodEl.textContent = `Feeling ${MOOD_LABELS[mood].toLowerCase()}`;
  siteNameEl.textContent = site.name;
  siteDescriptionEl.textContent = site.description;
  visitLinkEl.href = site.url;
  resultEl.hidden = false;
}

newOneBtn.addEventListener("click", () => {
  if (currentMood) showRecommendation(currentMood);
});
