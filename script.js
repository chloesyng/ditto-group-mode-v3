const app = document.querySelector("#app");
let activeTimer;
let participantTimers = [];
let participantTimerKeys = new Set();
let participantEntrySequence = 0;
let participantTimerGeneration = 0;

const MINUTES_PER_DAY = 24 * 60;
const SIMULATED_WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const AVAILABILITY_SLOTS = [
  { label: "Thursday Evening", weekday: 4, startMinute: 17 * 60, endMinute: 21 * 60 },
  { label: "Friday Evening", weekday: 5, startMinute: 17 * 60, endMinute: 21 * 60 },
  { label: "Saturday Afternoon", weekday: 6, startMinute: 13 * 60, endMinute: 17 * 60 },
  { label: "Saturday Evening", weekday: 6, startMinute: 17 * 60, endMinute: 21 * 60 },
  { label: "Sunday Afternoon", weekday: 0, startMinute: 13 * 60, endMinute: 17 * 60 },
];

function simulatedTimestamp(year, monthIndex, day, hour, minute = 0) {
  return Math.floor(Date.UTC(year, monthIndex, day, hour, minute) / 60000);
}

function createSimulatedSchedule(sessionAnchorDate, confirmedAvailability = []) {
  const anchorYear = sessionAnchorDate.getFullYear();
  const anchorMonth = sessionAnchorDate.getMonth();
  const anchorDay = sessionAnchorDate.getDate();
  const preDateStartTimestampMinutes = simulatedTimestamp(anchorYear, anchorMonth, anchorDay, 19, 58);
  const selectedSlots = AVAILABILITY_SLOTS.filter((slot) => confirmedAvailability.includes(slot.label));

  if (selectedSlots.length === 0) {
    return {
      confirmedAvailability: [],
      preDateStartTimestampMinutes,
      dayBeforeTimestampMinutes: undefined,
      liveDateTimestampMinutes: undefined,
      midnightTimestampMinutes: undefined,
    };
  }

  const anchorWeekday = sessionAnchorDate.getDay();
  const candidates = selectedSlots.map((slot) => {
    const earliestWeekday = (anchorWeekday + 7) % 7;
    const daysUntilMatch = 7 + ((slot.weekday - earliestWeekday + 7) % 7);
    const includesPreferredStart = slot.startMinute <= 18 * 60 && slot.endMinute >= 18 * 60;
    return { slot, daysUntilMatch, includesPreferredStart };
  });
  candidates.sort((left, right) => (
    left.daysUntilMatch - right.daysUntilMatch
    || Number(right.includesPreferredStart) - Number(left.includesPreferredStart)
    || left.slot.startMinute - right.slot.startMinute
  ));

  const { slot, daysUntilMatch, includesPreferredStart } = candidates[0];
  const liveStartMinute = includesPreferredStart
    ? 18 * 60
    : Math.round(((slot.startMinute + slot.endMinute) / 2) / 30) * 30;
  const liveCalendarDate = new Date(anchorYear, anchorMonth, anchorDay + daysUntilMatch);
  const liveYear = liveCalendarDate.getFullYear();
  const liveMonth = liveCalendarDate.getMonth();
  const liveDay = liveCalendarDate.getDate();
  const liveHour = Math.floor(liveStartMinute / 60);
  const liveMinute = liveStartMinute % 60;

  return {
    confirmedAvailability: selectedSlots.map((selectedSlot) => selectedSlot.label),
    preDateStartTimestampMinutes,
    dayBeforeTimestampMinutes: simulatedTimestamp(liveYear, liveMonth, liveDay - 1, 18),
    liveDateTimestampMinutes: simulatedTimestamp(liveYear, liveMonth, liveDay, liveHour, liveMinute),
    midnightTimestampMinutes: simulatedTimestamp(liveYear, liveMonth, liveDay + 1, 0),
  };
}

const sessionAnchorDate = new Date();
const simulatedSchedule = createSimulatedSchedule(sessionAnchorDate);

const simulatedTimeline = {
  currentTimestampMinutes: simulatedSchedule.preDateStartTimestampMinutes,
};

const applicants = [
  {
    id: "jacob",
    name: "Jacob",
    photo: "assets/characters/jacob.jpg",
    image: "assets/characters/jacob.jpg",
    photoPosition: "50% 24%",
    university: "UCLA",
    major: "Film, Television & Digital Media",
    age: 22,
    occupation: "Film, Television & Digital Media student",
    occupationOrStudy: "Film, Television & Digital Media student",
    school: "UCLA",
    gender: "man",
    interestedIn: ["woman"],
    relationshipIntention: "Open to seeing what happens",
    relationshipIntentions: ["long-term", "open-to-connection"],
    preferredDateCategories: ["creative", "food-and-drink", "outdoors"],
    competitiveness: 3,
    creativity: 5,
    closenessComfortLevel: "medium",
    instagramHandle: "@jacobframes",
    location: "Los Angeles, CA",
    intention: "Open to seeing what happens",
    interests: ["night markets", "analog film", "cookouts"],
    traits: ["observant", "warm"],
    personalityTraits: ["observant", "warm"],
    energy: "Quiet at first, playful once comfortable",
    socialEnergy: "medium",
    availability: "Friday after 6:30 PM",
    availabilitySlots: ["Friday Evening"],
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
    image: "assets/characters/olivia.jpg",
    photoPosition: "50% 28%",
    university: "USC",
    major: "Communication",
    age: 21,
    occupation: "Communication student",
    occupationOrStudy: "Communication student",
    school: "USC",
    gender: "woman",
    interestedIn: ["man"],
    relationshipIntention: "A relationship",
    relationshipIntentions: ["long-term"],
    preferredDateCategories: ["creative", "outdoors", "culture-and-nightlife"],
    competitiveness: 2,
    creativity: 5,
    closenessComfortLevel: "medium",
    instagramHandle: "@oliviamakes",
    location: "Los Angeles, CA",
    intention: "A relationship",
    interests: ["sunset walks", "ceramics", "playlist swaps"],
    traits: ["curious", "direct"],
    personalityTraits: ["curious", "direct"],
    energy: "Social, but selective with attention",
    socialEnergy: "medium",
    availability: "Friday after 7 PM",
    availabilitySlots: ["Friday Evening"],
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
    image: "assets/characters/kayla.jpg",
    photoPosition: "50% 25%",
    university: "Loyola Marymount University",
    major: "Marketing",
    age: 22,
    occupation: "Marketing student",
    occupationOrStudy: "Marketing student",
    school: "Loyola Marymount University",
    gender: "woman",
    interestedIn: ["man", "nonbinary"],
    relationshipIntention: "Casual dates, open to more",
    relationshipIntentions: ["casual-dating", "open-to-connection", "long-term"],
    preferredDateCategories: ["active", "food-and-drink", "culture-and-nightlife"],
    competitiveness: 5,
    creativity: 3,
    closenessComfortLevel: "high",
    instagramHandle: "@kaylaoutside",
    location: "Los Angeles, CA",
    intention: "Casual dates, open to more",
    interests: ["live music", "farmers markets", "volleyball"],
    traits: ["animated", "generous"],
    personalityTraits: ["animated", "generous"],
    energy: "High-energy connector",
    socialEnergy: "high",
    availability: "Friday after 6 PM",
    availabilitySlots: ["Friday Evening", "Saturday Evening"],
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
    image: "assets/characters/lucas.jpg",
    photoPosition: "50% 23%",
    university: "Cal State LA",
    major: "Graphic Design",
    age: 23,
    occupation: "Graphic Design student",
    occupationOrStudy: "Graphic Design student",
    school: "Cal State LA",
    gender: "man",
    interestedIn: ["woman"],
    relationshipIntention: "A serious relationship",
    relationshipIntentions: ["long-term"],
    preferredDateCategories: ["creative", "food-and-drink", "outdoors"],
    competitiveness: 3,
    creativity: 5,
    closenessComfortLevel: "medium",
    instagramHandle: "@lucasdraws",
    location: "Los Angeles, CA",
    intention: "A serious relationship",
    interests: ["barbecue", "strategy games", "campus trails"],
    traits: ["steady", "witty"],
    personalityTraits: ["steady", "witty"],
    energy: "Calm center, dry humor",
    socialEnergy: "low",
    availability: "Friday after 6:30 PM",
    availabilitySlots: ["Friday Evening"],
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
    image: "assets/characters/maya.jpg",
    photoPosition: "50% 25%",
    university: "UCLA",
    major: "Political Science",
    age: 21,
    occupation: "Political Science student",
    occupationOrStudy: "Political Science student",
    school: "UCLA",
    gender: "woman",
    interestedIn: ["man", "woman", "nonbinary"],
    relationshipIntention: "Friendship first, open to romance",
    relationshipIntentions: ["friendship-first", "long-term"],
    preferredDateCategories: ["creative", "outdoors", "culture-and-nightlife"],
    competitiveness: 1,
    creativity: 4,
    closenessComfortLevel: "low",
    instagramHandle: "@mayafrequencies",
    location: "Los Angeles, CA",
    intention: "Friendship first, open to romance",
    interests: ["student radio", "bookstores", "picnics"],
    traits: ["thoughtful", "funny"],
    personalityTraits: ["thoughtful", "funny"],
    energy: "Gentle conversationalist",
    socialEnergy: "low",
    availability: "Saturday afternoon",
    availabilitySlots: ["Saturday Afternoon", "Sunday Afternoon"],
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
    image: "assets/characters/ethan.jpg",
    photoPosition: "50% 24%",
    university: "Cal State LA",
    major: "Hospitality Management",
    age: 24,
    occupation: "Hospitality Management student and event server",
    occupationOrStudy: "Hospitality Management student and event server",
    school: "Cal State LA",
    gender: "man",
    interestedIn: ["woman", "nonbinary"],
    relationshipIntention: "Casual dates",
    relationshipIntentions: ["casual-dating", "open-to-connection"],
    preferredDateCategories: ["active", "food-and-drink", "culture-and-nightlife"],
    competitiveness: 5,
    creativity: 2,
    closenessComfortLevel: "high",
    instagramHandle: "@ethanafterhours",
    location: "Los Angeles, CA",
    intention: "Casual dates",
    interests: ["mixology", "arcades", "pickup soccer"],
    traits: ["bold", "spontaneous"],
    personalityTraits: ["bold", "spontaneous"],
    energy: "Fast-start extrovert",
    socialEnergy: "high",
    availability: "Friday after 9 PM",
    availabilitySlots: ["Friday Evening", "Saturday Evening"],
    colorA: "#914e53",
    goals: "Interested in playful dates and seeing where the night goes.",
    lifestyle: "Works evenings, likes louder venues, and tends to lead quickly.",
    prompts: [
      "I can make a plan out of almost nothing.",
      "I like people who flirt back.",
      "My friends call me when the night needs momentum.",
    ],
  },
  {
    id: "theo",
    name: "Theo",
    photo: "assets/characters/theo.jpg",
    image: "assets/characters/theo.jpg",
    photoPosition: "50% 42%",
    university: "Occidental College",
    major: "Media Arts and Culture",
    age: 20,
    occupation: "Media Arts and Culture student",
    occupationOrStudy: "Media Arts and Culture student",
    school: "Occidental College",
    gender: "man",
    interestedIn: ["woman", "nonbinary"],
    relationshipIntention: "Friendship first, open to a relationship",
    relationshipIntentions: ["friendship-first", "long-term"],
    preferredDateCategories: ["creative", "outdoors", "culture-and-nightlife"],
    competitiveness: 2,
    creativity: 5,
    closenessComfortLevel: "low",
    instagramHandle: "@theo.onfilm",
    location: "Los Angeles, CA",
    intention: "Friendship first, open to a relationship",
    interests: ["street photography", "bookstores", "picnics"],
    traits: ["gentle", "perceptive"],
    personalityTraits: ["gentle", "perceptive"],
    energy: "Reserved until there is something real to talk about",
    socialEnergy: "low",
    availability: "Saturday and Sunday afternoons",
    availabilitySlots: ["Saturday Afternoon", "Sunday Afternoon"],
    colorA: "#397b72",
    goals: "Hopes a thoughtful friendship can turn into something lasting.",
    lifestyle: "Shoots photos around Northeast LA and plans weekends around galleries and long walks.",
    prompts: [
      "I always notice the light in a room first.",
      "A quiet bookstore can be a very good date.",
      "I become competitive only when cameras are involved.",
    ],
  },
  {
    id: "marcus",
    name: "Marcus",
    photo: "assets/characters/marcus.jpg",
    image: "assets/characters/marcus.jpg",
    photoPosition: "50% 23%",
    university: "Santa Monica College",
    major: "Kinesiology",
    age: 23,
    occupation: "Kinesiology student and recreation aide",
    occupationOrStudy: "Kinesiology student and recreation aide",
    school: "Santa Monica College",
    gender: "man",
    interestedIn: ["woman", "nonbinary"],
    relationshipIntention: "Casual dating, open to more",
    relationshipIntentions: ["casual-dating", "open-to-connection"],
    preferredDateCategories: ["active", "food-and-drink", "culture-and-nightlife"],
    competitiveness: 4,
    creativity: 2,
    closenessComfortLevel: "high",
    instagramHandle: "@marcusmovesla",
    location: "Los Angeles, CA",
    intention: "Casual dating, open to more",
    interests: ["live music", "arcades", "night markets"],
    traits: ["confident", "easygoing"],
    personalityTraits: ["confident", "easygoing"],
    energy: "Quick to laugh and comfortable starting the conversation",
    socialEnergy: "high",
    availability: "Friday and Saturday evenings",
    availabilitySlots: ["Friday Evening", "Saturday Evening"],
    colorA: "#7f5a45",
    goals: "Wants chemistry without pressure and enough consistency to see where it goes.",
    lifestyle: "Works at a rec center, plays pickup basketball, and rarely turns down live music.",
    prompts: [
      "I take games seriously for exactly ten minutes.",
      "The best plans include music and food after.",
      "I am good at making a quiet table loosen up.",
    ],
  },
  {
    id: "nia",
    name: "Nia",
    photo: "assets/characters/nia.jpg",
    image: "assets/characters/nia.jpg",
    photoPosition: "50% 22%",
    university: "USC",
    major: "Urban Planning",
    age: 22,
    occupation: "Urban Planning student",
    occupationOrStudy: "Urban Planning student",
    school: "USC",
    gender: "woman",
    interestedIn: ["man", "nonbinary"],
    relationshipIntention: "Open to a relationship if it develops naturally",
    relationshipIntentions: ["open-to-connection", "long-term"],
    preferredDateCategories: ["food-and-drink", "culture-and-nightlife", "outdoors"],
    competitiveness: 3,
    creativity: 4,
    closenessComfortLevel: "medium",
    instagramHandle: "@niasideroutes",
    location: "Los Angeles, CA",
    intention: "Open to a relationship if it develops naturally",
    interests: ["night markets", "live music", "cookouts"],
    traits: ["bright", "grounded"],
    personalityTraits: ["bright", "grounded"],
    energy: "Warm group energy with an observant streak",
    socialEnergy: "high",
    availability: "Friday and Saturday evenings",
    availabilitySlots: ["Friday Evening", "Saturday Evening"],
    colorA: "#3d6f64",
    goals: "Looking for someone curious about the city and steady after the first spark.",
    lifestyle: "Maps neighborhood projects by day and spends weekends finding food stalls and small shows.",
    prompts: [
      "I can turn a walk into a neighborhood tour.",
      "I remember what everyone ordered.",
      "A shared plate is a compatibility test.",
    ],
  },
  {
    id: "sora",
    name: "Sora",
    photo: "assets/characters/sora.jpg",
    image: "assets/characters/sora.jpg",
    photoPosition: "50% 24%",
    university: "Pasadena City College",
    major: "Illustration",
    age: 21,
    occupation: "Illustration student",
    occupationOrStudy: "Illustration student",
    school: "Pasadena City College",
    gender: "woman",
    interestedIn: ["man", "nonbinary"],
    relationshipIntention: "Friendship first, looking for something real",
    relationshipIntentions: ["friendship-first", "long-term"],
    preferredDateCategories: ["creative", "outdoors", "culture-and-nightlife"],
    competitiveness: 1,
    creativity: 5,
    closenessComfortLevel: "low",
    instagramHandle: "@sorasketchbook",
    location: "Los Angeles, CA",
    intention: "Friendship first, looking for something real",
    interests: ["bookstores", "ceramics", "picnics"],
    traits: ["imaginative", "patient"],
    personalityTraits: ["imaginative", "patient"],
    energy: "Quietly playful in smaller groups",
    socialEnergy: "low",
    availability: "Saturday and Sunday afternoons",
    availabilitySlots: ["Saturday Afternoon", "Sunday Afternoon"],
    colorA: "#446f88",
    goals: "Wants a slow-building connection with someone comfortable around quiet moments.",
    lifestyle: "Draws between classes, visits ceramics studios, and keeps Sunday afternoons open.",
    prompts: [
      "I sketch people when they are not trying to pose.",
      "My perfect afternoon has shade, snacks, and no rush.",
      "I am much funnier after the second question.",
    ],
  },
  {
    id: "leila",
    name: "Leila",
    photo: "assets/characters/leila.jpg",
    image: "assets/characters/leila.jpg",
    photoPosition: "50% 26%",
    university: "Loyola Marymount University",
    major: "Business Analytics",
    age: 24,
    occupation: "Business Analytics graduate and venue coordinator",
    occupationOrStudy: "Business Analytics graduate and venue coordinator",
    school: "Loyola Marymount University",
    gender: "woman",
    interestedIn: ["man", "nonbinary"],
    relationshipIntention: "Casual dating, open to a relationship",
    relationshipIntentions: ["casual-dating", "open-to-connection"],
    preferredDateCategories: ["active", "food-and-drink", "culture-and-nightlife"],
    competitiveness: 4,
    creativity: 3,
    closenessComfortLevel: "high",
    instagramHandle: "@leilaafterfive",
    location: "Los Angeles, CA",
    intention: "Casual dating, open to a relationship",
    interests: ["arcades", "farmers markets", "live music"],
    traits: ["upbeat", "decisive"],
    personalityTraits: ["upbeat", "decisive"],
    energy: "Social and direct without needing to run the room",
    socialEnergy: "high",
    availability: "Friday and Saturday evenings",
    availabilitySlots: ["Friday Evening", "Saturday Evening"],
    colorA: "#8b5564",
    goals: "Interested in an easy first connection that can earn its way into something serious.",
    lifestyle: "Coordinates small events, loves a friendly challenge, and knows the late-night food options.",
    prompts: [
      "I will suggest the second location.",
      "Friendly competition is still competition.",
      "Good logistics are an underrated love language.",
    ],
  },
  {
    id: "avery",
    name: "Avery",
    photo: "assets/characters/avery.jpg",
    image: "assets/characters/avery.jpg",
    photoPosition: "50% 20%",
    university: "Cal State LA",
    major: "Studio Arts",
    age: 22,
    occupation: "Studio Arts student and gallery assistant",
    occupationOrStudy: "Studio Arts student and gallery assistant",
    school: "Cal State LA",
    gender: "nonbinary",
    interestedIn: ["man", "woman", "nonbinary"],
    relationshipIntention: "Friendship first, open to connection",
    relationshipIntentions: ["friendship-first", "open-to-connection", "long-term"],
    preferredDateCategories: ["creative", "outdoors", "culture-and-nightlife"],
    competitiveness: 2,
    creativity: 5,
    closenessComfortLevel: "medium",
    instagramHandle: "@averymakesroom",
    location: "Los Angeles, CA",
    intention: "Friendship first, open to connection",
    interests: ["analog film", "student radio", "bookstores"],
    traits: ["inventive", "attentive"],
    personalityTraits: ["inventive", "attentive"],
    energy: "Adaptable energy and good at drawing quieter people in",
    socialEnergy: "medium",
    availability: "Friday evenings and weekend afternoons",
    availabilitySlots: ["Friday Evening", "Saturday Afternoon", "Sunday Afternoon"],
    colorA: "#796481",
    goals: "Looking for curiosity, emotional range, and room for a friendship to become more.",
    lifestyle: "Splits time between the studio, a campus gallery, and a late-night radio slot.",
    prompts: [
      "I like people who make unusual connections.",
      "A gallery bench can be a very good conversation.",
      "I will notice the song choice.",
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

function sharedProfileValues(profiles, field) {
  if (profiles.length === 0) return [];
  return profiles[0][field].filter((value) => profiles.every((profile) => profile[field].includes(value)));
}

function highlightedProfileValues(profiles, field) {
  const membersByValue = new Map();
  profiles.forEach((profile) => {
    profile[field].forEach((value) => {
      if (!membersByValue.has(value)) membersByValue.set(value, []);
      membersByValue.get(value).push(profile.name);
    });
  });
  return [...membersByValue.entries()]
    .filter(([, members]) => members.length >= 2)
    .sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0]))
    .map(([value, members]) => ({ value, members }));
}

function relationshipIntentionsAlign(first, second) {
  return first.relationshipIntentions.some((intention) => second.relationshipIntentions.includes(intention));
}

function isFuturePairEligible(first, second) {
  return (
    first.id !== second.id
    && first.interestedIn.includes(second.gender)
    && second.interestedIn.includes(first.gender)
    && Math.abs(first.age - second.age) <= 5
    && relationshipIntentionsAlign(first, second)
  );
}

function futurePairingConfigurations(group) {
  if (group.length !== 4) return [];
  const pairingIndexes = [
    [[0, 1], [2, 3]],
    [[0, 2], [1, 3]],
    [[0, 3], [1, 2]],
  ];
  return pairingIndexes
    .map((configuration) => configuration.map(([firstIndex, secondIndex]) => [
      group[firstIndex],
      group[secondIndex],
    ]))
    .filter((configuration) => configuration.every(([first, second]) => isFuturePairEligible(first, second)));
}

function candidateGroupsFor(selectedUserId, pool = applicants) {
  const selectedUser = pool.find((profile) => profile.id === selectedUserId);
  if (!selectedUser) return [];
  const others = pool.filter((profile) => profile.id !== selectedUserId);
  const groups = [];
  for (let first = 0; first < others.length - 2; first += 1) {
    for (let second = first + 1; second < others.length - 1; second += 1) {
      for (let third = second + 1; third < others.length; third += 1) {
        groups.push([selectedUser, others[first], others[second], others[third]]);
      }
    }
  }
  return groups;
}

function socialEnergyExplanation(group) {
  const levels = group.map((profile) => profile.socialEnergy);
  const counts = levels.reduce((result, level) => ({
    ...result,
    [level]: (result[level] || 0) + 1,
  }), {});
  const description = counts.high && counts.low
    ? "Higher-energy starters are balanced by quieter anchors."
    : counts.high
      ? "The group shares an outgoing pace without relying on one person to carry it."
      : counts.low
        ? "The group is comfortable with a calmer pace and smaller conversations."
        : "The group shares a flexible, middle-energy social pace.";
  return { levels: [...new Set(levels)].sort(), description };
}

function explainCandidateGroup(group, configurations) {
  const relationshipAlignments = new Set();
  configurations.forEach((configuration) => {
    configuration.forEach((pair) => {
      const [first, second] = pair;
      first.relationshipIntentions
        .filter((intention) => second.relationshipIntentions.includes(intention))
        .forEach((intention) => relationshipAlignments.add(intention));
    });
  });
  return {
    strongestSharedInterests: highlightedProfileValues(group, "interests"),
    compatibleDatePreferences: highlightedProfileValues(group, "preferredDateCategories"),
    socialEnergyFit: socialEnergyExplanation(group),
    complementaryPersonalityTraits: group.map((profile) => ({
      participantId: profile.id,
      traits: [...profile.personalityTraits],
    })),
    relationshipIntentionAlignment: [...relationshipAlignments].sort(),
    sharedAvailability: sharedProfileValues(group, "availabilitySlots"),
    validRomanticPairingConfigurations: {
      count: configurations.length,
      configurations: configurations.map((configuration) => (
        configuration.map(([first, second]) => [first.id, second.id])
      )),
    },
  };
}

function scoreCandidateGroup(group, configurations) {
  const sharedInterests = highlightedProfileValues(group, "interests");
  const datePreferences = highlightedProfileValues(group, "preferredDateCategories");
  const energyValues = { low: 1, medium: 2, high: 3 };
  const energyScores = group.map((profile) => energyValues[profile.socialEnergy]);
  const creativityScores = group.map((profile) => profile.creativity);
  const competitivenessScores = group.map((profile) => profile.competitiveness);
  const sharedInterestScore = sharedInterests.reduce((sum, item) => sum + item.members.length - 1, 0) * 4;
  const datePreferenceScore = datePreferences.reduce((sum, item) => sum + item.members.length - 1, 0) * 3;
  const socialEnergyScore = 6 - (Math.max(...energyScores) - Math.min(...energyScores));
  const creativityBalanceScore = 6 - Math.abs(3.5 - creativityScores.reduce((sum, value) => sum + value, 0) / group.length);
  const competitivenessBalanceScore = 6 - Math.abs(3 - competitivenessScores.reduce((sum, value) => sum + value, 0) / group.length);
  const similarityScore = sharedInterests.length + datePreferences.length;
  const curiosityScore = (
    new Set(group.flatMap((profile) => profile.personalityTraits)).size
    + Math.max(...creativityScores) - Math.min(...creativityScores)
    + Math.max(...competitivenessScores) - Math.min(...competitivenessScores)
  );
  const scoreBreakdown = {
    sharedInterests: sharedInterestScore,
    datePreferences: datePreferenceScore,
    socialEnergyFit: socialEnergyScore,
    creativityBalance: creativityBalanceScore,
    competitivenessBalance: competitivenessBalanceScore,
    similarity: similarityScore,
    curiosity: curiosityScore,
    romanticOptions: configurations.length * 8,
  };
  return {
    score: Object.values(scoreBreakdown).reduce((sum, value) => sum + value, 0),
    scoreBreakdown,
  };
}

function formDeterministicGroup(selectedUserId, pool = applicants) {
  const eligibleGroups = candidateGroupsFor(selectedUserId, pool)
    .map((group) => {
      const sharedAvailability = sharedProfileValues(group, "availabilitySlots");
      const configurations = futurePairingConfigurations(group);
      if (sharedAvailability.length === 0 || configurations.length < 2) return undefined;
      const scoring = scoreCandidateGroup(group, configurations);
      return {
        group,
        configurations,
        ...scoring,
      };
    })
    .filter(Boolean)
    .sort((left, right) => (
      right.score - left.score
      || left.group.map((profile) => profile.id).sort().join(":")
        .localeCompare(right.group.map((profile) => profile.id).sort().join(":"))
    ));
  const selected = eligibleGroups[0];
  if (!selected) return undefined;
  return {
    selectedUserId,
    memberIds: selected.group.map((profile) => profile.id),
    members: selected.group.map((profile) => ({ id: profile.id, name: profile.name })),
    score: selected.score,
    scoreBreakdown: selected.scoreBreakdown,
    explanation: explainCandidateGroup(selected.group, selected.configurations),
  };
}

const founderGroupFormationExamples = ["jacob", "maya", "marcus"]
  .map((participantId) => formDeterministicGroup(participantId))
  .filter(Boolean);

window.dittoGroupFormation = Object.freeze({
  profileCount: applicants.length,
  approvedDockweilerFixtureIds: [...selectedIds],
  examples: founderGroupFormationExamples,
  formGroupForApplicant: formDeterministicGroup,
  isPairEligible: (firstId, secondId) => {
    const first = applicants.find((profile) => profile.id === firstId);
    const second = applicants.find((profile) => profile.id === secondId);
    return Boolean(first && second && isFuturePairEligible(first, second));
  },
});

const postcardSubmissions = {
  jacob: "assets/postcards/postcard-04.png",
  olivia: "assets/postcards/postcard-01.png",
  kayla: "assets/postcards/postcard-02.png",
  lucas: "assets/postcards/postcard-03.png",
};

const canonicalDemoPhotoSelections = {
  jacob: "olivia",
  olivia: "jacob",
  kayla: "lucas",
  lucas: "kayla",
};

const beachDateFlow = {
  id: "golden-hour-beach-cookout",
  title: "Golden Hour Beach Cookout",
  venue: "Dockweiler State Beach",
  environment: "beach cookout",
  pairings: {
    couplePhoto: [["olivia", "lucas"], ["kayla", "jacob"]],
    armWrestling: [["olivia", "lucas"], ["kayla", "jacob"]],
  },
  phases: [
    { id: "arrival", durationMinutes: 10, type: "intro", inputType: "none", shared: true },
    { id: "linked-dodgeball", durationMinutes: 30, type: "physical_task", inputType: "completion", completionLabel: "Game finished", shared: true },
    { id: "couple-photo", durationMinutes: 8, type: "competitive_task", inputType: "completion", completionLabel: "Photos taken", shared: true },
    { id: "cookout-setup", durationMinutes: 20, type: "preparation_task", inputType: "completion", completionLabel: "We're ready to grill", dependsOn: "couple-photo", shared: true, blindfoldRequired: true, blindfoldScope: "ingredient prep" },
    { id: "arm-wrestling", durationMinutes: 5, type: "competitive_task", inputType: "completion", completionLabel: "Match finished", dependsOn: "cookout-setup", shared: true },
    { id: "grilling-dinner", durationMinutes: 47, type: "free_time", inputType: "none", dependsOn: "arm-wrestling", shared: true },
    { id: "private-window", durationMinutes: 10, type: "private_window", inputType: "name", waitForAllParticipants: true, shared: false },
    { id: "final-signal", durationMinutes: 0, delayBeforeMinutes: 15, type: "final_signal", inputType: "name", waitForAllParticipants: true, locksAfterSubmit: true, shared: false },
    { id: "waiting", durationMinutes: 0, type: "waiting", inputType: "none", shared: false },
    { id: "midnight-reveal", durationMinutes: 0, type: "midnight_reveal", inputType: "none", shared: false },
  ],
  simulatedResults: {
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
    instagramShareChoice: undefined,
    instagramShareLocked: false,
  }]));
  return {
    activeParticipantId: "jacob",
    currentPhaseId: undefined,
    phaseStartTimes: {},
    phaseCompletionTimes: {},
    submittedPhotos: {},
    photoSelections: {},
    selectedPhotoOwnerId: undefined,
    selectedByUserId: undefined,
    firstPairing: [],
    firstPairingResolved: false,
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
  theo: { x: 8, y: 48 },
  marcus: { x: 91, y: 18 },
  nia: { x: 7, y: 18 },
  sora: { x: 35, y: 82 },
  leila: { x: 91, y: 82 },
  avery: { x: 54, y: 12 },
};

const formationFinalPositions = {
  jacob: { x: 33, y: 49 },
  olivia: { x: 45, y: 49 },
  kayla: { x: 57, y: 49 },
  lucas: { x: 69, y: 49 },
};

function resetTimer() {
  participantTimerGeneration += 1;
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = undefined;
  }
  participantTimers.forEach(clearTimeout);
  participantTimers = [];
  participantTimerKeys = new Set();
}

function resetParticipantDemoState() {
  participantState.screen = 8;
  participantState.availability = new Set();
  participantState.uploadedPostcard = undefined;
  participantState.postcardSelection = undefined;
  participantState.arrivalState = undefined;
  participantEntrySequence = 0;
  simulatedTimeline.currentTimestampMinutes = simulatedSchedule.preDateStartTimestampMinutes;
  liveDateState = createLiveDateState();
}

function resetDemo() {
  resetTimer();
  resetParticipantDemoState();
  renderLanding();
}

function jumpToLiveDate() {
  if (!Number.isFinite(simulatedSchedule.liveDateTimestampMinutes)) {
    renderPhoneIntro();
    return;
  }
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

function renderAppScreen(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  const nextScreen = template.content.firstElementChild;
  const currentScreen = app.firstElementChild;

  if (!currentScreen?.classList.contains("screen") || !nextScreen?.classList.contains("screen")) {
    app.replaceChildren(nextScreen);
    return;
  }

  currentScreen.className = nextScreen.className;
  [...currentScreen.attributes]
    .filter((attribute) => attribute.name !== "class")
    .forEach((attribute) => currentScreen.removeAttribute(attribute.name));
  [...nextScreen.attributes]
    .filter((attribute) => attribute.name !== "class")
    .forEach((attribute) => currentScreen.setAttribute(attribute.name, attribute.value));
  currentScreen.replaceChildren(...nextScreen.childNodes);
}

function renderLanding() {
  resetTimer();
  renderAppScreen(`
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
              <div class="avatar-strip" aria-label="Twelve applicants">
                ${applicants.map((person) => portrait(person, "pass-avatar", person.name)).join("")}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `);

  app.querySelector("[data-next='applications']").addEventListener("click", renderApplications);
}

function renderApplications() {
  resetTimer();
  renderAppScreen(`
    <section class="screen studio-screen">
      <div class="studio-shell">
        <nav class="studio-nav" aria-label="Studio navigation">
          <button class="nav-button" data-back="landing">Back</button>
          <div>
            <p class="nav-kicker">Ditto Studio</p>
            <h2>Applications</h2>
          </div>
          <span class="nav-count">${applicants.length} Applicants</span>
        </nav>

        <div class="studio-heading">
          <h1>Applications</h1>
          <p>${applicants.length} applications ready</p>
        </div>

        <div class="application-deck">
          ${applicants.map((person, index) => `
            <button class="application-pass" data-applicant="${person.id}" style="--pass-index:${index};--delay:${index * 70}ms;--accent:${person.colorA}">
              ${portrait(person, "application-photo")}
              <span class="application-number">${String(index + 1).padStart(2, "0")}</span>
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
  `);

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
  renderAppScreen(`
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
  `);

  activeTimer = setTimeout(renderGroupReveal, 5600);
}

function renderGroupReveal() {
  resetTimer();
  renderAppScreen(`
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
  `);

  app.querySelector("[data-next='why']").addEventListener("click", renderWhyGroup);
}

function renderWhyGroup() {
  resetTimer();
  renderAppScreen(`
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
  `);

  app.querySelector("[data-next='date']").addEventListener("click", renderDatePlan);
}

function renderDatePlan() {
  resetTimer();
  renderAppScreen(`
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
              <h1>${beachDateFlow.title}</h1>
              <p class="date-lede">cook something, chase the sunset, see who stays by the fire.</p>
              <div class="date-meta">
                <div><span>Location</span><strong>${beachDateFlow.venue}</strong></div>
                <div><span>Duration</span><strong>Approximately 3 Hours</strong></div>
              </div>
              <button class="primary-action studio-primary" data-next="phone">Experience the Date<span class="arrow" aria-hidden="true">-&gt;</span></button>
            </section>
          </article>
        </div>
      </div>
    </section>
  `);

  app.querySelector("[data-next='phone']").addEventListener("click", renderPhoneIntro);
}

function renderPhoneIntro({ jumpToLiveDate: shouldJumpToLiveDate = false } = {}) {
  resetTimer();
  resetParticipantDemoState();

  renderAppScreen(`
    <section class="screen phone-screen">
      <div class="participant-demo-stage">
        <div class="phone-frame" aria-label="Jacob's phone">
          <div class="phone-hardware">
            <div class="dynamic-island"></div>
            <div class="phone-status"><span data-phone-time>${formatSimulatedTime(simulatedTimeline.currentTimestampMinutes).replace(/ (AM|PM)$/, "")}</span><span>66</span></div>
            <div class="messages-app">
              <header class="messages-header">
                <span class="back-chevron">&lt;</span>
                <strong class="messages-wordmark">Ditto</strong>
              </header>
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
  `);

  app.querySelector(".phone-screen").addEventListener("click", handleParticipantAction);
  if (shouldJumpToLiveDate) {
    setSimulatedTime(simulatedSchedule.liveDateTimestampMinutes);
    beginLiveDate();
    return;
  }
  setParticipantScreen(8);
  appendPacedIncoming([
    ["Group date this week?"],
    ["4 people.", "One plan.", "Several possibilities."],
    ["No group chat.", "No planning."],
    ["You in?"],
  ], () => {
    appendChoices([
      { label: "I'm in", action: "invitation-accept", primary: true },
      { label: "Maybe next time", action: "invitation-decline" },
    ], "invitation");
  });
}

function scheduleParticipant(callback, delay, key) {
  if (key && participantTimerKeys.has(key)) return undefined;
  if (key) participantTimerKeys.add(key);
  const generation = participantTimerGeneration;
  const timer = setTimeout(() => {
    if (generation !== participantTimerGeneration) return;
    callback();
  }, delay);
  participantTimers.push(timer);
  return timer;
}

function nextParticipantEntryId(prefix) {
  participantEntrySequence += 1;
  return `pre-date:${prefix}:${participantEntrySequence}`;
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
  refreshSimulatedTimelineLabels();
  scrollParticipantThread();
  return conversation.lastElementChild;
}

function appendIncoming(paragraphs, className = "", timestampMinutes = simulatedTimeline.currentTimestampMinutes) {
  const entryId = nextParticipantEntryId("incoming");
  return appendConversation(`
    <div class="message-row incoming-row ${className}" data-entry-id="${entryId}" data-message-timestamp="${timestampMinutes}">
      <div class="message-bubble incoming">${paragraphs.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}<time class="live-message-time" data-message-time>${formatMessageTimestamp(timestampMinutes)}</time></div>
    </div>
  `);
}

function visibleMessageText(content) {
  const source = Array.isArray(content) ? content.join(" ") : String(content || "");
  const template = document.createElement("template");
  template.innerHTML = source;
  return (template.content.textContent || "").replace(/\s+/g, " ").trim();
}

function typingDurationMs(content) {
  const visibleText = visibleMessageText(content);
  const punctuationCount = (visibleText.match(/[.,!?;:]/g) || []).length;
  return Math.min(3200, Math.max(
    700,
    450 + visibleText.length * 18 + punctuationCount * 40,
  ));
}

function readingPauseMs(content) {
  const characterCount = visibleMessageText(content).length;
  if (characterCount <= 45) return 250;
  if (characterCount <= 140) return 375;
  return 525;
}

function appendPacedIncoming(messageGroups, onComplete) {
  let index = 0;

  const revealNextMessage = () => {
    const paragraphs = messageGroups[index];
    const reveal = () => {
      if (index > 0) advanceSimulatedTime(0.5);
      appendIncoming(paragraphs);
      index += 1;
      if (index < messageGroups.length) {
        scheduleParticipant(revealNextMessage, readingPauseMs(paragraphs));
      } else if (onComplete) {
        scheduleParticipant(onComplete, readingPauseMs(paragraphs));
      }
    };

    showParticipantTyping(reveal, paragraphs);
  };

  revealNextMessage();
}

function appendOutgoing(text, timestampMinutes = simulatedTimeline.currentTimestampMinutes) {
  const entryId = nextParticipantEntryId("outgoing");
  return appendConversation(`
    <div class="message-row outgoing-row" data-entry-id="${entryId}" data-message-timestamp="${timestampMinutes}">
      <div class="message-bubble outgoing"><p>${escapeHtml(text)}</p><time class="live-message-time" data-message-time>${formatMessageTimestamp(timestampMinutes)}</time></div>
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
  const entryId = nextParticipantEntryId(`control-${id}`);
  return appendConversation(`
    <div class="message-row participant-control-row" data-entry-id="${entryId}" data-control="${id}">
      <div class="message-actions">
        ${choices.map((choice) => `<button class="message-action ${choice.primary ? "primary" : "secondary"}" data-participant-action="${choice.action}">${choice.label}</button>`).join("")}
      </div>
    </div>
  `);
}

function appendTimeDivider(timestampMinutes = simulatedTimeline.currentTimestampMinutes) {
  const lastDivider = [...participantConversation().querySelectorAll("[data-date-separator-timestamp]")].at(-1);
  if (lastDivider && Number(lastDivider.dataset.dateSeparatorTimestamp) === timestampMinutes) return lastDivider;
  const entryId = nextParticipantEntryId("divider");
  return appendConversation(`<div class="conversation-time-jump" data-entry-id="${entryId}" data-date-separator-timestamp="${timestampMinutes}"><span>${formatRelativeDateTime(timestampMinutes)}</span></div>`);
}

function showParticipantTyping(callback, content) {
  const marker = appendConversation(`
    <div class="message-row incoming-row participant-typing-row">
      <div class="typing-indicator" aria-label="Ditto is typing"><i></i><i></i><i></i></div>
    </div>
  `);
  scheduleParticipant(() => {
    marker.remove();
    callback();
  }, typingDurationMs(content));
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

function resolveFirstPairing(selectedByUserId, selectedPhotoOwnerId) {
  if (!isMutuallyEligible(selectedByUserId, selectedPhotoOwnerId)) return false;
  const validConfiguration = validPairingConfigurations().find((configuration) => (
    configuration.some((pair) => pairIncludes(pair, selectedByUserId, selectedPhotoOwnerId))
  ));
  if (!validConfiguration) return false;

  const remainingPair = validConfiguration.find((pair) => !pairIncludes(pair, selectedByUserId, selectedPhotoOwnerId));
  liveDateState.selectedByUserId = selectedByUserId;
  liveDateState.selectedPhotoOwnerId = selectedPhotoOwnerId;
  liveDateState.firstPairing = [
    [selectedByUserId, selectedPhotoOwnerId],
    [...remainingPair],
  ];
  liveDateState.firstPairingResolved = true;
  return true;
}

function storePhotoSelection(selectedByUserId, selectedPhotoOwnerId) {
  liveDateState.photoSelections[selectedByUserId] = selectedPhotoOwnerId;
  return resolveFirstPairing(selectedByUserId, selectedPhotoOwnerId);
}

function ensureLiveDatePostcardState() {
  selectedIds.forEach((participantId) => {
    if (!liveDateState.submittedPhotos[participantId]) {
      liveDateState.submittedPhotos[participantId] = postcardSubmissions[participantId];
    }
    if (!liveDateState.photoSelections[participantId]) {
      liveDateState.photoSelections[participantId] = canonicalDemoPhotoSelections[participantId];
    }
  });

  if (!liveDateState.firstPairingResolved) {
    const selectedByUserId = liveDateState.selectedByUserId || "jacob";
    const selectedPhotoOwnerId = liveDateState.selectedPhotoOwnerId
      || liveDateState.photoSelections[selectedByUserId]
      || canonicalDemoPhotoSelections[selectedByUserId];
    resolveFirstPairing(selectedByUserId, selectedPhotoOwnerId);
  }
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
    "instagram-share": () => submitInstagramSharingChoice("share"),
    "instagram-not-now": () => submitInstagramSharingChoice("not_now"),
    "switch-pov": switchParticipantPov,
  };

  if (actions[action]) actions[action](actionButton);
}

function declineParticipantFlow(controlId) {
  completeControl(controlId);
  appendOutgoing("Maybe next time");
  const lines = [
    "No pressure.",
    "You're back in the matching pool.",
  ];
  showParticipantTyping(() => appendIncoming(lines), lines);
}

function acceptInvitation() {
  completeControl("invitation");
  advanceSimulatedTime(2);
  appendOutgoing("I'm in");
  setParticipantScreen(9);
  const lines = ["I found a group I think you'll genuinely enjoy meeting."];
  showParticipantTyping(() => {
    appendIncoming(lines);
    scheduleParticipant(() => {
      advanceSimulatedTime(1);
      renderMeetYourGroup();
    }, readingPauseMs(lines));
  }, lines);
}

function renderMeetYourGroup() {
  const groupOrder = selectedGroup.slice().sort((first, second) => {
    if (first.id === "jacob") return 1;
    if (second.id === "jacob") return -1;
    return 0;
  });

  appendPacedIncoming([
    ["Meet your group."],
    ["Take a look around.", "No pressure."],
    ["You'll decide in a moment if this feels like your kind of night."],
  ], () => {
    appendConversation(`
      <div class="message-row attachment-row">
        <div class="participant-browser" aria-label="Meet your group">
          ${groupOrder.map((person, index) => `
            <article class="participant-profile-card ${person.id === "jacob" ? "is-self" : ""}" style="--delay:${index * 90}ms">
              ${portrait(person, "participant-profile-photo")}
              <div class="participant-profile-copy">
                <div class="participant-profile-heading"><strong>${person.name}</strong>${person.id === "jacob" ? "<span>You</span>" : ""}</div>
                <small>${person.university}</small>
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
  });
}

function acceptGroupBrowse() {
  completeControl("group-browser");
  advanceSimulatedTime(3);
  appendOutgoing("I'm down");
  setParticipantScreen(11);
  const lines = ["Awesome."];
  showParticipantTyping(beginGroupLockIn, lines);
}

function beginGroupLockIn() {
  const confirmationLines = ["I'm checking with everyone else.", "Sit tight."];
  appendIncoming(["Awesome."]);
  scheduleParticipant(() => {
    advanceSimulatedTime(1);
    showParticipantTyping(() => {
      appendIncoming(confirmationLines);
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
        advanceSimulatedTime(6);
        const everyoneLines = ["Everyone's in."];
        showParticipantTyping(() => {
          appendIncoming(everyoneLines);
          scheduleParticipant(() => {
            advanceSimulatedTime(0.5);
            const lockedLines = ["Your group is locked."];
            showParticipantTyping(() => {
              appendIncoming(lockedLines);
              scheduleParticipant(renderAvailability, readingPauseMs(lockedLines));
            }, lockedLines);
          }, readingPauseMs(everyoneLines));
        }, everyoneLines);
      }, 2550);
    }, confirmationLines);
  }, readingPauseMs(["Awesome."]));
}

function renderAvailability() {
  setParticipantScreen(12);
  const lines = [
    "Now let's find a time that works for everyone.",
    "Choose every time you're available this week.",
  ];
  showParticipantTyping(() => {
    appendIncoming(lines);
    appendConversation(`
      <div class="message-row attachment-row" data-control="availability">
        <div class="availability-picker">
          <div class="availability-options">
            ${AVAILABILITY_SLOTS.map((slot) => `
              <label class="availability-option">
                <input type="checkbox" value="${slot.label}">
                <span>${slot.label}</span>
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
  }, lines);
}

function submitAvailability() {
  if (participantState.availability.size === 0) return;
  const nextSchedule = createSimulatedSchedule(sessionAnchorDate, [...participantState.availability]);
  if (!Number.isFinite(nextSchedule.liveDateTimestampMinutes)) return;
  Object.assign(simulatedSchedule, nextSchedule);
  completeControl("availability");
  advanceSimulatedTime(5);
  appendOutgoing([...participantState.availability].join(" · "));
  scheduleParticipant(() => {
    advanceSimulatedTime(5);
    renderPlanningProgress();
  }, 500);
}

function renderPlanningProgress() {
  setParticipantScreen(13);
  appendPacedIncoming([
    ["Perfect."],
    ["Give me a minute.", "I'm putting everything together."],
  ], () => {
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
  advanceSimulatedTime(3);
  appendPacedIncoming([
    ["Okay."],
    ["I found your plan."],
  ], () => {
    appendConversation(`
      <div class="message-row attachment-row">
        <article class="participant-experience-card" data-experience-card>
          <img src="${groupPhotos.beachCookout}" alt="${beachDateFlow.title} at sunset">
          <div class="experience-card-copy">
            <p class="participant-kicker">${formatSimulatedCalendarDate(simulatedSchedule.liveDateTimestampMinutes)} · ${scheduledStartTime()}</p>
            <h2>${beachDateFlow.title}</h2>
            <p>Cook together, compete a little, then stay for the sunset.</p>
            <span>${beachDateFlow.venue}</span>
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
    <img src="${groupPhotos.beachCookout}" alt="${beachDateFlow.title} at sunset">
    <div class="experience-card-copy experience-details-copy">
      <p class="participant-kicker">${formatSimulatedCalendarDate(simulatedSchedule.liveDateTimestampMinutes)}</p>
      <h2>${beachDateFlow.title}</h2>
      <div class="experience-facts">
        <div><span>Time</span><strong>${scheduledStartTime()}–8:30 PM</strong></div>
        <div><span>Meet</span><strong>${beachDateFlow.venue}</strong></div>
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
  status.textContent = `Calendar updated for ${simulatedWeekdayLabel(simulatedSchedule.liveDateTimestampMinutes)} at ${scheduledStartTime()}.`;
}

function startPostcardPick(button) {
  button.closest(".inline-action-pair").querySelectorAll("button").forEach((item) => { item.disabled = true; });
  advanceSimulatedTime(2);
  appendOutgoing("Got it");
  setParticipantScreen(16);
  appendPacedIncoming([
    ["That's everything you need for now.", "I'll handle the rest when the date begins."],
    ["One thing before the date."],
    ["Send me a photo of a place, object, or moment that means something to you.", "Nothing too serious.", "Just something with a story behind it."],
  ], () => {
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
  liveDateState.submittedPhotos.jacob = participantState.uploadedPostcard;
  const preview = app.querySelector("[data-postcard-preview]");
  preview.innerHTML = `<img src="${participantState.uploadedPostcard}" alt="Jacob's private postcard preview">`;
  app.querySelector("[data-participant-action='submit-postcard']").disabled = false;
  scrollParticipantThread();
}

function submitPostcard() {
  if (!participantState.uploadedPostcard) return;
  advanceSimulatedTime(3);
  liveDateState.submittedPhotos.jacob = participantState.uploadedPostcard;
  selectedIds.forEach((participantId) => {
    if (!liveDateState.submittedPhotos[participantId]) {
      liveDateState.submittedPhotos[participantId] = postcardSubmissions[participantId];
    }
  });
  completeControl("postcard-upload");
  const sentEntryId = nextParticipantEntryId("postcard");
  appendConversation(`
    <div class="message-row outgoing-row" data-entry-id="${sentEntryId}" data-message-timestamp="${simulatedTimeline.currentTimestampMinutes}">
      <div class="sent-postcard">
        <img src="${participantState.uploadedPostcard}" alt="Your private postcard submission">
      </div>
    </div>
  `);
  appendPacedIncoming([
    ["Everyone sent something in."],
    ["Pick the one you're most curious about.", "Don't overthink it."],
  ], renderEligiblePostcards);
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
  if (!storePhotoSelection("jacob", participantState.postcardSelection)) return;
  completeControl("postcard-selection");
  advanceSimulatedTime(2);
  appendOutgoing("Picked one");
  appendPacedIncoming([
    ["Got it."],
    ["You'll find out why during the date."],
  ], () => scheduleParticipant(renderOneDayReminder, 800));
}

function renderOneDayReminder() {
  setParticipantScreen(17);
  setSimulatedTime(simulatedSchedule.dayBeforeTimestampMinutes);
  appendTimeDivider();
  const liveDateDayLabel = relativeSimulatedDayLabel(simulatedSchedule.liveDateTimestampMinutes);
  const lines = [
    `${liveDateDayLabel} 👀`,
    beachDateFlow.title,
    `${liveDateDayLabel} at ${scheduledStartTime()}`,
    beachDateFlow.venue,
    "Everyone's still in.",
    "Looks like 22°C and clear.",
    "Bring a light hoodie for later.",
    "I'll message you again before it starts.",
  ];
  showParticipantTyping(() => {
    appendIncoming(lines);
    appendChoices([
      { label: "View Details", action: "reminder-details", primary: true },
      { label: "Got it", action: "reminder-got-it" },
    ], "reminder");
  }, lines);
}

function showReminderDetails(button) {
  button.disabled = true;
  appendConversation(`
    <div class="message-row attachment-row">
      <div class="compact-reminder-card">
        <img src="${groupPhotos.beachCookout}" alt="${beachDateFlow.title}">
        <div><strong>${simulatedWeekdayLabel(simulatedSchedule.liveDateTimestampMinutes)} · ${scheduledStartTime()}</strong><span>${beachDateFlow.venue}</span><span>22°C and clear · Bring a light hoodie</span></div>
      </div>
    </div>
  `);
}

function showDateStart() {
  completeControl("reminder");
  setSimulatedTime(simulatedSchedule.liveDateTimestampMinutes);
  appendOutgoing("Got it");
  setParticipantScreen(18);
  scheduleParticipant(() => {
    appendTimeDivider();
    const lines = [
      "You're here.",
      "Date starts now.",
      "Say hi to everyone first.",
      "I'll send the next step when you're ready.",
    ];
    showParticipantTyping(() => {
      appendIncoming(lines);
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
    }, lines);
  }, 700);
}

function confirmArrival() {
  participantState.arrivalState = "complete";
  completeControl("arrival");
  appendOutgoing("We're all here");
  const live = app.querySelector(".group-live-status span");
  live.textContent = "Everyone arrived · Group Mode is live";
  scheduleParticipant(beginLiveDate, 1250, "live-begin");
}

function checkMissingParticipant() {
  participantState.arrivalState = "checking";
  completeControl("arrival");
  appendOutgoing("Someone's missing");
  const live = app.querySelector(".group-live-status span");
  live.textContent = "Arrival check in progress";
  const checkingLines = ["I'm checking in with them now.", "Give me a minute."];
  showParticipantTyping(() => {
    appendIncoming(checkingLines);
    scheduleParticipant(() => {
      advanceSimulatedTime(0.5);
      const readyLines = ["Everyone's here now."];
      showParticipantTyping(() => {
        appendIncoming(readyLines);
        appendChoices([{ label: "We're ready", action: "arrival-complete-after-check", primary: true }], "arrival-check");
      }, readyLines);
    }, readingPauseMs(checkingLines));
  }, checkingLines);
}

function confirmArrivalAfterCheck() {
  participantState.arrivalState = "complete";
  completeControl("arrival-check");
  appendOutgoing("We're ready");
  const live = app.querySelector(".group-live-status span");
  if (live) live.textContent = "Everyone arrived · Group Mode is live";
  scheduleParticipant(beginLiveDate, 850, "live-begin");
}

function liveDatePhase(id) {
  return beachDateFlow.phases.find((phase) => phase.id === id);
}

function liveDateRecord(participantId = liveDateState.activeParticipantId) {
  return liveDateState.participants[participantId];
}

function cloneDateEntry(entry, id) {
  const copy = { ...entry, id };
  if ((copy.type === "incoming" || copy.type === "outgoing") && !Number.isFinite(copy.timestampMinutes)) {
    copy.timestampMinutes = simulatedTimeline.currentTimestampMinutes;
  }
  return copy;
}

function disabledControlHtml(html) {
  return html.replace(/<(button|input|textarea)(\s)/g, "<$1 disabled$2");
}

function formatSimulatedTime(totalMinutes) {
  const normalized = ((Math.floor(totalMinutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hour24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function simulatedCalendarDay(timestampMinutes) {
  return Math.floor(timestampMinutes / MINUTES_PER_DAY);
}

function simulatedWeekdayLabel(timestampMinutes) {
  return SIMULATED_WEEKDAYS[new Date(timestampMinutes * 60000).getUTCDay()];
}

function formatSimulatedCalendarDate(timestampMinutes) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(timestampMinutes * 60000));
}

function relativeSimulatedDayLabel(timestampMinutes) {
  const dayDifference = simulatedCalendarDay(timestampMinutes) - simulatedCalendarDay(simulatedTimeline.currentTimestampMinutes);
  if (dayDifference === 0) return "Today";
  if (dayDifference === 1) return "Tomorrow";
  return simulatedWeekdayLabel(timestampMinutes);
}

function formatRelativeDateTime(timestampMinutes) {
  return `${relativeSimulatedDayLabel(timestampMinutes)} · ${formatSimulatedTime(timestampMinutes)}`;
}

function formatMessageTimestamp(timestampMinutes) {
  const dayLabel = relativeSimulatedDayLabel(timestampMinutes);
  return dayLabel === "Today"
    ? formatSimulatedTime(timestampMinutes)
    : `${dayLabel} · ${formatSimulatedTime(timestampMinutes)}`;
}

function currentLiveDateTime() {
  return formatSimulatedTime(simulatedTimeline.currentTimestampMinutes);
}

function scheduledStartTime() {
  return formatSimulatedTime(simulatedSchedule.liveDateTimestampMinutes);
}

function refreshSimulatedTimelineLabels() {
  app.querySelectorAll("[data-date-separator-timestamp]").forEach((separator) => {
    const timestampMinutes = Number(separator.dataset.dateSeparatorTimestamp);
    const label = separator.querySelector("span") || separator;
    label.textContent = formatRelativeDateTime(timestampMinutes);
  });
  app.querySelectorAll("[data-message-timestamp]").forEach((message) => {
    const timestampMinutes = Number(message.dataset.messageTimestamp);
    const label = message.querySelector("[data-message-time]");
    if (label) label.textContent = formatMessageTimestamp(timestampMinutes);
  });
  const phoneTime = app.querySelector("[data-phone-time]");
  if (phoneTime) phoneTime.textContent = currentLiveDateTime().replace(/ (AM|PM)$/, "");
}

function setSimulatedTime(totalMinutes) {
  simulatedTimeline.currentTimestampMinutes = totalMinutes;
  refreshSimulatedTimelineLabels();
}

function initializeLiveDateClock() {
  if (simulatedTimeline.currentTimestampMinutes < simulatedSchedule.liveDateTimestampMinutes) {
    setSimulatedTime(simulatedSchedule.liveDateTimestampMinutes);
  }
}

function advanceSimulatedTime(durationMinutes) {
  setSimulatedTime(simulatedTimeline.currentTimestampMinutes + durationMinutes);
  return simulatedTimeline.currentTimestampMinutes;
}

function advanceLiveDatePhase(phaseId) {
  const phase = liveDatePhase(phaseId);
  initializeLiveDateClock();
  const startMinutes = liveDateState.phaseStartTimes[phaseId] ?? simulatedTimeline.currentTimestampMinutes;
  const completionMinutes = Math.max(
    simulatedTimeline.currentTimestampMinutes,
    startMinutes + (phase.durationMinutes || 0),
  );
  liveDateState.phaseCompletionTimes[phaseId] = completionMinutes;
  setSimulatedTime(completionMinutes);
  return completionMinutes;
}

function liveEntryTimestamp(entry) {
  if (!Number.isFinite(entry.timestampMinutes)) return "";
  return `<time class="live-message-time" data-message-time>${formatMessageTimestamp(entry.timestampMinutes)}</time>`;
}

function renderDateEntry(entry) {
  if (entry.type === "divider") {
    const label = Number.isFinite(entry.minutes) ? formatRelativeDateTime(entry.minutes) : entry.label;
    const timestampAttribute = Number.isFinite(entry.minutes) ? ` data-date-separator-timestamp="${entry.minutes}"` : "";
    return `<div class="conversation-time-jump live-date-time" data-entry-id="${escapeHtml(entry.id)}"${timestampAttribute}><span>${escapeHtml(label)}</span></div>`;
  }
  if (entry.type === "incoming") {
    const timestampAttribute = Number.isFinite(entry.timestampMinutes) ? ` data-message-timestamp="${entry.timestampMinutes}"` : "";
    return `<div class="message-row incoming-row" data-entry-id="${escapeHtml(entry.id)}"${timestampAttribute}><div class="message-bubble incoming">${entry.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}${liveEntryTimestamp(entry)}</div></div>`;
  }
  if (entry.type === "outgoing") {
    const timestampAttribute = Number.isFinite(entry.timestampMinutes) ? ` data-message-timestamp="${entry.timestampMinutes}"` : "";
    return `<div class="message-row outgoing-row" data-entry-id="${escapeHtml(entry.id)}"${timestampAttribute}><div class="message-bubble outgoing"><p>${escapeHtml(entry.text)}</p>${liveEntryTimestamp(entry)}</div></div>`;
  }
  const content = entry.completed ? disabledControlHtml(entry.html) : entry.html;
  return `<div class="message-row participant-control-row live-date-control ${entry.completed ? "is-complete" : ""}" data-entry-id="${escapeHtml(entry.id)}" data-control="${entry.controlId}">${content}</div>`;
}

function renderedDateEntry(conversation, entryId) {
  return [...conversation.querySelectorAll("[data-entry-id]")]
    .find((element) => element.dataset.entryId === entryId);
}

function updateRenderedDateControls(conversation, entries) {
  entries.filter((entry) => entry.type === "control").forEach((entry) => {
    const element = renderedDateEntry(conversation, entry.id);
    if (!element) return;
    element.classList.toggle("is-complete", entry.completed);
    element.querySelectorAll("button, input, select, textarea").forEach((control) => {
      control.disabled = entry.completed;
    });
  });
}

function suppressSnapshotAnimations(conversation) {
  conversation.querySelectorAll(".message-row, .message-bubble, .participant-profile-card").forEach((element) => {
    element.style.animation = "none";
  });
}

function appendPendingNonIncomingDateEntries(conversation, entries) {
  let nextEntry = entries.find((entry) => !renderedDateEntry(conversation, entry.id));
  while (nextEntry && nextEntry.type !== "incoming") {
    conversation.insertAdjacentHTML("beforeend", renderDateEntry(nextEntry));
    nextEntry = entries.find((entry) => !renderedDateEntry(conversation, entry.id));
  }
}

function renderActiveDateThread() {
  const participantId = liveDateState.activeParticipantId;
  const record = liveDateRecord(participantId);
  const conversation = participantConversation();
  if (!conversation || !record) return;

  const renderedParticipantId = conversation.dataset.liveParticipantId;
  const participantChanged = Boolean(renderedParticipantId && renderedParticipantId !== participantId);
  const requiresSnapshot = participantChanged || (!renderedParticipantId && participantId !== "jacob");

  if (requiresSnapshot) {
    conversation.innerHTML = `${liveDateState.preDateHtmlByParticipant[participantId] || ""}${record.messages.map(renderDateEntry).join("")}`;
    conversation.dataset.liveParticipantId = participantId;
    delete conversation.dataset.liveTyping;
    delete conversation.dataset.liveReading;
    suppressSnapshotAnimations(conversation);
  } else {
    conversation.dataset.liveParticipantId = participantId;
    updateRenderedDateControls(conversation, record.messages);

    const nextEntry = record.messages.find((entry) => !renderedDateEntry(conversation, entry.id));
    const isReading = conversation.dataset.liveReading === participantId;
    if (nextEntry && !isReading) {
      if (nextEntry.type === "incoming") {
        if (conversation.dataset.liveTyping !== participantId) {
          conversation.dataset.liveTyping = participantId;
          showParticipantTyping(() => {
            if (conversation.dataset.liveParticipantId === participantId) {
              delete conversation.dataset.liveTyping;
            }
            if (
              liveDateState.activeParticipantId === participantId
              && participantConversation() === conversation
              && !renderedDateEntry(conversation, nextEntry.id)
            ) {
              conversation.insertAdjacentHTML("beforeend", renderDateEntry(nextEntry));
              appendPendingNonIncomingDateEntries(conversation, record.messages);
              refreshSimulatedTimelineLabels();
              scrollParticipantThread();
              conversation.dataset.liveReading = participantId;
              scheduleParticipant(() => {
                if (
                  conversation.dataset.liveParticipantId === participantId
                  && conversation.dataset.liveReading === participantId
                ) {
                  delete conversation.dataset.liveReading;
                }
                renderActiveDateThread();
              }, readingPauseMs(nextEntry.lines));
              return;
            }
            renderActiveDateThread();
          }, nextEntry.lines);
        }
      } else {
        appendPendingNonIncomingDateEntries(conversation, record.messages);
        renderActiveDateThread();
        return;
      }
    }
  }

  app.querySelectorAll("[data-pov-id]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.povId === participantId);
  });
  const header = app.querySelector(".messages-wordmark");
  if (header) header.textContent = `Ditto · ${personById(participantId).name}`;
  refreshSimulatedTimelineLabels();
  scrollParticipantThread();
}

function addDateEntries(participantIds, entries, namespace) {
  if (!namespace) throw new Error("Timeline entries require a stable namespace.");
  participantIds.forEach((participantId) => {
    const record = liveDateRecord(participantId);
    entries.forEach((entry, index) => {
      const entryId = `${namespace}:${participantId}:${entry.entryKey || index}`;
      if (record.messages.some((message) => message.id === entryId)) return;
      const copy = cloneDateEntry(entry, entryId);
      const previousTimestamp = [...record.messages]
        .reverse()
        .find((message) => Number.isFinite(message.timestampMinutes))
        ?.timestampMinutes;
      if (
        (copy.type === "incoming" || copy.type === "outgoing")
        && Number.isFinite(previousTimestamp)
        && copy.timestampMinutes <= previousTimestamp
      ) {
        copy.timestampMinutes = previousTimestamp + 0.5;
      }
      record.messages.push(copy);
    });
  });
}

function addSharedDateEntries(entries, namespace) {
  addDateEntries(selectedIds, entries, namespace);
}

function incomingDateEntry(lines, timestampMinutes, entryKey) {
  return { type: "incoming", lines, timestampMinutes, entryKey };
}

function outgoingDateEntry(text, timestampMinutes, entryKey) {
  return { type: "outgoing", text, timestampMinutes, entryKey };
}

function controlDateEntry(controlId, html) {
  return { type: "control", controlId, html, completed: false, entryKey: `control-${controlId}` };
}

function setLiveDatePhase(phaseId) {
  const phase = liveDatePhase(phaseId);
  initializeLiveDateClock();
  liveDateState.currentPhaseId = phaseId;
  if (!Number.isFinite(liveDateState.phaseStartTimes[phaseId])) {
    liveDateState.phaseStartTimes[phaseId] = simulatedTimeline.currentTimestampMinutes;
  }
  return phase;
}

function appendLiveDatePhase(phaseId, entries, participantIds = selectedIds) {
  if (liveDateState.phaseAppended[phaseId]) return false;
  setLiveDatePhase(phaseId);
  liveDateState.phaseAppended[phaseId] = true;
  participantIds.forEach((participantId) => {
    const record = liveDateRecord(participantId);
    const lastDivider = [...record.messages].reverse().find((entry) => entry.type === "divider" && Number.isFinite(entry.minutes));
    const shouldAddDivider = !lastDivider || simulatedTimeline.currentTimestampMinutes - lastDivider.minutes >= 5;
    const phaseEntries = shouldAddDivider
      ? [{ type: "divider", minutes: simulatedTimeline.currentTimestampMinutes, entryKey: "divider" }, ...entries]
      : entries;
    addDateEntries([participantId], phaseEntries, `phase-${phaseId}`);
  });
  renderActiveDateThread();
  return true;
}

function completeLiveDateControl(controlId, participantIds = selectedIds) {
  participantIds.forEach((participantId) => {
    const entry = liveDateRecord(participantId).messages.find((item) => item.type === "control" && item.controlId === controlId);
    if (entry) entry.completed = true;
  });
}

function recordPairingPhase(phaseId, pairs, details = {}) {
  liveDateState.pairings = pairs.map((pair) => [...pair]);
  liveDateState.pairingHistory.push({
    phaseId,
    pairs: pairs.map((pair) => [...pair]),
    durationMinutes: liveDatePhase(phaseId).durationMinutes,
    repeated: liveDateState.pairingHistory.some((entry) => entry.pairs.some((pastPair) => pairs.some((pair) => pairIncludes(pair, ...pastPair)))),
    ...details,
  });
}

function postcardRevealFor(participantId) {
  const selectedBy = personById(liveDateState.selectedByUserId);
  const photoOwner = personById(liveDateState.selectedPhotoOwnerId);
  const selectedPhoto = liveDateState.submittedPhotos[photoOwner.id];
  const participantIsSelector = participantId === selectedBy.id;
  const participantIsOwner = participantId === photoOwner.id;

  let intro;
  let ownerLabel;
  let ownerValue;

  if (participantIsSelector) {
    intro = "Remember the photo you picked?";
    ownerLabel = "That was";
    ownerValue = `${photoOwner.name}'s`;
  } else if (participantIsOwner) {
    intro = `${selectedBy.name} picked your photo earlier.`;
    ownerLabel = "Selected by";
    ownerValue = selectedBy.name;
  } else {
    intro = `${selectedBy.name} picked ${photoOwner.name}'s photo earlier.`;
    ownerLabel = "Photo owner";
    ownerValue = photoOwner.name;
  }

  return [
    incomingDateEntry([intro]),
    controlDateEntry(`postcard-reveal-${participantId}`, `
      <article class="postcard-reveal-pass">
        <img src="${selectedPhoto}" alt="Selected postcard, revealed as ${photoOwner.name}'s">
        <div class="postcard-owner-reveal"><span>${ownerLabel}</span><strong>${ownerValue}</strong></div>
      </article>
    `),
  ];
}

function beginLiveDate() {
  if (liveDateState.dateStarted) return;
  liveDateState.dateStarted = true;
  ensureLiveDatePostcardState();
  initializeLiveDateClock();
  liveDateState.preDateHtmlByParticipant.jacob = participantConversation().innerHTML;
  const jacobAlreadyHasCurrentDivider = Boolean(app.querySelector(
    `[data-date-separator-timestamp="${simulatedTimeline.currentTimestampMinutes}"]`,
  ));
  app.querySelector("[data-pov-switch]").hidden = false;
  setParticipantScreen(19);

  setLiveDatePhase("arrival");
  liveDateState.phaseAppended.arrival = true;
  selectedIds.forEach((participantId) => {
    const divider = participantId === "jacob" && jacobAlreadyHasCurrentDivider
      ? []
      : [{ type: "divider", minutes: simulatedTimeline.currentTimestampMinutes, entryKey: "divider" }];
    addDateEntries([participantId], [
      ...divider,
      incomingDateEntry(["Perfect."], undefined, "arrival-greeting"),
    ], "phase-arrival");
  });
  renderActiveDateThread();
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Take a moment and say hi."])], "phase-arrival-followup");
    renderActiveDateThread();
  }, 350, "live-arrival-followup");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Phones away for a minute.", "I'll step in when I'm needed."])], "phase-arrival-phones-away");
    renderActiveDateThread();
  }, 700, "live-arrival-phones-away");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Keep your age, occupation, and contact details private for now. Ditto will let you know when each one unlocks."])], "phase-arrival-information-privacy");
    renderActiveDateThread();
  }, 1050, "live-arrival-information-privacy");
  scheduleParticipant(() => {
    selectedIds.forEach((participantId) => {
      addDateEntries([participantId], postcardRevealFor(participantId), "phase-arrival-postcard-reveal");
    });
    renderActiveDateThread();
  }, 1400, "live-arrival-postcard-reveal");
  scheduleParticipant(showLinkedDodgeball, 1900, "live-linked-dodgeball");
}

function showLinkedDodgeball() {
  if (liveDateState.phaseAppended["linked-dodgeball"]) return;
  advanceLiveDatePhase("arrival");
  const firstPairing = liveDateState.firstPairing.map((pair) => [...pair]);
  recordPairingPhase("linked-dodgeball", firstPairing, {
    preserved: false,
    disrupted: false,
    observedBy: selectedIds,
  });
  appendLiveDatePhase("linked-dodgeball", [
    incomingDateEntry([
      "Your first pairing comes from the photo pick.",
      `${pairLabel(firstPairing[0])} versus ${pairLabel(firstPairing[1])}.`,
      "Linked dodgeball.",
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
  const completionMinutes = advanceLiveDatePhase("linked-dodgeball");
  addDateEntries([liveDateState.activeParticipantId], [outgoingDateEntry("Game finished", completionMinutes)], "result-linked-dodgeball-user");
  const winner = [...liveDateState.firstPairing[0]];
  const loser = liveDateState.firstPairing[1];
  liveDateState.dodgeballResult = { winner, loser: [...loser], score: "5–3" };
  liveDateState.completedTasks.push("linked-dodgeball");
  addSharedDateEntries([incomingDateEntry([`${pairLabel(winner)} won, 5–3.`], completionMinutes)], "result-linked-dodgeball");
  renderActiveDateThread();
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Keep that energy."], completionMinutes)], "result-linked-dodgeball-followup");
    renderActiveDateThread();
  }, 350, "live-linked-dodgeball-followup");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Occupation unlocked."], completionMinutes)], "occupation-unlock");
    renderActiveDateThread();
  }, 700, "live-occupation-unlock");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry([
      "You can tell the group what you do or what you're studying now. Keep your age and contact details private.",
    ], completionMinutes)], "occupation-unlock-followup");
    renderActiveDateThread();
  }, 1050, "live-occupation-unlock-followup");
  scheduleParticipant(showCouplePhotoChallenge, 1450, "live-couple-photo");
}

function showCouplePhotoChallenge() {
  if (liveDateState.phaseAppended["couple-photo"]) return;
  recordPairingPhase("couple-photo", beachDateFlow.pairings.couplePhoto, {
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
  const completionMinutes = advanceLiveDatePhase("couple-photo");
  addDateEntries([liveDateState.activeParticipantId], [outgoingDateEntry("Photos taken", completionMinutes)], "result-couple-photo-user");
  const winner = [...beachDateFlow.simulatedResults.couplePhotoWinner];
  const loser = beachDateFlow.pairings.couplePhoto.find((pair) => !pairIncludes(pair, ...winner));
  liveDateState.couplePhotoResult = { winner, loser: [...loser] };
  liveDateState.couplePhotoWinningPair = winner;
  liveDateState.couplePhotoLosingPair = [...loser];
  liveDateState.ingredientPreparationPair = [...loser];
  liveDateState.completedTasks.push("couple-photo");
  addSharedDateEntries([incomingDateEntry([`${pairLabel(winner)} won.`], completionMinutes)], "result-couple-photo");
  renderActiveDateThread();
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Age unlocked."], completionMinutes)], "age-unlock");
    renderActiveDateThread();
  }, 700, "live-age-unlock");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry([
      "You can share your age now. Contact details stay private until after the date.",
    ], completionMinutes)], "age-unlock-followup");
    renderActiveDateThread();
  }, 1050, "live-age-unlock-followup");
  scheduleParticipant(showCookoutSetup, 1450, "live-cookout-setup");
}

function showCookoutSetup() {
  if (liveDateState.phaseAppended["cookout-setup"]) return;
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
  const completionMinutes = advanceLiveDatePhase("cookout-setup");
  addDateEntries([liveDateState.activeParticipantId], [outgoingDateEntry("We're ready to grill", completionMinutes)], "result-cookout-setup-user");
  liveDateState.completedTasks.push("cookout-setup");
  renderActiveDateThread();
  scheduleParticipant(showArmWrestling, 750, "live-arm-wrestling");
}

function showArmWrestling() {
  if (liveDateState.phaseAppended["arm-wrestling"]) return;
  recordPairingPhase("arm-wrestling", beachDateFlow.pairings.armWrestling, {
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
  const completionMinutes = advanceLiveDatePhase("arm-wrestling");
  addDateEntries([liveDateState.activeParticipantId], [outgoingDateEntry("Match finished", completionMinutes)], "result-arm-wrestling-user");
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
  ], completionMinutes)], "result-arm-wrestling");
  renderActiveDateThread();
  scheduleParticipant(showGrillingDinner, 650, "live-grilling-dinner");
}

function showGrillingDinner() {
  const appended = appendLiveDatePhase("grilling-dinner", [incomingDateEntry([
    "Dinner's on.",
    "Phones down. I'll be back later.",
  ])]);
  if (!appended) return;
  scheduleParticipant(showPrivateWindow, 1500, "live-private-window");
}

function nameInputControl(controlId, action, placeholder) {
  return `<div class="private-name-prompt"><input type="text" autocomplete="off" placeholder="${placeholder}" aria-label="Send one name"><p class="inline-message-validation" aria-live="polite"></p><button class="message-action primary" data-participant-action="${action}">Send</button></div>`;
}

function showPrivateWindow() {
  if (liveDateState.phaseAppended["private-window"]) return;
  advanceLiveDatePhase("grilling-dinner");
  setLiveDatePhase("private-window");
  liveDateState.phaseAppended["private-window"] = true;
  selectedIds.forEach((participantId) => {
    addDateEntries([participantId], [
      { type: "divider", minutes: simulatedTimeline.currentTimestampMinutes, entryKey: "divider" },
      incomingDateEntry([
        "Ten-minute window is open.",
        "There's someone here you want more time with.",
        "Send me their name.",
      ]),
      controlDateEntry(`private-window-${participantId}`, nameInputControl(`private-window-${participantId}`, "private-window-submit", "Type one name")),
    ], "phase-private-window");
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
    addDateEntries([participantId], [outgoingDateEntry(personById(choiceId).name, simulatedTimeline.currentTimestampMinutes)], "private-window-simulated-choice");
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
  addDateEntries([participantId], [
    outgoingDateEntry(result.label, simulatedTimeline.currentTimestampMinutes),
    incomingDateEntry(["Got it. Waiting for everyone."], simulatedTimeline.currentTimestampMinutes),
  ], "private-window-user-choice");
  completePrivateParticipantControl(participantId);
  simulateRemainingPrivateWindowChoices();
  renderActiveDateThread();
  if (selectedIds.every((id) => liveDateRecord(id).privateWindowChoice !== undefined)) {
    scheduleParticipant(resolvePrivateWindowChoices, 800, "live-private-window-resolution");
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
  const completionMinutes = advanceLiveDatePhase("private-window");
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
    addDateEntries([participantId], [incomingDateEntry(lines, completionMinutes)], "private-window-resolution");
  });
  liveDateState.privateWindowResolved = true;
  renderActiveDateThread();
  scheduleParticipant(showBeachFinalSignal, 1200, "live-final-signal");
}

function showBeachFinalSignal() {
  if (liveDateState.phaseAppended["final-signal"]) return;
  advanceSimulatedTime(liveDatePhase("final-signal").delayBeforeMinutes);
  setLiveDatePhase("final-signal");
  liveDateState.phaseAppended["final-signal"] = true;
  selectedIds.forEach((participantId) => {
    addDateEntries([participantId], [
      { type: "divider", minutes: simulatedTimeline.currentTimestampMinutes, entryKey: "divider" },
      incomingDateEntry([
        "Final signal.",
        "Who would you want to see again after tonight?",
        "Send me one name—or send 'no one.'",
      ]),
      controlDateEntry(`final-signal-${participantId}`, nameInputControl(`final-signal-${participantId}`, "final-signal-submit", "Type one name or no one")),
    ], "phase-final-signal");
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
    addDateEntries([participantId], [outgoingDateEntry(personById(choiceId).name, simulatedTimeline.currentTimestampMinutes), incomingDateEntry([
      "Locked.",
      "That's your final answer for tonight.",
      "Results arrive at 12:00 AM.",
    ], simulatedTimeline.currentTimestampMinutes)], "final-signal-simulated-choice");
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
  addDateEntries([participantId], [outgoingDateEntry(result.label, simulatedTimeline.currentTimestampMinutes), incomingDateEntry([
    "Locked.",
    "That's your final answer for tonight.",
    "Results arrive at 12:00 AM.",
  ], simulatedTimeline.currentTimestampMinutes)], "final-signal-user-choice");
  completeLiveDateControl(`final-signal-${participantId}`, [participantId]);
  simulateRemainingFinalSignals();
  renderActiveDateThread();
  if (selectedIds.every((id) => liveDateRecord(id).finalSignalLocked)) {
    scheduleParticipant(showMidnightWaitingState, 700, "live-midnight-waiting");
  }
}

function showMidnightWaitingState() {
  if (liveDateState.phaseAppended.waiting) return;
  setLiveDatePhase("waiting");
  liveDateState.phaseAppended.waiting = true;
  selectedIds.forEach((participantId) => {
    addDateEntries([participantId], [
      controlDateEntry(`midnight-fast-forward-${participantId}`, `<div class="prototype-time-control"><span>Prototype control</span><button data-participant-action="fast-forward-midnight">Fast-forward to 12:00 AM</button></div>`),
    ], "phase-midnight-waiting");
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
      addDateEntries([participantId], [incomingDateEntry([
        "It's mutual.",
        `You and ${personById(partnerId).name} both chose each other.`,
        "I'll take it from here.",
      ], simulatedTimeline.currentTimestampMinutes)], "midnight-result");
      addDateEntries([participantId], [
        incomingDateEntry([
          `Would you like to share your Instagram with ${personById(partnerId).name}?`,
          "Your choice is private and locks when you confirm it.",
        ], simulatedTimeline.currentTimestampMinutes),
        controlDateEntry(`instagram-sharing-${participantId}`, `
          <div class="message-actions">
            <button class="message-action primary" data-participant-action="instagram-share">Share Instagram</button>
            <button class="message-action secondary" data-participant-action="instagram-not-now">Not now</button>
          </div>
        `),
      ], "instagram-sharing-prompt");
    } else {
      liveDateState.midnightResults[participantId] = { type: "non_mutual" };
      liveDateRecord(participantId).midnightResult = { type: "non_mutual" };
      addDateEntries([participantId], [incomingDateEntry([
        "No mutual signal tonight.",
        "Some connections need more than one evening.",
        "Goodnight.",
      ], simulatedTimeline.currentTimestampMinutes)], "midnight-result");
    }
  });
}

function submitInstagramSharingChoice(choice) {
  const participantId = liveDateState.activeParticipantId;
  const record = liveDateRecord(participantId);
  const partnerId = record.midnightResult?.type === "mutual"
    ? record.midnightResult.partnerId
    : undefined;
  if (!partnerId || record.instagramShareLocked) return;

  record.instagramShareChoice = choice;
  record.instagramShareLocked = true;
  completeLiveDateControl(`instagram-sharing-${participantId}`, [participantId]);

  if (choice === "share") {
    addDateEntries([participantId], [
      outgoingDateEntry("Share Instagram", simulatedTimeline.currentTimestampMinutes),
      incomingDateEntry([
        "Locked.",
        `I'll share your Instagram with ${personById(partnerId).name}.`,
      ], simulatedTimeline.currentTimestampMinutes),
    ], "instagram-sharing-choice");
    addDateEntries([partnerId], [incomingDateEntry([
      `${personById(participantId).name} shared their Instagram with you.`,
      personById(participantId).instagramHandle,
    ], simulatedTimeline.currentTimestampMinutes)], `instagram-handle-${participantId}`);
  } else {
    addDateEntries([participantId], [
      outgoingDateEntry("Not now", simulatedTimeline.currentTimestampMinutes),
      incomingDateEntry([
        "Got it.",
        "Your Instagram stays private.",
      ], simulatedTimeline.currentTimestampMinutes),
    ], "instagram-sharing-choice");
  }

  renderActiveDateThread();
}

function fastForwardToMidnight() {
  if (liveDateState.midnightRevealGenerated) return;
  setSimulatedTime(simulatedSchedule.midnightTimestampMinutes);
  selectedIds.forEach((participantId) => {
    completeLiveDateControl(`midnight-fast-forward-${participantId}`, [participantId]);
    addDateEntries([participantId], [{ type: "divider", minutes: simulatedTimeline.currentTimestampMinutes, entryKey: "divider" }], "phase-midnight-reveal");
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
