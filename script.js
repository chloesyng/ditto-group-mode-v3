const app = document.querySelector("#app");
let activeTimer;
let participantTimers = [];

const applicants = [
  {
    id: "jacob",
    name: "Jacob",
    photo: "assets/characters/jacob.jpg",
    photoPosition: "50% 24%",
    university: "Western University",
    major: "Film Studies",
    intention: "Open to seeing what happens",
    interests: ["night markets", "analog film", "cookouts"],
    traits: ["observant", "warm"],
    energy: "Quiet at first, playful once comfortable",
    availability: "Friday after 6:30 PM",
    colorA: "#426f83",
    goals: "Wants something that can become real, without forcing it on date one.",
    lifestyle: "Lives near campus, studies late, and prefers dates with movement over sitting across a table.",
    prompts: [
      "A good night starts with food and ends with a walk.",
      "I notice when someone makes space for quieter people.",
      "My friends say I look calm until I get competitive.",
    ],
  },
  {
    id: "olivia",
    name: "Olivia",
    photo: "assets/characters/olivia.jpg",
    photoPosition: "50% 28%",
    university: "Western University",
    major: "Interaction Design",
    intention: "A relationship",
    interests: ["sunset walks", "ceramics", "playlist swaps"],
    traits: ["curious", "direct"],
    energy: "Social, but selective with attention",
    availability: "Friday after 7 PM",
    colorA: "#805c8f",
    goals: "Looking for chemistry that feels easy in person and intentional after.",
    lifestyle: "Likes small groups, plans around creative projects, and prefers low-pressure first meetings.",
    prompts: [
      "I fall for people who ask a better second question.",
      "A perfect date has one small unpredictable thing.",
      "I will absolutely remember what song was playing.",
    ],
  },
  {
    id: "kayla",
    name: "Kayla",
    photo: "assets/characters/kayla.jpg",
    photoPosition: "50% 25%",
    university: "Western University",
    major: "Kinesiology",
    intention: "Casual dates, open to more",
    interests: ["live music", "farmers markets", "volleyball"],
    traits: ["animated", "generous"],
    energy: "High-energy connector",
    availability: "Friday after 6 PM",
    colorA: "#2a7c73",
    goals: "Wants to meet someone who can keep up without turning everything into a performance.",
    lifestyle: "Active schedule, outdoors whenever possible, and happiest when a plan has a little competition.",
    prompts: [
      "I am very easy to dare and slightly hard to impress.",
      "I like people who can be sincere without making it heavy.",
      "My ideal first date has snacks and a scoreboard.",
    ],
  },
  {
    id: "lucas",
    name: "Lucas",
    photo: "assets/characters/lucas.jpg",
    photoPosition: "50% 23%",
    university: "Western University",
    major: "Computer Science",
    intention: "A serious relationship",
    interests: ["barbecue", "strategy games", "campus trails"],
    traits: ["steady", "witty"],
    energy: "Calm center, dry humor",
    availability: "Friday after 6:30 PM",
    colorA: "#304d74",
    goals: "Open to a slow burn if the conversation feels honest.",
    lifestyle: "Prefers thoughtful plans, shared tasks, and dates where there is something to do with your hands.",
    prompts: [
      "I like when someone can disagree kindly.",
      "My underrated talent is making enough food for six.",
      "If there is a team challenge, I am pretending not to care.",
    ],
  },
  {
    id: "maya",
    name: "Maya",
    photo: "assets/characters/maya.jpg",
    photoPosition: "50% 25%",
    university: "Western University",
    major: "Political Science",
    intention: "Friendship first, open to romance",
    interests: ["student radio", "bookstores", "picnics"],
    traits: ["thoughtful", "funny"],
    energy: "Gentle conversationalist",
    availability: "Saturday afternoon",
    colorA: "#6c5a90",
    goals: "Wants chemistry to grow through conversation before labels.",
    lifestyle: "Keeps a quieter calendar and prefers intimate settings.",
    prompts: [
      "I trust people who are kind when no one is scoring it.",
      "A good question can save an awkward room.",
      "I collect tiny opinions about every cafe on campus.",
    ],
  },
  {
    id: "ethan",
    name: "Ethan",
    photo: "assets/characters/ethan.jpg",
    photoPosition: "50% 24%",
    university: "Fanshawe College",
    major: "Hospitality",
    intention: "Casual dates",
    interests: ["mixology", "arcades", "pickup soccer"],
    traits: ["bold", "spontaneous"],
    energy: "Fast-start extrovert",
    availability: "Friday after 9 PM",
    colorA: "#914e53",
    goals: "Interested in playful dates and seeing where the night goes.",
    lifestyle: "Works evenings, likes louder venues, and tends to lead quickly.",
    prompts: [
      "I can make a plan out of almost nothing.",
      "I like people who flirt back.",
      "My friends call me when the night needs momentum.",
    ],
  },
];

const groupPhotos = {
  allApplicants: "assets/groups/group-1.jpg",
  beachCookout: "assets/groups/group-2.jpg",
};

const selectedIds = ["jacob", "olivia", "kayla", "lucas"];
const selectedGroup = applicants.filter((person) => selectedIds.includes(person.id));

const romanticEligibilityPairs = [
  ["jacob", "olivia"],
  ["jacob", "kayla"],
  ["lucas", "olivia"],
  ["lucas", "kayla"],
];

const postcardSubmissions = {
  jacob: "assets/postcards/postcard-04.png",
  olivia: "assets/postcards/postcard-01.png",
  kayla: "assets/postcards/postcard-02.png",
  lucas: "assets/postcards/postcard-03.png",
};

const beachDateFlow = {
  id: "golden-hour-beach-cookout",
  title: "Golden Hour Beach Cookout",
  venue: "Dockweiler State Beach",
  environment: "beach cookout",
  startTime: "6:00 PM",
  pairings: {
    linkedDodgeball: [["jacob", "olivia"], ["lucas", "kayla"]],
    couplePhoto: [["olivia", "lucas"], ["kayla", "jacob"]],
    armWrestling: [["olivia", "lucas"], ["kayla", "jacob"]],
  },
  phases: [
    { id: "arrival", time: "6:00 PM", type: "intro", inputType: "none", shared: true },
    { id: "linked-dodgeball", time: "6:10 PM", type: "physical_task", inputType: "completion", completionLabel: "Game finished", shared: true },
    { id: "couple-photo", time: "6:40 PM", type: "competitive_task", inputType: "completion", completionLabel: "Photos taken", shared: true },
    { id: "cookout-setup", time: "7:00 PM", type: "preparation_task", inputType: "completion", completionLabel: "We're ready to grill", dependsOn: "couple-photo", shared: true, blindfoldRequired: true, blindfoldScope: "ingredient prep" },
    { id: "arm-wrestling", time: "7:20 PM", type: "competitive_task", inputType: "completion", completionLabel: "Match finished", dependsOn: "cookout-setup", shared: true },
    { id: "grilling-dinner", time: "7:25 PM", type: "free_time", inputType: "none", dependsOn: "arm-wrestling", shared: true },
    { id: "private-window", time: "8:00 PM", type: "private_window", inputType: "name", waitForAllParticipants: true, shared: false },
    { id: "final-signal", time: "8:25 PM", type: "final_signal", inputType: "name", waitForAllParticipants: true, locksAfterSubmit: true, shared: false },
    { id: "waiting", time: "8:25 PM", type: "waiting", inputType: "none", shared: false },
    { id: "midnight-reveal", time: "12:00 AM", type: "midnight_reveal", inputType: "none", shared: false },
  ],
  simulatedResults: {
    dodgeballWinner: ["jacob", "olivia"],
    couplePhotoWinner: ["olivia", "lucas"],
    armWrestlingWinner: "jacob",
    privateWindowChoices: { olivia: "jacob", kayla: "lucas", lucas: "kayla" },
    finalSignals: { olivia: "jacob", kayla: "lucas", lucas: "kayla" },
  },
};

function createLiveDateState() {
  const participantRecords = Object.fromEntries(selectedIds.map((id) => [id, {
    messages: [],
    privateWindowChoice: undefined,
    privateWindowOutcome: undefined,
    finalSignal: undefined,
    finalSignalLocked: false,
    midnightResult: undefined,
  }]));
  return {
    activeParticipantId: "jacob",
    currentPhaseId: undefined,
    simulatedTime: undefined,
    dateStarted: false,
    pairings: [],
    pairingHistory: [],
    completedTasks: [],
    dodgeballResult: undefined,
    couplePhotoResult: undefined,
    couplePhotoWinningPair: undefined,
    couplePhotoLosingPair: undefined,
    ingredientPreparationPair: undefined,
    armWrestlingResult: undefined,
    armWrestlingWinningPair: undefined,
    armWrestlingLosingPair: undefined,
    grillDutyPair: undefined,
    privateWindowResolved: false,
    finalSignalsResolved: false,
    midnightRevealGenerated: false,
    midnightResults: {},
    phaseAppended: {},
    preDateHtmlByParticipant: {},
    participants: participantRecords,
  };
}

let liveDateState = createLiveDateState();

const participantState = {
  screen: 8,
  availability: new Set(),
  uploadedPostcard: undefined,
  postcardSelection: undefined,
  arrivalState: undefined,
};

const formationPositions = {
  jacob: { x: 78, y: 24 },
  olivia: { x: 24, y: 24 },
  kayla: { x: 18, y: 72 },
  lucas: { x: 76, y: 72 },
  maya: { x: 45, y: 48 },
  ethan: { x: 92, y: 49 },
};

const formationFinalPositions = {
  jacob: { x: 33, y: 49 },
  olivia: { x: 45, y: 49 },
  kayla: { x: 57, y: 49 },
  lucas: { x: 69, y: 49 },
};

function resetTimer() {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = undefined;
  }
  participantTimers.forEach(clearTimeout);
  participantTimers = [];
}

function resetParticipantDemoState() {
  participantState.screen = 8;
  participantState.availability = new Set();
  participantState.uploadedPostcard = undefined;
  participantState.postcardSelection = undefined;
  participantState.arrivalState = undefined;
  liveDateState = createLiveDateState();
}

function resetDemo() {
  resetTimer();
  resetParticipantDemoState();
  renderLanding();
}

function jumpToLiveDate() {
  renderPhoneIntro({ jumpToLiveDate: true });
}

function ensurePrototypeDemoControls() {
  if (document.querySelector("[data-demo-controls]")) return;
  const controls = document.createElement("aside");
  controls.className = "prototype-demo-controls";
  controls.dataset.demoControls = "";
  controls.setAttribute("aria-label", "Prototype demo controls");
  controls.innerHTML = `
    <span>Demo controls</span>
    <button data-demo-action="jump-live-date">Jump to live date</button>
    <button data-demo-action="reset-demo">Reset demo</button>
  `;
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-demo-action]");
    if (!button) return;
    if (button.dataset.demoAction === "jump-live-date") jumpToLiveDate();
    if (button.dataset.demoAction === "reset-demo") resetDemo();
  });
  app.insertAdjacentElement("afterend", controls);
}

function portrait(person, className, alt = person.name) {
  return `<img class="${className}" src="${person.photo}" alt="${alt}" style="--photo-position:${person.photoPosition}">`;
}

function renderLanding() {
  resetTimer();
  app.innerHTML = `
    <section class="screen landing">
      <div class="landing-scene">
        <div class="landing-copy-block">
          <p class="eyebrow">Ditto Studio</p>
          <h1>Group Mode</h1>
          <p>four people. one plan. zero group chats.</p>
          <div class="landing-actions">
            <button class="primary-action" data-next="applications">
              Try Group Mode
              <span class="arrow" aria-hidden="true">-&gt;</span>
            </button>
            <span class="trailer-label">Watch Trailer</span>
          </div>
        </div>

        <div class="landing-pass-stack">
          <div class="pass-edge pass-edge-one"></div>
          <div class="pass-edge pass-edge-two"></div>
          <article class="landing-pass">
            <img class="landing-group-photo" src="${groupPhotos.allApplicants}" alt="Jacob, Olivia, Kayla, Lucas, Maya and Ethan together">
            <div class="landing-pass-content">
              <div>
                <p class="pass-kicker">This week</p>
                <h2>Meet the room.</h2>
              </div>
              <div class="avatar-strip" aria-label="Six applicants">
                ${applicants.map((person) => portrait(person, "pass-avatar", person.name)).join("")}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;

  app.querySelector("[data-next='applications']").addEventListener("click", renderApplications);
}

function renderApplications() {
  resetTimer();
  app.innerHTML = `
    <section class="screen studio-screen">
      <div class="studio-shell">
        <nav class="studio-nav" aria-label="Studio navigation">
          <button class="nav-button" data-back="landing">Back</button>
          <div>
            <p class="nav-kicker">Ditto Studio</p>
            <h2>Applications</h2>
          </div>
          <span class="nav-count">6 Applicants</span>
        </nav>

        <div class="studio-heading">
          <h1>Applications</h1>
          <p>6 applications ready</p>
        </div>

        <div class="application-deck">
          ${applicants.map((person, index) => `
            <button class="application-pass" data-applicant="${person.id}" style="--pass-index:${index};--delay:${index * 70}ms;--accent:${person.colorA}">
              ${portrait(person, "application-photo")}
              <span class="application-number">0${index + 1}</span>
              <span class="application-pass-copy"><strong>${person.name}</strong><small>${person.major}</small></span>
              <span class="pass-open" aria-hidden="true">&nearr;</span>
            </button>
          `).join("")}
        </div>

        <div class="studio-actions">
          <button class="primary-action studio-primary" data-next="formation">
            Generate Group
            <span class="arrow" aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </div>
      <div class="sheet-layer" aria-hidden="true"></div>
    </section>
  `;

  app.querySelector("[data-back='landing']").addEventListener("click", renderLanding);
  app.querySelector("[data-next='formation']").addEventListener("click", renderGroupFormation);
  app.querySelectorAll("[data-applicant]").forEach((card) => {
    card.addEventListener("click", () => openApplicationSheet(card.dataset.applicant));
  });
}

function openApplicationSheet(id) {
  const person = applicants.find((candidate) => candidate.id === id);
  const layer = app.querySelector(".sheet-layer");
  layer.setAttribute("aria-hidden", "false");
  layer.innerHTML = `
    <div class="sheet-backdrop" data-close-sheet></div>
    <aside class="application-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" style="--accent:${person.colorA}">
      <button class="sheet-close" aria-label="Close application" data-close-sheet>Close</button>
      <div class="sheet-pass">
        ${portrait(person, "sheet-photo")}
        <div class="sheet-identity">
          <p class="nav-kicker">Complete fictional application</p>
          <h2 id="sheet-title">${person.name}</h2>
          <p>${person.university} / ${person.major}</p>
        </div>
        <span class="sheet-number">${String(applicants.indexOf(person) + 1).padStart(2, "0")}</span>
      </div>

      <div class="sheet-row"><h3>Relationship goals</h3><p>${person.goals}</p></div>
      <div class="sheet-row"><h3>Interests</h3><div class="tag-row">${person.interests.map((interest) => `<small>${interest}</small>`).join("")}</div></div>
      <div class="sheet-row two-column">
        <div><h3>Personality</h3><p>${person.traits.join(", ")}. ${person.energy}.</p></div>
        <div><h3>Lifestyle</h3><p>${person.lifestyle}</p></div>
      </div>
      <div class="sheet-row">
        <h3>Prompt responses</h3>
        <ul class="prompt-list">${person.prompts.map((prompt) => `<li>${prompt}</li>`).join("")}</ul>
      </div>
    </aside>
  `;

  layer.querySelectorAll("[data-close-sheet]").forEach((control) => {
    control.addEventListener("click", closeApplicationSheet);
  });
}

function closeApplicationSheet() {
  const layer = app.querySelector(".sheet-layer");
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = "";
}

function renderGroupFormation() {
  resetTimer();
  app.innerHTML = `
    <section class="screen formation-screen">
      <div class="formation-shell">
        <h1>finding the right room...</h1>
        <div class="formation-visual" aria-label="Applicants moving into a group">
          <div class="formation-pass-shadow shadow-one"></div>
          <div class="formation-pass-shadow shadow-two"></div>
          ${applicants.map((person, index) => {
            const pos = formationPositions[person.id];
            const final = formationFinalPositions[person.id] || pos;
            const state = selectedIds.includes(person.id) ? "selected" : "alternate";
            return `
              <div class="formation-node ${state}" style="--x:${pos.x}%;--y:${pos.y}%;--final-x:${final.x}%;--final-y:${final.y}%;--delay:${index * 100}ms;--accent:${person.colorA}">
                ${portrait(person, "node-photo")}
                <span>${person.name}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;

  activeTimer = setTimeout(renderGroupReveal, 5600);
}

function renderGroupReveal() {
  resetTimer();
  app.innerHTML = `
    <section class="screen reveal-screen">
      <div class="reveal-shell">
        <div class="group-pass-stack">
          <div class="group-pass-edge edge-one"></div>
          <div class="group-pass-edge edge-two"></div>
          <article class="group-pass">
            <header><p>one group found</p><span>4 people</span></header>
            <div class="reveal-collage-wrap">
              <div class="group-collage group-pass-portraits">
                ${selectedGroup.map((person, index) => `<figure style="--delay:${index * 100}ms">${portrait(person, "group-portrait")}<figcaption>${person.name}</figcaption></figure>`).join("")}
              </div>
            </div>
            <footer>
              <div class="group-names">${selectedGroup.map((person) => person.name).join(" &middot; ")}</div>
              <button class="primary-action studio-primary" data-next="why">Why This Group<span class="arrow" aria-hidden="true">-&gt;</span></button>
            </footer>
          </article>
        </div>
      </div>
    </section>
  `;

  app.querySelector("[data-next='why']").addEventListener("click", renderWhyGroup);
}

function renderWhyGroup() {
  resetTimer();
  app.innerHTML = `
    <section class="screen why-screen">
      <div class="why-shell">
        <div class="why-pass-stack">
          <div class="why-pass-edge"></div>
          <article class="why-pass">
            <header>
              <h1>why this group?</h1>
              <div class="why-portraits">${selectedGroup.map((person) => portrait(person, "why-avatar", person.name)).join("")}</div>
            </header>
            <div class="reason-stack">
              <span style="--delay:120ms">the energy won't flatline</span>
              <span style="--delay:220ms">more than one spark</span>
              <span style="--delay:320ms">same wavelength, different stories</span>
            </div>
            <button class="primary-action studio-primary" data-next="date">Generate Date<span class="arrow" aria-hidden="true">-&gt;</span></button>
          </article>
        </div>
      </div>
    </section>
  `;

  app.querySelector("[data-next='date']").addEventListener("click", renderDatePlan);
}

function renderDatePlan() {
  resetTimer();
  app.innerHTML = `
    <section class="screen date-screen">
      <div class="date-shell">
        <div class="date-pass-stack">
          <div class="date-pass-edge edge-one"></div>
          <div class="date-pass-edge edge-two"></div>
          <article class="date-pass">
            <div class="date-collage-wrap">
              <div class="group-collage date-image" aria-label="Portraits of the selected group">
                ${selectedGroup.map((person) => portrait(person, "date-portrait", person.name)).join("")}
              </div>
            </div>
            <section class="date-details">
              <p class="pass-kicker">Group date</p>
              <h1>Golden Hour Beach Cookout</h1>
              <p class="date-lede">cook something, chase the sunset, see who stays by the fire.</p>
              <div class="date-meta">
                <div><span>Location</span><strong>Western University Beach</strong></div>
                <div><span>Duration</span><strong>Approximately 3 Hours</strong></div>
              </div>
              <button class="primary-action studio-primary" data-next="phone">Experience the Date<span class="arrow" aria-hidden="true">-&gt;</span></button>
            </section>
          </article>
        </div>
      </div>
    </section>
  `;

  app.querySelector("[data-next='phone']").addEventListener("click", renderPhoneIntro);
}

function renderPhoneIntro({ jumpToLiveDate: shouldJumpToLiveDate = false } = {}) {
  resetTimer();
  resetParticipantDemoState();

  app.innerHTML = `
    <section class="screen phone-screen">
      <div class="participant-demo-stage">
        <div class="phone-frame" aria-label="Jacob's phone">
          <div class="phone-hardware">
            <div class="dynamic-island"></div>
            <div class="phone-status"><span data-phone-time>8:14</span><span>66</span></div>
            <div class="messages-app">
              <header class="messages-header">
                <span class="back-chevron">&lt;</span>
                <strong class="messages-wordmark">Ditto</strong>
              </header>
              <div class="message-date">Today 8:14 PM</div>
              <div class="message-thread" data-thread>
                <div class="conversation-stack" data-conversation></div>
              </div>
            </div>
          </div>
        </div>
        <nav class="prototype-pov-switch" aria-label="Prototype participant POV" data-pov-switch hidden>
          <span>Prototype POV</span>
          ${selectedGroup.map((person) => `<button data-participant-action="switch-pov" data-pov-id="${person.id}" class="${person.id === "jacob" ? "is-active" : ""}">${person.name}</button>`).join("")}
        </nav>
      </div>
    </section>
  `;

  app.querySelector(".phone-screen").addEventListener("click", handleParticipantAction);
  if (shouldJumpToLiveDate) {
    const messageDate = app.querySelector(".message-date");
    if (messageDate) messageDate.textContent = "Friday 6:00 PM";
    beginLiveDate();
    return;
  }
  setParticipantScreen(8);
  showParticipantTyping(() => {
    appendIncoming([
      "Group date this week?",
      "4 people.",
      "One plan.",
      "Several possibilities.",
      "No group chat.",
      "No planning.",
      "You in?",
    ]);
    appendChoices([
      { label: "I'm in", action: "invitation-accept", primary: true },
      { label: "Maybe next time", action: "invitation-decline" },
    ], "invitation");
  }, 1750);
}

function scheduleParticipant(callback, delay) {
  const timer = setTimeout(callback, delay);
  participantTimers.push(timer);
  return timer;
}

function setParticipantScreen(screen) {
  participantState.screen = screen;
  const messages = app.querySelector(".messages-app");
  if (messages) messages.dataset.participantScreen = String(screen);
}

function participantConversation() {
  return app.querySelector("[data-conversation]");
}

function scrollParticipantThread(behavior = "auto") {
  const thread = app.querySelector("[data-thread]");
  if (!thread) return;
  requestAnimationFrame(() => thread.scrollTo({ top: thread.scrollHeight, behavior }));
}

function appendConversation(html) {
  const conversation = participantConversation();
  conversation.insertAdjacentHTML("beforeend", html);
  scrollParticipantThread();
  return conversation.lastElementChild;
}

function appendIncoming(paragraphs, className = "") {
  return appendConversation(`
    <div class="message-row incoming-row ${className}">
      <div class="message-bubble incoming">${paragraphs.map((line) => `<p>${line}</p>`).join("")}</div>
    </div>
  `);
}

function appendOutgoing(text) {
  return appendConversation(`
    <div class="message-row outgoing-row">
      <div class="message-bubble outgoing"><p>${escapeHtml(text)}</p></div>
    </div>
  `);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  })[character]);
}

function appendChoices(choices, id) {
  return appendConversation(`
    <div class="message-row participant-control-row" data-control="${id}">
      <div class="message-actions">
        ${choices.map((choice) => `<button class="message-action ${choice.primary ? "primary" : "secondary"}" data-participant-action="${choice.action}">${choice.label}</button>`).join("")}
      </div>
    </div>
  `);
}

function appendTimeDivider(label) {
  return appendConversation(`<div class="conversation-time-jump"><span>${label}</span></div>`);
}

function showParticipantTyping(callback, delay = 720) {
  const marker = appendConversation(`
    <div class="message-row incoming-row participant-typing-row">
      <div class="typing-indicator" aria-label="Ditto is typing"><i></i><i></i><i></i></div>
    </div>
  `);
  scheduleParticipant(() => {
    marker.remove();
    callback();
  }, delay);
}

function completeControl(id) {
  const controls = [...app.querySelectorAll(`[data-control='${id}']`)];
  const control = controls.find((item) => !item.classList.contains("is-complete")) || controls[controls.length - 1];
  if (!control) return;
  control.classList.add("is-complete");
  control.querySelectorAll("button, input, select, textarea").forEach((item) => { item.disabled = true; });
}

function isMutuallyEligible(firstId, secondId) {
  return romanticEligibilityPairs.some(([first, second]) => (
    (first === firstId && second === secondId) ||
    (first === secondId && second === firstId)
  ));
}

function personById(id) {
  return applicants.find((person) => person.id === id);
}

function eligiblePeopleFor(participantId) {
  return selectedGroup.filter((person) => person.id !== participantId && isMutuallyEligible(participantId, person.id));
}

function pairIncludes(pair, firstId, secondId) {
  return pair.includes(firstId) && pair.includes(secondId);
}

function pairingConfigurationIsValid(configuration) {
  const ids = configuration.flat();
  return ids.length === selectedIds.length && new Set(ids).size === selectedIds.length && configuration.every(([first, second]) => isMutuallyEligible(first, second));
}

function validPairingConfigurations() {
  const candidates = [
    [["jacob", "olivia"], ["kayla", "lucas"]],
    [["jacob", "kayla"], ["olivia", "lucas"]],
  ];
  return candidates.filter(pairingConfigurationIsValid);
}

function pairLabel(pair) {
  return pair.map((id) => personById(id).name).join(" + ");
}

function handleParticipantAction(event) {
  const actionButton = event.target.closest("[data-participant-action]");
  if (!actionButton || actionButton.disabled) return;

  const action = actionButton.dataset.participantAction;
  const actions = {
    "invitation-accept": acceptInvitation,
    "invitation-decline": () => declineParticipantFlow("invitation"),
    "group-browse-accept": acceptGroupBrowse,
    "group-browse-decline": () => declineParticipantFlow("group-browser"),
    "submit-availability": submitAvailability,
    "view-experience-details": showExperienceDetails,
    "add-calendar": simulateCalendarAdd,
    "experience-got-it": startPostcardPick,
    "upload-postcard": simulatePostcardUpload,
    "submit-postcard": submitPostcard,
    "select-postcard": selectPostcard,
    "confirm-postcard": confirmPostcardSelection,
    "reminder-details": showReminderDetails,
    "reminder-got-it": showDateStart,
    "arrival-complete": confirmArrival,
    "arrival-missing": checkMissingParticipant,
    "arrival-complete-after-check": confirmArrivalAfterCheck,
    "game-finished": finishLinkedDodgeball,
    "photos-taken": finishCouplePhotoChallenge,
    "setup-complete": finishCookoutSetup,
    "match-finished": finishArmWrestling,
    "private-window-submit": submitPrivateWindowName,
    "final-signal-submit": submitFinalSignalName,
    "fast-forward-midnight": fastForwardToMidnight,
    "switch-pov": switchParticipantPov,
  };

  if (actions[action]) actions[action](actionButton);
}

function declineParticipantFlow(controlId) {
  completeControl(controlId);
  appendOutgoing("Maybe next time");
  showParticipantTyping(() => appendIncoming([
    "No pressure.",
    "You're back in the matching pool.",
  ]));
}

function acceptInvitation() {
  completeControl("invitation");
  appendOutgoing("I'm in");
  setParticipantScreen(9);
  showParticipantTyping(() => {
    appendIncoming(["I found a group I think you'll genuinely enjoy meeting."]);
    renderMeetYourGroup();
  });
}

function renderMeetYourGroup() {
  const groupOrder = selectedGroup.slice().sort((first, second) => {
    if (first.id === "jacob") return 1;
    if (second.id === "jacob") return -1;
    return 0;
  });

  appendIncoming([
    "Meet your group.",
    "Take a look around.",
    "No pressure.",
    "You'll decide in a moment if this feels like your kind of night.",
  ]);

  appendConversation(`
    <div class="message-row attachment-row">
      <div class="participant-browser" aria-label="Meet your group">
        ${groupOrder.map((person, index) => `
          <article class="participant-profile-card ${person.id === "jacob" ? "is-self" : ""}" style="--delay:${index * 90}ms">
            ${portrait(person, "participant-profile-photo")}
            <div class="participant-profile-copy">
              <div class="participant-profile-heading"><strong>${person.name}</strong>${person.id === "jacob" ? "<span>You</span>" : ""}</div>
              <small>${person.university}</small>
              <small>${person.major}</small>
              <div class="participant-interest-list">${person.interests.map((interest) => `<span>${interest}</span>`).join("")}</div>
              <p>${person.energy}.</p>
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `);

  appendChoices([
    { label: "I'm down", action: "group-browse-accept", primary: true },
    { label: "Maybe next time", action: "group-browse-decline" },
  ], "group-browser");
}

function acceptGroupBrowse() {
  completeControl("group-browser");
  appendOutgoing("I'm down");
  setParticipantScreen(11);
  showParticipantTyping(() => {
    beginGroupLockIn();
  });
}

function beginGroupLockIn() {
  appendIncoming(["Awesome.", "I'm checking with everyone else.", "Sit tight."]);
  const status = appendConversation(`
      <div class="message-row attachment-row">
        <div class="confirmation-progress" data-confirmation-progress>
          <div class="confirmation-line is-complete">Jacob confirmed</div>
          <div class="confirmation-line" data-confirmation="olivia">Checking with Olivia...</div>
          <div class="confirmation-line" data-confirmation="kayla">Waiting for Kayla</div>
          <div class="confirmation-line" data-confirmation="lucas">Waiting for one more person</div>
        </div>
      </div>
    `);
  const update = (id, text, delay) => scheduleParticipant(() => {
    const line = status.querySelector(`[data-confirmation='${id}']`);
    line.textContent = text;
    line.classList.add("is-complete");
    scrollParticipantThread();
  }, delay);
  update("olivia", "Olivia confirmed", 650);
  update("kayla", "Kayla confirmed", 1250);
  update("lucas", "Lucas confirmed", 1950);
  scheduleParticipant(() => {
    appendIncoming(["Everyone's in.", "Your group is locked."]);
    renderAvailability();
  }, 2550);
}

function renderAvailability() {
  setParticipantScreen(12);
  showParticipantTyping(() => {
    appendIncoming([
      "Now let's find a time that works for everyone.",
      "Choose every time you're available this week.",
    ]);
    const slots = ["Thursday Evening", "Friday Evening", "Saturday Afternoon", "Saturday Evening", "Sunday Afternoon"];
    appendConversation(`
      <div class="message-row attachment-row" data-control="availability">
        <div class="availability-picker">
          <div class="availability-options">
            ${slots.map((slot) => `
              <label class="availability-option">
                <input type="checkbox" value="${slot}">
                <span>${slot}</span>
              </label>
            `).join("")}
          </div>
          <button class="inline-primary" data-participant-action="submit-availability" disabled>Submit Availability</button>
        </div>
      </div>
    `);
    const picker = app.querySelector("[data-control='availability']");
    picker.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => {
      participantState.availability = new Set([...picker.querySelectorAll("input:checked")].map((item) => item.value));
      picker.querySelector("[data-participant-action='submit-availability']").disabled = participantState.availability.size === 0;
    }));
  });
}

function submitAvailability() {
  if (participantState.availability.size === 0) return;
  completeControl("availability");
  appendOutgoing([...participantState.availability].join(" · "));
  renderPlanningProgress();
}

function renderPlanningProgress() {
  setParticipantScreen(13);
  showParticipantTyping(() => {
    appendIncoming(["Perfect.", "Give me a minute.", "I'm putting everything together."]);
    const steps = ["Everyone confirmed", "Availability aligned", "Weather checked", "Local events", "Best locations", "Group preferences", "Logistics", "Experience ready"];
    const progress = appendConversation(`
      <div class="message-row attachment-row">
        <div class="planning-progress" data-planning-progress>
          ${steps.map((step) => `<div class="planning-step">${step}</div>`).join("")}
        </div>
      </div>
    `);
    steps.forEach((step, index) => scheduleParticipant(() => {
      progress.querySelectorAll(".planning-step")[index].classList.add("is-complete");
      scrollParticipantThread();
      if (index === steps.length - 1) scheduleParticipant(renderExperienceReveal, 800);
    }, 350 + index * 300));
  });
}

function renderExperienceReveal() {
  setParticipantScreen(14);
  showParticipantTyping(() => {
    appendIncoming(["Okay.", "I found your plan."]);
    appendConversation(`
      <div class="message-row attachment-row">
        <article class="participant-experience-card" data-experience-card>
          <img src="${groupPhotos.beachCookout}" alt="Golden Hour Beach Cookout at sunset">
          <div class="experience-card-copy">
            <p class="participant-kicker">Friday, July 17 · 6:00 PM</p>
            <h2>Golden Hour Beach Cookout</h2>
            <p>Cook together, compete a little, then stay for the sunset.</p>
            <span>Dockweiler State Beach</span>
            <button class="inline-primary" data-participant-action="view-experience-details">View Details</button>
          </div>
        </article>
      </div>
    `);
  });
}

function showExperienceDetails() {
  setParticipantScreen(15);
  const card = app.querySelector("[data-experience-card]");
  card.classList.add("is-expanded");
  card.innerHTML = `
    <img src="${groupPhotos.beachCookout}" alt="Golden Hour Beach Cookout at sunset">
    <div class="experience-card-copy experience-details-copy">
      <p class="participant-kicker">Friday, July 17</p>
      <h2>Golden Hour Beach Cookout</h2>
      <div class="experience-facts">
        <div><span>Time</span><strong>6:00 PM–8:30 PM</strong></div>
        <div><span>Meet</span><strong>Dockweiler State Beach</strong></div>
        <div><span>Estimated cost</span><strong>$15–$20</strong></div>
        <div><span>Weather</span><strong>22°C and clear</strong></div>
        <div><span>Wear</span><strong>Something comfortable you can move in</strong></div>
        <div><span>Bring</span><strong>A light hoodie and water</strong></div>
        <div><span>Getting there</span><strong>Rideshare from UCLA · allow 35–45 minutes</strong></div>
      </div>
      <div class="experience-preview"><span>Meet the group</span><span>Create something together</span><span>Team challenge</span><span>Food and sunset</span><span>Final group moment</span></div>
      <div class="calendar-status" aria-live="polite"></div>
      <div class="inline-action-pair">
        <button class="inline-primary" data-participant-action="add-calendar">Add to Calendar</button>
        <button class="inline-secondary" data-participant-action="experience-got-it">Got it</button>
      </div>
    </div>
  `;
  scrollParticipantThread();
}

function simulateCalendarAdd(button) {
  button.disabled = true;
  button.textContent = "Added to Calendar";
  const status = app.querySelector(".calendar-status");
  status.textContent = "Calendar updated for Friday at 6:00 PM.";
}

function startPostcardPick(button) {
  button.closest(".inline-action-pair").querySelectorAll("button").forEach((item) => { item.disabled = true; });
  appendOutgoing("Got it");
  setParticipantScreen(16);
  showParticipantTyping(() => {
    appendIncoming([
      "That's everything you need for now.",
      "I'll handle the rest when the date begins.",
      "One thing before the date.",
      "Send me a photo of a place, object, or moment that means something to you.",
      "Nothing too serious.",
      "Just something with a story behind it.",
    ]);
    appendConversation(`
      <div class="message-row attachment-row" data-control="postcard-upload">
        <div class="postcard-upload-card">
          <div class="postcard-preview" data-postcard-preview><span>Your photo stays private.</span></div>
          <input class="postcard-caption" aria-label="Optional postcard caption" maxlength="80" placeholder="Optional short caption">
          <p>Ditto may use the photo anonymously during the date.</p>
          <div class="inline-action-pair">
            <button class="inline-secondary" data-participant-action="upload-postcard">Upload Photo</button>
            <button class="inline-primary" data-participant-action="submit-postcard" disabled>Submit Privately</button>
          </div>
        </div>
      </div>
    `);
  });
}

function simulatePostcardUpload() {
  participantState.uploadedPostcard = postcardSubmissions.jacob;
  const preview = app.querySelector("[data-postcard-preview]");
  preview.innerHTML = `<img src="${participantState.uploadedPostcard}" alt="Jacob's private postcard preview">`;
  app.querySelector("[data-participant-action='submit-postcard']").disabled = false;
  scrollParticipantThread();
}

function submitPostcard() {
  if (!participantState.uploadedPostcard) return;
  const upload = app.querySelector("[data-control='postcard-upload']");
  const caption = upload.querySelector(".postcard-caption").value.trim();
  completeControl("postcard-upload");
  const sent = appendConversation(`
    <div class="message-row outgoing-row">
      <div class="sent-postcard">
        <img src="${participantState.uploadedPostcard}" alt="Your private postcard submission">
        ${caption ? "<p data-sent-caption></p>" : ""}
        <span>Sent privately</span>
      </div>
    </div>
  `);
  if (caption) sent.querySelector("[data-sent-caption]").textContent = caption;
  showParticipantTyping(() => {
    appendIncoming(["Everyone sent something in.", "Pick the one you're most curious about.", "Don't overthink it."]);
    renderEligiblePostcards();
  }, 950);
}

function renderEligiblePostcards() {
  const eligible = selectedGroup.filter((person) => person.id !== "jacob" && isMutuallyEligible("jacob", person.id));
  appendConversation(`
    <div class="message-row attachment-row" data-control="postcard-selection">
      <div class="anonymous-postcard-picker">
        <div class="anonymous-postcards">
          ${eligible.map((person, index) => `
            <button class="anonymous-postcard" aria-label="Anonymous postcard ${index + 1}" aria-pressed="false" data-participant-action="select-postcard" data-postcard-owner="${person.id}">
              <img src="${postcardSubmissions[person.id]}" alt="Anonymous postcard ${index + 1}">
              <span>Postcard ${index + 1}</span>
            </button>
          `).join("")}
        </div>
        <button class="inline-primary" data-participant-action="confirm-postcard" disabled>Pick This One</button>
      </div>
    </div>
  `);
}

function selectPostcard(button) {
  const picker = button.closest(".anonymous-postcard-picker");
  picker.querySelectorAll(".anonymous-postcard").forEach((postcard) => {
    postcard.classList.remove("is-selected");
    postcard.setAttribute("aria-pressed", "false");
  });
  button.classList.add("is-selected");
  button.setAttribute("aria-pressed", "true");
  participantState.postcardSelection = button.dataset.postcardOwner;
  picker.querySelector("[data-participant-action='confirm-postcard']").disabled = false;
}

function confirmPostcardSelection() {
  if (!participantState.postcardSelection) return;
  completeControl("postcard-selection");
  appendOutgoing("Picked one");
  showParticipantTyping(() => {
    appendIncoming(["Got it.", "You'll find out why during the date."]);
    scheduleParticipant(renderOneDayReminder, 800);
  });
}

function renderOneDayReminder() {
  setParticipantScreen(17);
  appendTimeDivider("Tomorrow · 6:00 PM");
  showParticipantTyping(() => {
    appendIncoming([
      "Tomorrow 👀",
      "Golden Hour Beach Cookout",
      "Friday at 6:00 PM",
      "Dockweiler State Beach",
      "Everyone's still in.",
      "Looks like 22°C and clear.",
      "Bring a light hoodie for later.",
      "I'll message you again before it starts.",
    ]);
    appendChoices([
      { label: "View Details", action: "reminder-details", primary: true },
      { label: "Got it", action: "reminder-got-it" },
    ], "reminder");
  });
}

function showReminderDetails(button) {
  button.disabled = true;
  appendConversation(`
    <div class="message-row attachment-row">
      <div class="compact-reminder-card">
        <img src="${groupPhotos.beachCookout}" alt="Golden Hour Beach Cookout">
        <div><strong>Friday · 6:00 PM</strong><span>Dockweiler State Beach</span><span>22°C and clear · Bring a light hoodie</span></div>
      </div>
    </div>
  `);
}

function showDateStart() {
  completeControl("reminder");
  appendOutgoing("Got it");
  setParticipantScreen(18);
  scheduleParticipant(() => {
    appendTimeDivider("Friday · 6:00 PM");
    showParticipantTyping(() => {
      appendIncoming([
        "You're here.",
        "Date starts now.",
        "Say hi to everyone first.",
        "I'll send the next step when you're ready.",
      ]);
      appendConversation(`
        <div class="message-row attachment-row" data-control="arrival">
          <div class="group-live-card">
            <div class="group-live-status"><i></i><span>Group Mode is live</span></div>
            <div class="message-actions">
              <button class="message-action primary" data-participant-action="arrival-complete">We're all here</button>
              <button class="message-action secondary" data-participant-action="arrival-missing">Someone's missing</button>
            </div>
          </div>
        </div>
      `);
    });
  }, 700);
}

function confirmArrival() {
  participantState.arrivalState = "complete";
  completeControl("arrival");
  appendOutgoing("We're all here");
  const live = app.querySelector(".group-live-status span");
  live.textContent = "Everyone arrived · Group Mode is live";
  appendIncoming(["Perfect.", "Take a moment and say hi."]);
  scheduleParticipant(beginLiveDate, 1250);
}

function checkMissingParticipant() {
  participantState.arrivalState = "checking";
  completeControl("arrival");
  appendOutgoing("Someone's missing");
  const live = app.querySelector(".group-live-status span");
  live.textContent = "Arrival check in progress";
  showParticipantTyping(() => {
    appendIncoming(["I'm checking in with them now.", "Give me a minute."]);
    scheduleParticipant(() => {
      appendIncoming(["Everyone's here now."]);
      appendChoices([{ label: "We're ready", action: "arrival-complete-after-check", primary: true }], "arrival-check");
    }, 1100);
  });
}

function confirmArrivalAfterCheck() {
  participantState.arrivalState = "complete";
  completeControl("arrival-check");
  appendOutgoing("We're ready");
  const live = app.querySelector(".group-live-status span");
  if (live) live.textContent = "Everyone arrived · Group Mode is live";
  scheduleParticipant(beginLiveDate, 850);
}

function liveDatePhase(id) {
  return beachDateFlow.phases.find((phase) => phase.id === id);
}

function liveDateRecord(participantId = liveDateState.activeParticipantId) {
  return liveDateState.participants[participantId];
}

function cloneDateEntry(entry) {
  return { ...entry };
}

function disabledControlHtml(html) {
  return html.replace(/<(button|input|textarea)(\s)/g, "<$1 disabled$2");
}

function renderDateEntry(entry) {
  if (entry.type === "divider") {
    return `<div class="conversation-time-jump live-date-time"><span>${escapeHtml(entry.label)}</span></div>`;
  }
  if (entry.type === "incoming") {
    return `<div class="message-row incoming-row"><div class="message-bubble incoming">${entry.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div></div>`;
  }
  if (entry.type === "outgoing") {
    return `<div class="message-row outgoing-row"><div class="message-bubble outgoing"><p>${escapeHtml(entry.text)}</p></div></div>`;
  }
  const content = entry.completed ? disabledControlHtml(entry.html) : entry.html;
  return `<div class="message-row participant-control-row live-date-control ${entry.completed ? "is-complete" : ""}" data-control="${entry.controlId}">${content}</div>`;
}

function renderActiveDateThread() {
  const participantId = liveDateState.activeParticipantId;
  const record = liveDateRecord(participantId);
  const conversation = participantConversation();
  if (!conversation || !record) return;

  conversation.innerHTML = `${liveDateState.preDateHtmlByParticipant[participantId] || ""}${record.messages.map(renderDateEntry).join("")}`;
  app.querySelectorAll("[data-pov-id]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.povId === participantId);
  });
  const header = app.querySelector(".messages-wordmark");
  if (header) header.textContent = `Ditto · ${personById(participantId).name}`;
  const phoneTime = app.querySelector("[data-phone-time]");
  if (phoneTime && liveDateState.simulatedTime) phoneTime.textContent = liveDateState.simulatedTime.replace(" PM", "").replace(" AM", "");
  scrollParticipantThread();
}

function addDateEntries(participantIds, entries) {
  participantIds.forEach((participantId) => {
    liveDateRecord(participantId).messages.push(...entries.map(cloneDateEntry));
  });
}

function addSharedDateEntries(entries) {
  addDateEntries(selectedIds, entries);
}

function incomingDateEntry(lines) {
  return { type: "incoming", lines };
}

function outgoingDateEntry(text) {
  return { type: "outgoing", text };
}

function controlDateEntry(controlId, html) {
  return { type: "control", controlId, html, completed: false };
}

function setLiveDatePhase(phaseId) {
  const phase = liveDatePhase(phaseId);
  liveDateState.currentPhaseId = phaseId;
  liveDateState.simulatedTime = phase.time;
  return phase;
}

function appendLiveDatePhase(phaseId, entries, participantIds = selectedIds) {
  if (liveDateState.phaseAppended[phaseId]) return false;
  const phase = setLiveDatePhase(phaseId);
  liveDateState.phaseAppended[phaseId] = true;
  addDateEntries(participantIds, [{ type: "divider", label: phase.time }, ...entries]);
  renderActiveDateThread();
  return true;
}

function completeLiveDateControl(controlId, participantIds = selectedIds) {
  participantIds.forEach((participantId) => {
    const entry = liveDateRecord(participantId).messages.find((item) => item.type === "control" && item.controlId === controlId);
    if (entry) entry.completed = true;
  });
}

function recordPairingPhase(phaseId, pairs, durationMinutes, details = {}) {
  liveDateState.pairings = pairs.map((pair) => [...pair]);
  liveDateState.pairingHistory.push({
    phaseId,
    pairs: pairs.map((pair) => [...pair]),
    durationMinutes,
    repeated: liveDateState.pairingHistory.some((entry) => entry.pairs.some((pastPair) => pairs.some((pair) => pairIncludes(pair, ...pastPair)))),
    ...details,
  });
}

function beginLiveDate() {
  if (liveDateState.dateStarted) return;
  liveDateState.dateStarted = true;
  liveDateState.preDateHtmlByParticipant.jacob = participantConversation().innerHTML;
  app.querySelector("[data-pov-switch]").hidden = false;
  setParticipantScreen(19);

  appendLiveDatePhase("arrival", [incomingDateEntry([
    "You're all here. Phones away for a minute.",
    "I'll step in when I'm needed.",
  ])]);
  scheduleParticipant(showLinkedDodgeball, 1200);
}

function showLinkedDodgeball() {
  recordPairingPhase("linked-dodgeball", beachDateFlow.pairings.linkedDodgeball, 30, {
    preserved: false,
    disrupted: false,
    observedBy: selectedIds,
  });
  appendLiveDatePhase("linked-dodgeball", [
    incomingDateEntry([
      "Linked dodgeball.",
      "Jacob + Olivia versus Lucas + Kayla.",
      "Each pair must stay linked for the entire game. Hold hands, link arms, or use the wrist band provided.",
      "Disconnect and the other pair gets the point.",
      "First pair to five wins.",
    ]),
    controlDateEntry("linked-dodgeball", `<div class="message-actions"><button class="message-action primary" data-participant-action="game-finished">Game finished</button></div>`),
  ]);
}

function finishLinkedDodgeball() {
  if (liveDateState.dodgeballResult) return;
  completeLiveDateControl("linked-dodgeball");
  liveDateRecord().messages.push(outgoingDateEntry("Game finished"));
  const winner = [...beachDateFlow.simulatedResults.dodgeballWinner];
  const loser = beachDateFlow.pairings.linkedDodgeball.find((pair) => !pairIncludes(pair, ...winner));
  liveDateState.dodgeballResult = { winner, loser: [...loser], score: "5–3" };
  liveDateState.completedTasks.push("linked-dodgeball");
  addSharedDateEntries([incomingDateEntry([`${pairLabel(winner)} won, 5–3.`, "Keep that energy."])]);
  renderActiveDateThread();
  scheduleParticipant(showCouplePhotoChallenge, 850);
}

function showCouplePhotoChallenge() {
  recordPairingPhase("couple-photo", beachDateFlow.pairings.couplePhoto, 20, {
    preserved: false,
    disrupted: true,
    observedBy: selectedIds,
  });
  appendLiveDatePhase("couple-photo", [
    incomingDateEntry([
      "New pairs.",
      "Olivia + Lucas and Kayla + Jacob.",
      "Each pair has eight minutes to take one photo that could convince everyone you've been dating for six months.",
      "The other pair will judge.",
      "The losing pair handles ingredient prep.",
    ]),
    controlDateEntry("couple-photo", `<div class="message-actions"><button class="message-action primary" data-participant-action="photos-taken">Photos taken</button></div>`),
  ]);
}

function finishCouplePhotoChallenge() {
  if (liveDateState.couplePhotoResult) return;
  completeLiveDateControl("couple-photo");
  liveDateRecord().messages.push(outgoingDateEntry("Photos taken"));
  const winner = [...beachDateFlow.simulatedResults.couplePhotoWinner];
  const loser = beachDateFlow.pairings.couplePhoto.find((pair) => !pairIncludes(pair, ...winner));
  liveDateState.couplePhotoResult = { winner, loser: [...loser] };
  liveDateState.couplePhotoWinningPair = winner;
  liveDateState.couplePhotoLosingPair = [...loser];
  liveDateState.ingredientPreparationPair = [...loser];
  liveDateState.completedTasks.push("couple-photo");
  addSharedDateEntries([incomingDateEntry([
    `${pairLabel(winner)} won.`,
    `${pairLabel(loser)}, ingredient prep is yours.`,
    `${pairLabel(winner)}, set up the table, drinks, plates, and barbecue area.`,
    "Grill duty is still open.",
  ])]);
  renderActiveDateThread();
  scheduleParticipant(showCookoutSetup, 850);
}

function showCookoutSetup() {
  appendLiveDatePhase("cookout-setup", [
    incomingDateEntry([
      `${pairLabel(liveDateState.ingredientPreparationPair)}, ingredient prep is yours.`,
      "One of you wears the blindfold for the prep round. The other guides them through it.",
      `${pairLabel(liveDateState.couplePhotoWinningPair)}, set up the table, drinks, plates, and barbecue area.`,
      "You have 20 minutes.",
    ]),
    controlDateEntry("cookout-setup", `<div class="message-actions"><button class="message-action primary" data-participant-action="setup-complete">We're ready to grill</button></div>`),
  ]);
}

function finishCookoutSetup() {
  if (liveDateState.completedTasks.includes("cookout-setup")) return;
  completeLiveDateControl("cookout-setup");
  liveDateRecord().messages.push(outgoingDateEntry("We're ready to grill"));
  liveDateState.completedTasks.push("cookout-setup");
  renderActiveDateThread();
  scheduleParticipant(showArmWrestling, 750);
}

function showArmWrestling() {
  recordPairingPhase("arm-wrestling", beachDateFlow.pairings.armWrestling, 5, {
    preserved: true,
    disrupted: false,
    observedBy: selectedIds,
  });
  appendLiveDatePhase("arm-wrestling", [
    incomingDateEntry([
      "Grill duty is still up for grabs.",
      "Each pair, choose one person.",
      "One arm-wrestling match decides it.",
      "The losing pair handles the grill.",
    ]),
    controlDateEntry("arm-wrestling", `<div class="message-actions"><button class="message-action primary" data-participant-action="match-finished">Match finished</button></div>`),
  ]);
}

function finishArmWrestling() {
  if (liveDateState.armWrestlingResult) return;
  completeLiveDateControl("arm-wrestling");
  liveDateRecord().messages.push(outgoingDateEntry("Match finished"));
  const winnerId = beachDateFlow.simulatedResults.armWrestlingWinner;
  const winningPair = beachDateFlow.pairings.armWrestling.find((pair) => pair.includes(winnerId));
  const losingPair = beachDateFlow.pairings.armWrestling.find((pair) => !pair.includes(winnerId));
  liveDateState.armWrestlingResult = { winnerId, winningPair: [...winningPair], losingPair: [...losingPair] };
  liveDateState.armWrestlingWinningPair = [...winningPair];
  liveDateState.armWrestlingLosingPair = [...losingPair];
  liveDateState.grillDutyPair = [...losingPair];
  liveDateState.completedTasks.push("arm-wrestling");
  addSharedDateEntries([incomingDateEntry([
    `${personById(winnerId).name} took it.`,
    `${pairLabel(losingPair)}, grill duty is yours.`,
    "Everyone else: keep them company—or don't.",
  ])]);
  renderActiveDateThread();
  scheduleParticipant(showGrillingDinner, 650);
}

function showGrillingDinner() {
  appendLiveDatePhase("grilling-dinner", [incomingDateEntry([
    "Dinner's on.",
    `${pairLabel(liveDateState.grillDutyPair)}, the grill is yours.`,
    "Phones down. I'll be back later.",
  ])]);
  scheduleParticipant(showPrivateWindow, 1500);
}

function nameInputControl(controlId, action, placeholder) {
  return `<div class="private-name-prompt"><input type="text" autocomplete="off" placeholder="${placeholder}" aria-label="Send one name"><p class="inline-message-validation" aria-live="polite"></p><button class="message-action primary" data-participant-action="${action}">Send</button></div>`;
}

function showPrivateWindow() {
  if (liveDateState.phaseAppended["private-window"]) return;
  const phase = setLiveDatePhase("private-window");
  liveDateState.phaseAppended["private-window"] = true;
  selectedIds.forEach((participantId) => {
    addDateEntries([participantId], [
      { type: "divider", label: phase.time },
      incomingDateEntry([
        "Ten-minute window is open.",
        "There's someone here you want more time with.",
        "Send me their name.",
      ]),
      controlDateEntry(`private-window-${participantId}`, nameInputControl(`private-window-${participantId}`, "private-window-submit", "Type one name")),
    ]);
  });
  setParticipantScreen(29);
  renderActiveDateThread();
}

function validateParticipantName(rawValue, participantId, allowNoOne = false) {
  const normalized = rawValue.trim().replace(/\s+/g, " ").toLowerCase();
  if (!normalized) return { error: "Send me one name from tonight." };
  if (allowNoOne && normalized === "no one") return { value: "no_one", label: "No one" };
  const matches = selectedGroup.filter((person) => person.name.toLowerCase() === normalized);
  if (matches.length !== 1) return { error: "I don't recognize that name. Send me one person from tonight." };
  if (matches[0].id === participantId) return { error: "You can't choose yourself." };
  return { value: matches[0].id, label: matches[0].name };
}

function completePrivateParticipantControl(participantId) {
  completeLiveDateControl(`private-window-${participantId}`, [participantId]);
}

function simulateRemainingPrivateWindowChoices() {
  Object.entries(beachDateFlow.simulatedResults.privateWindowChoices).forEach(([participantId, choiceId]) => {
    const record = liveDateRecord(participantId);
    if (record.privateWindowChoice !== undefined) return;
    record.privateWindowChoice = choiceId;
    record.messages.push(outgoingDateEntry(personById(choiceId).name));
    completePrivateParticipantControl(participantId);
  });
}

function submitPrivateWindowName() {
  const participantId = liveDateState.activeParticipantId;
  const record = liveDateRecord(participantId);
  if (record.privateWindowChoice !== undefined) return;
  const control = app.querySelector(`[data-control='private-window-${participantId}']`);
  const result = validateParticipantName(control.querySelector("input").value, participantId);
  if (result.error) {
    control.querySelector(".inline-message-validation").textContent = result.error;
    return;
  }
  record.privateWindowChoice = result.value;
  record.messages.push(outgoingDateEntry(result.label), incomingDateEntry(["Got it. Waiting for everyone."]));
  completePrivateParticipantControl(participantId);
  simulateRemainingPrivateWindowChoices();
  renderActiveDateThread();
  if (selectedIds.every((id) => liveDateRecord(id).privateWindowChoice !== undefined)) {
    scheduleParticipant(resolvePrivateWindowChoices, 800);
  }
}

function mutualChoicePairs(choiceKey) {
  const seen = new Set();
  const pairs = [];
  selectedIds.forEach((participantId) => {
    const choiceId = liveDateRecord(participantId)[choiceKey];
    if (!choiceId || choiceId === "no_one") return;
    if (liveDateRecord(choiceId)?.[choiceKey] !== participantId) return;
    const key = [participantId, choiceId].sort().join(":");
    if (!seen.has(key)) {
      seen.add(key);
      pairs.push([participantId, choiceId]);
    }
  });
  return pairs;
}

function resolvePrivateWindowChoices() {
  if (liveDateState.privateWindowResolved) return;
  const mutualPairs = mutualChoicePairs("privateWindowChoice");
  selectedIds.forEach((participantId) => {
    const record = liveDateRecord(participantId);
    const mutualPair = mutualPairs.find((pair) => pair.includes(participantId));
    const unmatchedIncoming = selectedIds.filter((otherId) => (
      liveDateRecord(otherId).privateWindowChoice === participantId &&
      !mutualPairs.some((pair) => pairIncludes(pair, participantId, otherId))
    ));
    const lines = [];
    if (mutualPair) {
      const partnerId = mutualPair.find((id) => id !== participantId);
      lines.push(`${personById(partnerId).name} asked for ten minutes with you too.`, "Meet by the water.");
      record.privateWindowOutcome = { type: "mutual", partnerId };
    } else if (record.privateWindowChoice) {
      lines.push("Your request is staying private. No window was scheduled from it.");
      record.privateWindowOutcome = { type: "unmatched_outgoing" };
    }
    if (unmatchedIncoming.length > 0) {
      lines.push("Someone asked for ten minutes alone with you. Their name stays private tonight.");
      record.privateWindowOutcome = { ...(record.privateWindowOutcome || {}), incomingCount: unmatchedIncoming.length };
    }
    if (lines.length === 0) {
      lines.push("No private window was scheduled for you tonight.");
      record.privateWindowOutcome = { type: "none" };
    }
    record.messages.push(incomingDateEntry(lines));
  });
  liveDateState.privateWindowResolved = true;
  renderActiveDateThread();
  scheduleParticipant(showBeachFinalSignal, 1200);
}

function showBeachFinalSignal() {
  if (liveDateState.phaseAppended["final-signal"]) return;
  const phase = setLiveDatePhase("final-signal");
  liveDateState.phaseAppended["final-signal"] = true;
  selectedIds.forEach((participantId) => {
    addDateEntries([participantId], [
      { type: "divider", label: phase.time },
      incomingDateEntry([
        "Final signal.",
        "Who would you want to see again after tonight?",
        "Send me one name—or send 'no one.'",
      ]),
      controlDateEntry(`final-signal-${participantId}`, nameInputControl(`final-signal-${participantId}`, "final-signal-submit", "Type one name or no one")),
    ]);
  });
  setParticipantScreen(33);
  renderActiveDateThread();
}

function simulateRemainingFinalSignals() {
  Object.entries(beachDateFlow.simulatedResults.finalSignals).forEach(([participantId, choiceId]) => {
    const record = liveDateRecord(participantId);
    if (record.finalSignalLocked) return;
    record.finalSignal = choiceId;
    record.finalSignalLocked = true;
    record.messages.push(outgoingDateEntry(personById(choiceId).name), incomingDateEntry([
      "Locked.",
      "That's your final answer for tonight.",
      "Results arrive at 12:00 AM.",
    ]));
    completeLiveDateControl(`final-signal-${participantId}`, [participantId]);
  });
}

function submitFinalSignalName() {
  const participantId = liveDateState.activeParticipantId;
  const record = liveDateRecord(participantId);
  if (record.finalSignalLocked) return;
  const control = app.querySelector(`[data-control='final-signal-${participantId}']`);
  const result = validateParticipantName(control.querySelector("input").value, participantId, true);
  if (result.error) {
    control.querySelector(".inline-message-validation").textContent = result.error;
    return;
  }
  record.finalSignal = result.value;
  record.finalSignalLocked = true;
  record.messages.push(outgoingDateEntry(result.label), incomingDateEntry([
    "Locked.",
    "That's your final answer for tonight.",
    "Results arrive at 12:00 AM.",
  ]));
  completeLiveDateControl(`final-signal-${participantId}`, [participantId]);
  simulateRemainingFinalSignals();
  renderActiveDateThread();
  if (selectedIds.every((id) => liveDateRecord(id).finalSignalLocked)) {
    scheduleParticipant(showMidnightWaitingState, 700);
  }
}

function showMidnightWaitingState() {
  if (liveDateState.phaseAppended.waiting) return;
  setLiveDatePhase("waiting");
  liveDateState.phaseAppended.waiting = true;
  selectedIds.forEach((participantId) => {
    addDateEntries([participantId], [
      incomingDateEntry(["Your signal is locked.", "Results arrive at 12:00 AM."]),
      controlDateEntry(`midnight-fast-forward-${participantId}`, `<div class="prototype-time-control"><span>Prototype control</span><button data-participant-action="fast-forward-midnight">Fast-forward to 12:00 AM</button></div>`),
    ]);
  });
  setParticipantScreen(34);
  renderActiveDateThread();
}

function resolveMidnightResults() {
  const mutualPairs = mutualChoicePairs("finalSignal").filter(([firstId, secondId]) => isMutuallyEligible(firstId, secondId));
  selectedIds.forEach((participantId) => {
    const pair = mutualPairs.find((candidate) => candidate.includes(participantId));
    if (pair) {
      const partnerId = pair.find((id) => id !== participantId);
      liveDateState.midnightResults[participantId] = { type: "mutual", partnerId };
      liveDateRecord(participantId).midnightResult = { type: "mutual", partnerId };
      liveDateRecord(participantId).messages.push(incomingDateEntry([
        "It's mutual.",
        `You and ${personById(partnerId).name} both chose each other.`,
        "I'll take it from here.",
      ]));
    } else {
      liveDateState.midnightResults[participantId] = { type: "non_mutual" };
      liveDateRecord(participantId).midnightResult = { type: "non_mutual" };
      liveDateRecord(participantId).messages.push(incomingDateEntry([
        "No mutual signal tonight.",
        "Some connections need more than one evening.",
        "Goodnight.",
      ]));
    }
  });
}

function fastForwardToMidnight() {
  if (liveDateState.midnightRevealGenerated) return;
  selectedIds.forEach((participantId) => {
    completeLiveDateControl(`midnight-fast-forward-${participantId}`, [participantId]);
    liveDateRecord(participantId).messages.push({ type: "divider", label: "12:00 AM" });
  });
  setLiveDatePhase("midnight-reveal");
  liveDateState.midnightRevealGenerated = true;
  resolveMidnightResults();
  setParticipantScreen(35);
  renderActiveDateThread();
}

function switchParticipantPov(button) {
  if (!liveDateState.dateStarted) return;
  const participantId = button.dataset.povId;
  if (!selectedIds.includes(participantId)) return;
  liveDateState.activeParticipantId = participantId;
  renderActiveDateThread();
}

ensurePrototypeDemoControls();
renderLanding();
