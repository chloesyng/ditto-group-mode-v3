const app = document.querySelector("#app");
let activeTimer;
let participantTimers = [];
let participantTimerKeys = new Set();
let participantEntrySequence = 0;
let participantTimerGeneration = 0;

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_NATURAL_TIME_INTERVAL_MINUTES = 10;
const SILENT_REVEAL_INTERVAL_MINUTES = 10;
const SIMULATED_WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const AVAILABILITY_DAYPARTS = [
  { id: "morning", label: "Morning", startMinute: 9 * 60, endMinute: 12 * 60 },
  { id: "afternoon", label: "Afternoon", startMinute: 12 * 60, endMinute: 17 * 60 },
  { id: "evening", label: "Evening", startMinute: 17 * 60, endMinute: 21 * 60 },
];

function simulatedTimestamp(year, monthIndex, day, hour, minute = 0) {
  return Math.floor(Date.UTC(year, monthIndex, day, hour, minute) / 60000);
}

function localCalendarDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function createRollingAvailabilityDays(sessionAnchorDate) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      sessionAnchorDate.getFullYear(),
      sessionAnchorDate.getMonth(),
      sessionAnchorDate.getDate() + index + 1,
    );
    return {
      dateKey: localCalendarDateKey(date),
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
      day: date.getDate(),
      weekday: date.getDay(),
      label: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(date),
    };
  });
}

function availabilityEntryKey(entry) {
  return `${entry.dateKey}:${entry.daypart}`;
}

function availabilityEntryLabel(entry) {
  return `${entry.dateLabel} · ${entry.daypartLabel}`;
}

function createSimulatedSchedule(sessionAnchorDate, confirmedAvailability = []) {
  const anchorYear = sessionAnchorDate.getFullYear();
  const anchorMonth = sessionAnchorDate.getMonth();
  const anchorDay = sessionAnchorDate.getDate();
  const preDateStartTimestampMinutes = simulatedTimestamp(anchorYear, anchorMonth, anchorDay, 19, 58);
  const rollingDayKeys = new Set(createRollingAvailabilityDays(sessionAnchorDate).map((day) => day.dateKey));
  const selectedSlots = confirmedAvailability
    .filter((entry) => rollingDayKeys.has(entry.dateKey))
    .filter((entry) => AVAILABILITY_DAYPARTS.some((daypart) => daypart.id === entry.daypart))
    .sort((left, right) => (
      left.dateKey.localeCompare(right.dateKey)
      || left.startMinute - right.startMinute
    ));

  if (selectedSlots.length === 0) {
    return {
      confirmedAvailability: [],
      selectedAvailability: undefined,
      preDateStartTimestampMinutes,
      dayBeforeTimestampMinutes: undefined,
      liveDateTimestampMinutes: undefined,
      midnightTimestampMinutes: undefined,
    };
  }

  const slot = selectedSlots[0];
  const includesPreferredStart = slot.startMinute <= 18 * 60 && slot.endMinute >= 18 * 60;
  const liveStartMinute = includesPreferredStart
    ? 18 * 60
    : Math.round(((slot.startMinute + slot.endMinute) / 2) / 30) * 30;
  const [liveYear, liveMonthNumber, liveDay] = slot.dateKey.split("-").map(Number);
  const liveCalendarDate = new Date(liveYear, liveMonthNumber - 1, liveDay);
  const liveMonth = liveCalendarDate.getMonth();
  const liveHour = Math.floor(liveStartMinute / 60);
  const liveMinute = liveStartMinute % 60;

  return {
    confirmedAvailability: selectedSlots.map((selectedSlot) => ({ ...selectedSlot })),
    selectedAvailability: { ...slot, startMinute: liveStartMinute },
    preDateStartTimestampMinutes,
    dayBeforeTimestampMinutes: simulatedTimestamp(liveYear, liveMonth, liveDay - 1, 21),
    liveDateTimestampMinutes: simulatedTimestamp(liveYear, liveMonth, liveDay, liveHour, liveMinute),
    midnightTimestampMinutes: simulatedTimestamp(liveYear, liveMonth, liveDay + 1, 0),
  };
}

const sessionAnchorDate = new Date();
const rollingAvailabilityDays = createRollingAvailabilityDays(sessionAnchorDate);
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
    relationshipIntentions: ["serious_relationship"],
    scenarioPreferences: ["structured_workshop"],
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
    relationshipIntentions: ["serious_relationship"],
    scenarioPreferences: ["structured_workshop"],
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
    relationshipIntentions: ["casual_dating", "serious_relationship"],
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
    relationshipIntentions: ["serious_relationship"],
    scenarioPreferences: ["structured_workshop"],
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
    relationshipIntentions: ["friendship", "serious_relationship"],
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
    relationshipIntentions: ["casual_dating"],
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
    relationshipIntentions: ["friendship", "serious_relationship"],
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
    relationshipIntentions: ["casual_dating"],
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
    relationshipIntentions: ["serious_relationship"],
    scenarioPreferences: ["structured_workshop"],
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
    relationshipIntentions: ["friendship", "serious_relationship"],
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
    relationshipIntentions: ["casual_dating"],
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
    relationshipIntentions: ["friendship", "serious_relationship"],
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

const relationshipProfileDetails = {
  jacob: {
    relationshipValue: "consistency",
    boundary: "social_media_private",
    communicationExpectation: "daily_check_in",
    relationshipGoal: "long_term_partnership",
    independencePreference: "balanced",
  },
  olivia: {
    relationshipValue: "curiosity",
    boundary: "slow_public_sharing",
    communicationExpectation: "direct_and_regular",
    relationshipGoal: "intentional_growth",
    independencePreference: "balanced",
  },
  kayla: {
    relationshipValue: "playfulness",
    boundary: "slow_public_sharing",
    communicationExpectation: "daily_check_in",
    relationshipGoal: "long_term_partnership",
    independencePreference: "independent_with_plans",
  },
  lucas: {
    relationshipValue: "kindness",
    boundary: "private_conflict",
    communicationExpectation: "space_then_reconnect",
    relationshipGoal: "long_term_partnership",
    independencePreference: "balanced",
  },
  maya: {
    relationshipValue: "friendship",
    boundary: "private_conflict",
    communicationExpectation: "space_then_reconnect",
    relationshipGoal: "slow_build",
    independencePreference: "independent_with_plans",
  },
  ethan: {
    relationshipValue: "spontaneity",
    boundary: "clear_expectations",
    communicationExpectation: "light_and_frequent",
    relationshipGoal: "explore_chemistry",
    independencePreference: "high_independence",
  },
  theo: {
    relationshipValue: "thoughtfulness",
    boundary: "social_media_private",
    communicationExpectation: "space_then_reconnect",
    relationshipGoal: "slow_build",
    independencePreference: "high_independence",
  },
  marcus: {
    relationshipValue: "ease",
    boundary: "clear_expectations",
    communicationExpectation: "light_and_frequent",
    relationshipGoal: "explore_chemistry",
    independencePreference: "independent_with_plans",
  },
  nia: {
    relationshipValue: "community",
    boundary: "private_conflict",
    communicationExpectation: "direct_and_regular",
    relationshipGoal: "intentional_growth",
    independencePreference: "balanced",
  },
  sora: {
    relationshipValue: "patience",
    boundary: "social_media_private",
    communicationExpectation: "space_then_reconnect",
    relationshipGoal: "slow_build",
    independencePreference: "high_independence",
  },
  leila: {
    relationshipValue: "reliability",
    boundary: "clear_expectations",
    communicationExpectation: "daily_check_in",
    relationshipGoal: "explore_chemistry",
    independencePreference: "independent_with_plans",
  },
  avery: {
    relationshipValue: "emotional_honesty",
    boundary: "private_conflict",
    communicationExpectation: "space_then_reconnect",
    relationshipGoal: "long_term_partnership",
    independencePreference: "independent_with_plans",
  },
};

applicants.forEach((profile) => {
  profile.relationshipProfile = relationshipProfileDetails[profile.id];
});

const groupPhotos = {
  allApplicants: "assets/groups/group-1.jpg",
  beachCookout: "assets/groups/group-2.jpg",
  cafeDessert: "assets/groups/cafe-dessert.jpg",
  pastaWorkshop: "assets/groups/workshop-pasta.png",
};

const approvedDockweilerIds = ["jacob", "olivia", "kayla", "lucas"];
let selectedIds = [...approvedDockweilerIds];
let selectedGroup = applicants.filter((person) => selectedIds.includes(person.id));

const approvedDockweilerEligibilityPairs = [
  ["jacob", "olivia"],
  ["jacob", "kayla"],
  ["lucas", "olivia"],
  ["lucas", "kayla"],
];
let romanticEligibilityPairs = approvedDockweilerEligibilityPairs.map((pair) => [...pair]);

const RELATIONSHIP_INTENTION_VALUES = ["serious_relationship", "casual_dating", "friendship"];
const SHARED_RELATIONSHIP_MODE_PRIORITY = ["friendship", "casual_dating", "serious_relationship"];
const RELATIONSHIP_INTENTION_LABELS = {
  serious_relationship: "Serious relationship",
  casual_dating: "Casual dating",
  friendship: "Friendship",
};

function relationshipIntentionLabel(intention) {
  return RELATIONSHIP_INTENTION_LABELS[intention] || intention;
}

function relationshipIntentionLabels(profile) {
  return profile.relationshipIntentions.map(relationshipIntentionLabel);
}

function sharedProfileValues(profiles, field) {
  if (profiles.length === 0) return [];
  return profiles[0][field].filter((value) => profiles.every((profile) => profile[field].includes(value)));
}

function sharedRelationshipIntentions(group) {
  return sharedProfileValues(group, "relationshipIntentions")
    .filter((intention) => RELATIONSHIP_INTENTION_VALUES.includes(intention));
}

function selectSharedRelationshipIntention(group) {
  const sharedIntentions = sharedRelationshipIntentions(group);
  return SHARED_RELATIONSHIP_MODE_PRIORITY.find((intention) => sharedIntentions.includes(intention));
}

function preDateFormatForGroup(group, selectedSharedMode = selectSharedRelationshipIntention(group)) {
  const allIncludeSerious = group.every((profile) => (
    profile.relationshipIntentions.includes("serious_relationship")
  ));
  return selectedSharedMode === "serious_relationship" && allIncludeSerious
    ? "relationship_booklet"
    : "anonymous_photo_or_object";
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
  const relationshipIntentionAlignment = sharedRelationshipIntentions(group);
  const sharedRelationshipIntention = selectSharedRelationshipIntention(group);
  return {
    strongestSharedInterests: highlightedProfileValues(group, "interests"),
    compatibleDatePreferences: highlightedProfileValues(group, "preferredDateCategories"),
    socialEnergyFit: socialEnergyExplanation(group),
    complementaryPersonalityTraits: group.map((profile) => ({
      participantId: profile.id,
      traits: [...profile.personalityTraits],
    })),
    relationshipIntentionAlignment,
    sharedRelationshipIntention,
    preDateFormat: preDateFormatForGroup(group, sharedRelationshipIntention),
    sharedAvailability: sharedProfileValues(group, "availabilitySlots"),
    rollingSharedAvailability: rollingSharedAvailabilityForGroup(group),
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
      const sharedAvailability = rollingSharedAvailabilityForGroup(group);
      const sharedRelationshipIntention = selectSharedRelationshipIntention(group);
      const configurations = futurePairingConfigurations(group);
      if (!sharedRelationshipIntention || sharedAvailability.length === 0 || configurations.length < 2) {
        return undefined;
      }
      const scoring = scoreCandidateGroup(group, configurations);
      return {
        group,
        configurations,
        sharedRelationshipIntention,
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
    sharedRelationshipIntention: selected.sharedRelationshipIntention,
    preDateFormat: preDateFormatForGroup(selected.group, selected.sharedRelationshipIntention),
    explanation: explainCandidateGroup(selected.group, selected.configurations),
  };
}

const RELATIONSHIP_BOOKLET_QUESTIONS = [
  {
    id: "physicalIntimacy",
    prompt: "Before you officially enter a relationship, what level of physical intimacy feels right for you?",
  },
  {
    id: "dailyCommunication",
    prompt: "When you’re dating someone, what does your ideal day-to-day communication look like?",
  },
  {
    id: "timeTogether",
    prompt: "In a relationship, how often would you ideally want to see each other?",
  },
  {
    id: "friendshipBoundaries",
    prompt: "What boundaries feel right to you when it comes to your partner spending time with people they could potentially be attracted to?",
  },
  {
    id: "loveLanguage",
    prompt: "What makes you feel most loved in a relationship?",
  },
  {
    id: "conflictRepair",
    prompt: "When you have an argument with your partner, how do you usually want to handle it?",
  },
];

const simulatedRelationshipBookletAnswers = {
  jacob: {
    physicalIntimacy: "I like affection, but I don’t want it to feel forced early on. Kissing is fine when the vibe is actually there.",
    dailyCommunication: "I’m not a text-all-day person. A couple check-ins and a call at night feels way better than constant updates.",
    timeTogether: "Two or three times a week sounds right. Enough to build something without dropping the rest of my life.",
    friendshipBoundaries: "One-on-one friendships are fine with me. I just don’t want weird secrecy around them.",
    loveLanguage: "Quality time where neither of us is half on our phone. Also remembering tiny stuff I said once.",
    conflictRepair: "I need a few minutes before I talk or I’ll get defensive. Then I’d rather sort it out that day.",
  },
  olivia: {
    physicalIntimacy: "I like taking my time. A kiss can happen early, but only when it feels clear that we both want it.",
    dailyCommunication: "A couple thoughtful texts and a real conversation later works for me. I do not need a running commentary.",
    timeTogether: "Two or three times a week feels good once we are actually dating. I still want room for our own plans.",
    friendshipBoundaries: "Close friendships are healthy. I care more about honesty and whether the boundaries feel consistent.",
    loveLanguage: "Curiosity. Ask a follow-up, remember what mattered to me, and make time that feels intentional.",
    conflictRepair: "I want us to be direct without getting cruel. A short pause is fine, but I need us to return to it.",
  },
  kayla: {
    physicalIntimacy: "I’m pretty affectionate and kissing early doesn’t scare me, but I still want it to happen naturally.",
    dailyCommunication: "Send me the random updates. I don’t need essays, I just like feeling included in your day.",
    timeTogether: "A couple times during the week and at least one weekend plan. If I like you, I actually want to hang out.",
    friendshipBoundaries: "Friends are friends, even one-on-one. I only care if the energy turns flirty and everyone pretends it didn’t.",
    loveLanguage: "Doing something helpful without making a whole announcement about it. Bring me food when I’m busy and I’m yours.",
    conflictRepair: "I’d rather say what’s wrong and get through it. Silence makes me invent a way worse story in my head.",
  },
  nia: {
    physicalIntimacy: "Hugs and being close feel good first. I like affection, but I need a second before kissing feels normal.",
    dailyCommunication: "I like little texts through the day, especially something funny or specific. Phone calls can be spontaneous.",
    timeTogether: "Twice a week minimum or I start forgetting the vibe. More when life isn’t completely chaotic.",
    friendshipBoundaries: "One-on-one is okay. I think there’s a line, and you can usually feel when it gets weird.",
    loveLanguage: "Being noticed. Remember my order, ask how the thing went, save me a seat.",
    conflictRepair: "Tell me straight, but don’t come in trying to win. I can talk it out if we’re both being normal about it.",
  },
  avery: {
    physicalIntimacy: "Holding hands is weirdly intimate to me, in a good way. I’m slower with everything else.",
    dailyCommunication: "A few real messages beat twenty dry ones. I also love a late-night voice note when neither person wants to call.",
    timeTogether: "Once during the week and a longer weekend hang feels ideal. I still need solo time to make stuff.",
    friendshipBoundaries: "I’m cool with close friendships. Just don’t hide plans or make me feel embarrassing for asking about the vibe.",
    loveLanguage: "Specific compliments and being invited into someone’s little routines. Generic romance does less for me.",
    conflictRepair: "Give me ten minutes so I don’t say something dramatic, then please come back and finish the conversation.",
  },
  lucas: {
    physicalIntimacy: "I am comfortable moving slowly. Affection matters, but I want trust and a clear read on each other first.",
    dailyCommunication: "A few honest check-ins are enough. I would rather have one good conversation than force constant texting.",
    timeTogether: "Twice during the week and some weekend time sounds balanced when schedules allow it.",
    friendshipBoundaries: "One-on-one friendships do not bother me. Hiding things or changing the story would.",
    loveLanguage: "Acts of service and quality time. Doing an ordinary thing together can mean more than a big gesture.",
    conflictRepair: "I need a little space to think, then I want to talk calmly and solve the actual problem.",
  },
};

function relationshipBookletFor(participantId, answers = simulatedRelationshipBookletAnswers[participantId]) {
  return RELATIONSHIP_BOOKLET_QUESTIONS.map((question) => ({
    id: question.id,
    question: question.prompt,
    answer: answers[question.id],
  }));
}

function allFourPersonGroups(pool = applicants) {
  const groups = [];
  for (let first = 0; first < pool.length - 3; first += 1) {
    for (let second = first + 1; second < pool.length - 2; second += 1) {
      for (let third = second + 1; third < pool.length - 1; third += 1) {
        for (let fourth = third + 1; fourth < pool.length; fourth += 1) {
          groups.push([pool[first], pool[second], pool[third], pool[fourth]]);
        }
      }
    }
  }
  return groups;
}

function supportsLightCloseness(profile) {
  return ["light_closeness", "medium", "high"].includes(profile.closenessComfortLevel);
}

function formDeterministicCafeGroup(pool = applicants) {
  const eligibleGroups = allFourPersonGroups(pool)
    .map((group) => {
      const configurations = futurePairingConfigurations(group);
      const sharedAvailability = rollingSharedAvailabilityForGroup(group);
      const eligibleMatchCounts = group.map((profile) => (
        group.filter((candidate) => isFuturePairEligible(profile, candidate)).length
      ));
      const valid = (
        group.every((profile) => profile.relationshipIntentions.includes("serious_relationship"))
        && sharedAvailability.length > 0
        && eligibleMatchCounts.every((count) => count === 2)
        && configurations.length >= 2
        && group.every(supportsLightCloseness)
      );
      if (!valid) return undefined;
      return {
        group,
        configurations,
        sharedAvailability,
        ...scoreCandidateGroup(group, configurations),
      };
    })
    .filter(Boolean)
    .sort((left, right) => (
      right.score - left.score
      || left.group.map((profile) => profile.id).join(":")
        .localeCompare(right.group.map((profile) => profile.id).join(":"))
    ));
  const selected = eligibleGroups[0];
  if (!selected) return undefined;
  return {
    memberIds: selected.group.map((profile) => profile.id),
    members: selected.group,
    configurations: selected.configurations.map((configuration) => (
      configuration.map((pair) => pair.map((profile) => profile.id))
    )),
    score: selected.score,
    sharedAvailability: selected.sharedAvailability,
    explanation: explainCandidateGroup(selected.group, selected.configurations),
  };
}

function formDeterministicWorkshopGroup(pool = applicants) {
  const energyValues = { low: 1, medium: 2, high: 3 };
  const eligibleGroups = allFourPersonGroups(pool)
    .map((group) => {
      const configurations = futurePairingConfigurations(group);
      const eligibleMatchCounts = group.map((profile) => (
        group.filter((candidate) => isFuturePairEligible(profile, candidate)).length
      ));
      const energyScores = group.map((profile) => energyValues[profile.socialEnergy]);
      const sharedAvailability = rollingSharedAvailabilityForGroup(group);
      const sharedRelationshipIntention = selectSharedRelationshipIntention(group);
      const valid = (
        group.every((profile) => profile.scenarioPreferences?.includes("structured_workshop"))
        && Boolean(sharedRelationshipIntention)
        && sharedAvailability.length > 0
        && eligibleMatchCounts.every((count) => count === 2)
        && configurations.length >= 2
        && Math.max(...energyScores) - Math.min(...energyScores) <= 2
        && group.every(supportsLightCloseness)
      );
      if (!valid) return undefined;
      return {
        group,
        configurations,
        sharedRelationshipIntention,
        sharedAvailability,
        ...scoreCandidateGroup(group, configurations),
      };
    })
    .filter(Boolean)
    .sort((left, right) => (
      right.score - left.score
      || left.group.map((profile) => profile.id).join(":")
        .localeCompare(right.group.map((profile) => profile.id).join(":"))
    ));
  const selected = eligibleGroups[0];
  if (!selected) return undefined;
  return {
    memberIds: selected.group.map((profile) => profile.id),
    members: selected.group,
    configurations: selected.configurations.map((configuration) => (
      configuration.map((pair) => pair.map((profile) => profile.id))
    )),
    score: selected.score,
    sharedRelationshipIntention: selected.sharedRelationshipIntention,
    sharedAvailability: selected.sharedAvailability,
    explanation: {
      ...explainCandidateGroup(selected.group, selected.configurations),
      scenarioPreference: "structured_workshop",
      closenessFit: selected.group.map((profile) => ({
        participantId: profile.id,
        closenessComfortLevel: profile.closenessComfortLevel,
      })),
    },
  };
}

const requestedScenarioId = new URLSearchParams(window.location?.search || "").get("scenario");
const cafeGroupFormation = formDeterministicCafeGroup();
const workshopGroupFormation = formDeterministicWorkshopGroup();
const isCafeScenario = requestedScenarioId === "cafe" && Boolean(cafeGroupFormation);
const isWorkshopScenario = requestedScenarioId === "workshop" && Boolean(workshopGroupFormation);

if (isCafeScenario || isWorkshopScenario) {
  const scenarioGroupFormation = isWorkshopScenario ? workshopGroupFormation : cafeGroupFormation;
  selectedIds = [...scenarioGroupFormation.memberIds];
  selectedGroup = applicants.filter((person) => selectedIds.includes(person.id));
  romanticEligibilityPairs = [];
  for (let first = 0; first < selectedGroup.length - 1; first += 1) {
    for (let second = first + 1; second < selectedGroup.length; second += 1) {
      if (isFuturePairEligible(selectedGroup[first], selectedGroup[second])) {
        romanticEligibilityPairs.push([selectedGroup[first].id, selectedGroup[second].id]);
      }
    }
  }
}

const defaultParticipantId = selectedIds[0];

const founderGroupFormationExamples = ["jacob", "maya", "marcus"]
  .map((participantId) => formDeterministicGroup(participantId))
  .filter(Boolean);

window.dittoGroupFormation = Object.freeze({
  profileCount: applicants.length,
  approvedDockweilerFixtureIds: [...approvedDockweilerIds],
  cafeScenario: cafeGroupFormation,
  workshopScenario: workshopGroupFormation,
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
  category: "nature",
  title: "Golden Hour Beach Cookout",
  venue: "Dockweiler State Beach",
  venueName: "Dockweiler State Beach",
  neighborhood: "Playa del Rey",
  city: "Los Angeles",
  venueType: "public_beach",
  supportedActivity: "beach_cookout",
  environment: "beach cookout",
  durationLabel: "Approximately 3 Hours",
  image: groupPhotos.beachCookout,
  lede: "cook something, chase the sunset, see who stays by the fire.",
  detailSummary: "Cook together, compete a little, then stay for the sunset.",
  preDateFormat: preDateFormatForGroup(
    applicants.filter((profile) => approvedDockweilerIds.includes(profile.id)),
  ),
  pairings: {
    couplePhoto: [["olivia", "lucas"], ["kayla", "jacob"]],
    armWrestling: [["olivia", "lucas"], ["kayla", "jacob"]],
  },
  naturalIntervals: {
    "couple-photo": 10,
    "cookout-setup": 10,
    "arm-wrestling": 10,
    "grilling-dinner": 10,
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
    bookletSelections: canonicalDemoPhotoSelections,
    couplePhotoWinner: ["olivia", "lucas"],
    armWrestlingWinner: "jacob",
    privateWindowChoices: { olivia: "jacob", kayla: "lucas", lucas: "kayla" },
    finalSignals: { olivia: "jacob", kayla: "lucas", lucas: "kayla" },
  },
};

const cafeInitialPairing = cafeGroupFormation?.configurations[0] || [];
const cafeSecondPairing = cafeGroupFormation?.configurations[1] || [];
const cafeCanonicalBookletSelections = Object.fromEntries(
  cafeInitialPairing.flatMap(([firstId, secondId]) => [
    [firstId, secondId],
    [secondId, firstId],
  ]),
);
const cafeCanonicalFirstImpressions = Object.fromEntries(
  cafeSecondPairing.flatMap(([firstId, secondId]) => [
    [firstId, secondId],
    [secondId, firstId],
  ]),
);

const cafeDateFlow = {
  id: "koreatown-dessert-cafe",
  category: "indoor_seated",
  title: "Dessert After Dark",
  venue: "Sul & Beans · Koreatown",
  venueName: "Sul & Beans",
  neighborhood: "Koreatown",
  city: "Los Angeles",
  venueType: "dessert_cafe",
  supportedActivity: "dessert_and_coffee",
  environment: "dessert cafe",
  durationLabel: "Approximately 90 Minutes",
  image: groupPhotos.cafeDessert,
  lede: "coffee, dessert, and just enough structure to skip the small talk.",
  detailSummary: "Start with an anonymous booklet, share dessert, then see where the conversation goes.",
  preDateFormat: cafeGroupFormation?.explanation.preDateFormat,
  pairings: {
    couplePhoto: cafeInitialPairing,
    eyeContact: cafeSecondPairing,
  },
  naturalIntervals: {
    "eye-contact": 2,
    "stay-linked": 10,
  },
  phases: [
    { id: "arrival", durationMinutes: 10, type: "intro", inputType: "none", shared: true },
    { id: "couple-photo", durationMinutes: 8, type: "creative_task", inputType: "completion", completionLabel: "Photos taken", shared: true },
    { id: "first-impression", durationMinutes: 2, type: "private_choice", inputType: "name", waitForAllParticipants: true, shared: false },
    { id: "eye-contact", durationMinutes: 1, type: "low_contact", inputType: "completion", completionLabel: "10 seconds finished", shared: true },
    { id: "cafe-free-time", durationMinutes: 29, type: "free_time", inputType: "none", shared: true },
    { id: "private-window", durationMinutes: 10, type: "private_window", inputType: "name", waitForAllParticipants: true, shared: false },
    { id: "stay-linked", durationMinutes: 15, type: "light_closeness", inputType: "completion", completionLabel: "15 minutes finished", shared: true, removableProp: true },
    { id: "final-signal", durationMinutes: 0, delayBeforeMinutes: 15, type: "final_signal", inputType: "name", waitForAllParticipants: true, locksAfterSubmit: true, shared: false },
    { id: "waiting", durationMinutes: 0, type: "waiting", inputType: "none", shared: false },
    { id: "midnight-reveal", durationMinutes: 0, type: "midnight_reveal", inputType: "none", shared: false },
  ],
  simulatedResults: {
    bookletSelections: cafeCanonicalBookletSelections,
    firstImpressions: cafeCanonicalFirstImpressions,
    privateWindowChoices: { jacob: "nia", kayla: "avery", nia: "jacob", avery: "nia" },
    finalSignals: { jacob: "nia", kayla: "avery", nia: "jacob", avery: "kayla" },
  },
};

const workshopInitialPairing = workshopGroupFormation?.configurations[0] || [];
const workshopSecondPairing = workshopGroupFormation?.configurations[1] || [];
const workshopCanonicalBookletSelections = Object.fromEntries(
  workshopInitialPairing.flatMap(([firstId, secondId]) => [
    [firstId, secondId],
    [secondId, firstId],
  ]),
);
const workshopCanonicalFirstImpressions = Object.fromEntries(
  workshopSecondPairing.flatMap(([firstId, secondId]) => [
    [firstId, secondId],
    [secondId, firstId],
  ]),
);
const workshopDateFlow = {
  id: "fresh-spaghetti-workshop",
  category: "structured_workshop",
  title: "Fresh Spaghetti Workshop",
  venue: "La Scuola at Eataly Los Angeles · Century City",
  venueName: "La Scuola at Eataly Los Angeles",
  neighborhood: "Century City",
  city: "Los Angeles",
  venueType: "cooking_school",
  supportedActivity: "hands_on_pasta_class",
  environment: "teaching kitchen",
  durationLabel: "Approximately 2 Hours",
  image: groupPhotos.pastaWorkshop,
  lede: "make fresh pasta, trade roles, and see how well you move through a kitchen together.",
  detailSummary: "Make spaghetti from scratch, rotate partners, then sit down to eat it together.",
  preDateFormat: workshopGroupFormation?.explanation.preDateFormat,
  pairings: {
    rolePick: workshopInitialPairing,
    sensoryKitchen: workshopSecondPairing,
    stayLinkedDinner: workshopSecondPairing,
  },
  naturalIntervals: {
    "sensory-kitchen": 2,
  },
  phases: [
    { id: "arrival", durationMinutes: 10, type: "intro", inputType: "none", shared: true },
    { id: "workshop-role-pick", durationMinutes: 5, type: "low_contact", inputType: "completion", completionLabel: "Role pick finished", shared: true },
    { id: "workshop-cooking", durationMinutes: 28, type: "structured_workshop", inputType: "none", shared: true },
    { id: "first-impression", durationMinutes: 2, type: "private_choice", inputType: "name", waitForAllParticipants: true, shared: false },
    { id: "sensory-kitchen", durationMinutes: 18, type: "low_contact", inputType: "completion", completionLabel: "Challenge finished", shared: true },
    { id: "workshop-free-time", durationMinutes: 20, type: "free_time", inputType: "none", shared: true },
    { id: "private-window", durationMinutes: 10, type: "private_window", inputType: "name", waitForAllParticipants: true, shared: false },
    { id: "stay-linked-dinner", durationMinutes: 15, type: "light_closeness", inputType: "completion", completionLabel: "15 minutes finished", shared: true, removableProp: true },
    { id: "final-signal", durationMinutes: 0, delayBeforeMinutes: 18, type: "final_signal", inputType: "name", waitForAllParticipants: true, locksAfterSubmit: true, shared: false },
    { id: "waiting", durationMinutes: 0, type: "waiting", inputType: "none", shared: false },
    { id: "midnight-reveal", durationMinutes: 0, type: "midnight_reveal", inputType: "none", shared: false },
  ],
  simulatedResults: {
    bookletSelections: workshopCanonicalBookletSelections,
    firstImpressions: workshopCanonicalFirstImpressions,
    rolePickRepresentatives: workshopInitialPairing.map((pair) => pair[0]),
    rolePickWinner: workshopInitialPairing[0]?.[0],
    workshopResponsibilities: {
      [workshopInitialPairing[0]?.slice().sort().join(":") || "pair-1"]: "make and knead the pasta dough",
      [workshopInitialPairing[1]?.slice().sort().join(":") || "pair-2"]: "prepare the sauce and organize plating",
    },
    privateWindowChoices: { jacob: "nia", olivia: "lucas", lucas: "nia", nia: "jacob" },
    finalSignals: { jacob: "nia", olivia: "lucas", lucas: "olivia", nia: "jacob" },
  },
};

const LOS_ANGELES_AREA_CITIES = new Set(["Los Angeles"]);
const SUPPORTED_ACTIVITIES_BY_CATEGORY = {
  nature: new Set(["beach_cookout"]),
  indoor_seated: new Set(["dessert_and_coffee"]),
  structured_workshop: new Set(["hands_on_pasta_class"]),
};

function validateDatePlanVenue(dateFlow) {
  const requiredFields = ["venueName", "neighborhood", "city", "venueType", "supportedActivity"];
  const hasRequiredFields = requiredFields.every((field) => (
    typeof dateFlow[field] === "string" && dateFlow[field].trim()
  ));
  const cityIsSupported = LOS_ANGELES_AREA_CITIES.has(dateFlow.city);
  const activityIsSupported = SUPPORTED_ACTIVITIES_BY_CATEGORY[dateFlow.category]
    ?.has(dateFlow.supportedActivity);
  if (!hasRequiredFields || !cityIsSupported || !activityIsSupported) {
    throw new Error(`Invalid venue metadata for date plan: ${dateFlow.id}`);
  }
  return true;
}

[beachDateFlow, cafeDateFlow, workshopDateFlow].forEach(validateDatePlanVenue);

const activeDateFlow = isWorkshopScenario
  ? workshopDateFlow
  : isCafeScenario
    ? cafeDateFlow
    : beachDateFlow;
const usesRelationshipBooklet = activeDateFlow.preDateFormat === "relationship_booklet";
const usesEligibilityLimitedChoices = isCafeScenario || isWorkshopScenario;

function createLiveDateState() {
  const participantRecords = Object.fromEntries(selectedIds.map((id) => [id, {
    messages: [],
    firstImpressionChoice: undefined,
    privateWindowChoice: undefined,
    privateWindowOutcome: undefined,
    finalSignal: undefined,
    finalSignalLocked: false,
    midnightResult: undefined,
    instagramShareChoice: undefined,
    instagramShareLocked: false,
  }]));
  return {
    activeParticipantId: defaultParticipantId,
    currentPhaseId: undefined,
    phaseStartTimes: {},
    phaseCompletionTimes: {},
    submittedPhotos: {},
    photoSelections: {},
    submittedBooklets: {},
    bookletOptionsByParticipant: {},
    bookletSelections: {},
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
    firstImpressionsResolved: false,
    eyeContactPairing: [],
    eyeContactCompleted: false,
    stayLinkedCompleted: false,
    workshopRolePickResult: undefined,
    workshopResponsibilities: {},
    sensoryKitchenCompleted: false,
    stayLinkedDinnerCompleted: false,
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
  availabilityEntries: [],
  availabilityByParticipant: {},
  sharedAvailability: [],
  uploadedPostcard: undefined,
  postcardSelection: undefined,
  bookletSelection: undefined,
  bookletReviewed: new Set(),
  openBookletOwnerId: undefined,
  bookletPageIndex: 0,
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
  participantState.availabilityEntries = [];
  participantState.availabilityByParticipant = {};
  participantState.sharedAvailability = [];
  participantState.uploadedPostcard = undefined;
  participantState.postcardSelection = undefined;
  participantState.bookletSelection = undefined;
  participantState.bookletReviewed = new Set();
  participantState.openBookletOwnerId = undefined;
  participantState.bookletPageIndex = 0;
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
              <span class="application-pass-copy">
                <strong>${person.name}</strong>
                <small>${person.major}</small>
                <small class="application-intentions">Looking for: ${relationshipIntentionLabels(person).join(" · ")}</small>
              </span>
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

      <div class="sheet-row">
        <h3>Looking for</h3>
        <div class="tag-row">${relationshipIntentionLabels(person).map((intention) => `<small>${intention}</small>`).join("")}</div>
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
            const selectedIndex = selectedIds.indexOf(person.id);
            const final = selectedIndex >= 0
              ? Object.values(formationFinalPositions)[selectedIndex]
              : pos;
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
  const groupExplanation = isWorkshopScenario
    ? workshopGroupFormation.explanation
    : isCafeScenario
      ? cafeGroupFormation.explanation
      : explainCandidateGroup(selectedGroup, futurePairingConfigurations(selectedGroup));
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
              <span style="--delay:120ms">shared mode: ${relationshipIntentionLabel(groupExplanation.sharedRelationshipIntention)}</span>
              <span style="--delay:220ms">the energy won't flatline</span>
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
              <h1>${activeDateFlow.title}</h1>
              <p class="date-lede">${activeDateFlow.lede || "cook something, chase the sunset, see who stays by the fire."}</p>
              <div class="date-meta">
                <div><span>Location</span><strong>${activeDateFlow.venue}</strong></div>
                <div><span>Duration</span><strong>${activeDateFlow.durationLabel || "Approximately 3 Hours"}</strong></div>
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
        <div class="phone-frame" aria-label="${personById(defaultParticipantId).name}'s phone">
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
          ${selectedGroup.map((person) => `<button data-participant-action="switch-pov" data-pov-id="${person.id}" class="${person.id === defaultParticipantId ? "is-active" : ""}">${person.name}</button>`).join("")}
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
      if (index > 0) advanceSimulatedTime(1);
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
  const [first, second, third, fourth] = selectedIds;
  const candidates = [
    [[first, second], [third, fourth]],
    [[first, third], [second, fourth]],
    [[first, fourth], [second, third]],
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

function storeBookletSelection(selectedByUserId, selectedBookletOwnerId) {
  if (!resolveFirstPairing(selectedByUserId, selectedBookletOwnerId)) return false;
  liveDateState.firstPairing.forEach(([firstId, secondId]) => {
    liveDateState.bookletSelections[firstId] = secondId;
    liveDateState.bookletSelections[secondId] = firstId;
  });
  return true;
}

function ensureLiveDateBookletState() {
  selectedIds.forEach((participantId) => {
    if (!liveDateState.submittedBooklets[participantId]) {
      liveDateState.submittedBooklets[participantId] = relationshipBookletFor(participantId);
    }
    liveDateState.bookletOptionsByParticipant[participantId] = eligiblePeopleFor(participantId).map((person) => person.id);
  });
  if (!liveDateState.firstPairingResolved) {
    const selectedBookletOwnerId = liveDateState.bookletSelections[defaultParticipantId]
      || activeDateFlow.simulatedResults.bookletSelections[defaultParticipantId];
    storeBookletSelection(defaultParticipantId, selectedBookletOwnerId);
  }
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
    "submit-booklet": submitRelationshipBooklet,
    "open-booklet": openRelationshipBooklet,
    "booklet-previous-page": showPreviousRelationshipBookletPage,
    "booklet-next-page": showNextRelationshipBookletPage,
    "close-booklet": closeRelationshipBooklet,
    "select-booklet": selectRelationshipBooklet,
    "confirm-booklet": confirmRelationshipBookletSelection,
    "reminder-details": showReminderDetails,
    "reminder-got-it": showDateStart,
    "arrival-complete": confirmArrival,
    "arrival-missing": checkMissingParticipant,
    "arrival-complete-after-check": confirmArrivalAfterCheck,
    "game-finished": finishLinkedDodgeball,
    "photos-taken": finishCouplePhotoChallenge,
    "first-impression-submit": submitFirstImpression,
    "eye-contact-finished": finishEyeContact,
    "workshop-role-pick-finished": finishWorkshopRolePick,
    "sensory-kitchen-finished": finishSensoryKitchenChallenge,
    "stay-linked-dinner-finished": finishStayLinkedDinner,
    "setup-complete": finishCookoutSetup,
    "match-finished": finishArmWrestling,
    "stay-linked-finished": finishStayLinked,
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
    if (first.id === defaultParticipantId) return 1;
    if (second.id === defaultParticipantId) return -1;
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
            <article class="participant-profile-card ${person.id === defaultParticipantId ? "is-self" : ""}" style="--delay:${index * 90}ms">
              ${portrait(person, "participant-profile-photo")}
              <div class="participant-profile-copy">
                <div class="participant-profile-heading"><strong>${person.name}</strong>${person.id === defaultParticipantId ? "<span>You</span>" : ""}</div>
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
  const otherParticipantIds = selectedIds.filter((id) => id !== defaultParticipantId);
  const confirmationLines = ["I'm checking with everyone else.", "Sit tight."];
  appendIncoming(["Awesome."]);
  scheduleParticipant(() => {
    advanceSimulatedTime(1);
    showParticipantTyping(() => {
      appendIncoming(confirmationLines);
      const status = appendConversation(`
          <div class="message-row attachment-row">
            <div class="confirmation-progress" data-confirmation-progress>
              <div class="confirmation-line is-complete">${personById(defaultParticipantId).name} confirmed</div>
              ${otherParticipantIds.map((participantId, index) => {
                const waitingText = index === 0
                  ? `Checking with ${personById(participantId).name}...`
                  : index === otherParticipantIds.length - 1
                    ? "Waiting for one more person"
                    : `Waiting for ${personById(participantId).name}`;
                return `<div class="confirmation-line" data-confirmation="${participantId}">${waitingText}</div>`;
              }).join("")}
            </div>
          </div>
        `);
      const update = (id, text, delay) => scheduleParticipant(() => {
        const line = status.querySelector(`[data-confirmation='${id}']`);
        line.textContent = text;
        line.classList.add("is-complete");
        scrollParticipantThread();
      }, delay);
      otherParticipantIds.forEach((participantId, index) => {
        update(participantId, `${personById(participantId).name} confirmed`, 650 + index * 600);
      });
      scheduleParticipant(() => {
        advanceSimulatedTime(6);
        const everyoneLines = ["Everyone's in."];
        showParticipantTyping(() => {
          appendIncoming(everyoneLines);
          scheduleParticipant(() => {
            advanceSimulatedTime(1);
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

function availabilityDaypart(daypartId) {
  return AVAILABILITY_DAYPARTS.find((daypart) => daypart.id === daypartId);
}

function availabilityEntryFor(dateKey, daypartId) {
  const day = rollingAvailabilityDays.find((candidate) => candidate.dateKey === dateKey);
  const daypart = availabilityDaypart(daypartId);
  if (!day || !daypart) return undefined;
  return {
    dateKey: day.dateKey,
    dateLabel: day.label,
    weekday: day.weekday,
    daypart: daypart.id,
    daypartLabel: daypart.label,
    startMinute: daypart.startMinute,
    endMinute: daypart.endMinute,
  };
}

function structuredAvailabilityForProfile(profile) {
  const patterns = new Set(profile.availabilitySlots);
  return rollingAvailabilityDays.flatMap((day) => (
    AVAILABILITY_DAYPARTS
      .filter((daypart) => patterns.has(`${SIMULATED_WEEKDAYS[day.weekday]} ${daypart.label}`))
      .map((daypart) => availabilityEntryFor(day.dateKey, daypart.id))
  ));
}

function rollingSharedAvailabilityForGroup(group) {
  if (group.length === 0) return [];
  const availabilityByProfile = group.map((profile) => structuredAvailabilityForProfile(profile));
  return availabilityByProfile[0].filter((entry) => {
    const key = availabilityEntryKey(entry);
    return availabilityByProfile.every((entries) => (
      entries.some((candidate) => availabilityEntryKey(candidate) === key)
    ));
  });
}

function sharedAvailabilityForSelectedGroup(userEntries) {
  const availabilityByParticipant = Object.fromEntries(selectedGroup.map((profile) => [
    profile.id,
    profile.id === defaultParticipantId
      ? userEntries.map((entry) => ({ ...entry }))
      : structuredAvailabilityForProfile(profile),
  ]));
  const sharedAvailability = availabilityByParticipant[defaultParticipantId].filter((entry) => {
    const key = availabilityEntryKey(entry);
    return selectedIds.every((participantId) => (
      availabilityByParticipant[participantId].some((candidate) => availabilityEntryKey(candidate) === key)
    ));
  });
  return { availabilityByParticipant, sharedAvailability };
}

function availabilityPicker() {
  return app.querySelector("[data-control='availability'] .availability-picker");
}

function renderAvailabilityGrid() {
  const picker = availabilityPicker();
  if (!picker) return;
  const selectedKeys = new Set(participantState.availabilityEntries.map(availabilityEntryKey));
  picker.innerHTML = `
    <p class="participant-kicker">Select every time that works</p>
    <div class="availability-grid" role="group" aria-label="Availability for the next seven days">
      <div class="availability-grid-header" aria-hidden="true">
        <span>Day</span>
        ${AVAILABILITY_DAYPARTS.map((daypart) => `<span>${daypart.label}</span>`).join("")}
      </div>
      ${rollingAvailabilityDays.map((day) => `
        <div class="availability-grid-row">
          <span class="availability-grid-day">${day.label}</span>
          ${AVAILABILITY_DAYPARTS.map((daypart) => {
            const key = `${day.dateKey}:${daypart.id}`;
            return `
              <label class="availability-grid-option" title="${day.label}, ${daypart.label}">
                <input
                  type="checkbox"
                  name="availability-slot"
                  data-date-key="${day.dateKey}"
                  data-daypart="${daypart.id}"
                  aria-label="${day.label}, ${daypart.label}"
                  ${selectedKeys.has(key) ? "checked" : ""}
                >
                <span aria-hidden="true"></span>
              </label>
            `;
          }).join("")}
        </div>
      `).join("")}
    </div>
    <button class="inline-primary" data-participant-action="submit-availability" ${selectedKeys.size === 0 ? "disabled" : ""}>Submit Availability</button>
    <p class="inline-message-validation" data-availability-status aria-live="polite"></p>
  `;
  picker.querySelectorAll("input[name='availability-slot']").forEach((input) => {
    input.addEventListener("change", syncAvailabilityGrid);
  });
  scrollParticipantThread();
}

function syncAvailabilityGrid(event) {
  const picker = event.target.closest(".availability-picker");
  participantState.availabilityEntries = [...picker.querySelectorAll("input[name='availability-slot']:checked")]
    .map((input) => availabilityEntryFor(input.dataset.dateKey, input.dataset.daypart))
    .filter(Boolean)
    .sort((left, right) => (
      left.dateKey.localeCompare(right.dateKey)
      || left.startMinute - right.startMinute
    ));
  picker.querySelector("[data-participant-action='submit-availability']").disabled = (
    participantState.availabilityEntries.length === 0
  );
  const status = picker.querySelector("[data-availability-status]");
  if (status) status.textContent = "";
}

function renderAvailability() {
  setParticipantScreen(12);
  const lines = [
    "Now let's find a time that works for everyone.",
    "Choose the days and times you're available over the next seven days, starting tomorrow.",
  ];
  showParticipantTyping(() => {
    appendIncoming(lines);
    appendConversation(`
      <div class="message-row attachment-row" data-control="availability">
        <div class="availability-picker"></div>
      </div>
    `);
    renderAvailabilityGrid();
  }, lines);
}

function submitAvailability() {
  if (participantState.availabilityEntries.length === 0) return;
  const availabilityResult = sharedAvailabilityForSelectedGroup(participantState.availabilityEntries);
  const nextSchedule = createSimulatedSchedule(sessionAnchorDate, availabilityResult.sharedAvailability);
  participantState.availabilityByParticipant = availabilityResult.availabilityByParticipant;
  participantState.sharedAvailability = availabilityResult.sharedAvailability;
  if (!Number.isFinite(nextSchedule.liveDateTimestampMinutes)) {
    const status = app.querySelector("[data-availability-status]");
    if (status) status.textContent = "That time doesn't line up with everyone yet. Add another day or time.";
    return;
  }
  Object.assign(simulatedSchedule, nextSchedule);
  completeControl("availability");
  advanceSimulatedTime(5);
  appendOutgoing(participantState.availabilityEntries.map(availabilityEntryLabel).join(" · "));
  scheduleParticipant(() => {
    advanceSimulatedTime(5);
    renderPlanningProgress();
  }, 500);
}

function renderPlanningProgress() {
  setParticipantScreen(13);
  appendPacedIncoming([
    [
      "Perfect.",
      `Everyone overlaps on ${simulatedSchedule.selectedAvailability.dateLabel} at ${scheduledStartTime()}.`,
    ],
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
          <img src="${activeDateFlow.image}" alt="${activeDateFlow.title}">
          <div class="experience-card-copy">
            <p class="participant-kicker">${formatSimulatedCalendarDate(simulatedSchedule.liveDateTimestampMinutes)} · ${scheduledStartTime()}</p>
            <h2>${activeDateFlow.title}</h2>
            <p>${activeDateFlow.detailSummary}</p>
            <span>${activeDateFlow.venue}</span>
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
  const experienceFacts = isWorkshopScenario
    ? `
        <div><span>Time</span><strong>${scheduledStartTime()}–${formatSimulatedTime(simulatedSchedule.liveDateTimestampMinutes + 120)}</strong></div>
        <div><span>Meet</span><strong>${activeDateFlow.venue}</strong></div>
        <div><span>Setting</span><strong>Teaching kitchen · Hands-on class</strong></div>
        <div><span>Wear</span><strong>Something comfortable for cooking</strong></div>
        <div><span>Bring</span><strong>Just yourself</strong></div>
        <div><span>Getting there</span><strong>Metro or rideshare · allow 30–45 minutes</strong></div>
      `
    : isCafeScenario
      ? `
        <div><span>Time</span><strong>${scheduledStartTime()}–${formatSimulatedTime(simulatedSchedule.liveDateTimestampMinutes + 90)}</strong></div>
        <div><span>Meet</span><strong>${activeDateFlow.venue}</strong></div>
        <div><span>Estimated cost</span><strong>$18–$25</strong></div>
        <div><span>Setting</span><strong>Reserved table · Indoor seating</strong></div>
        <div><span>Wear</span><strong>Whatever feels like you</strong></div>
        <div><span>Bring</span><strong>Just yourself</strong></div>
        <div><span>Getting there</span><strong>Metro or rideshare · allow 25–35 minutes</strong></div>
        `
      : `
        <div><span>Time</span><strong>${scheduledStartTime()}–8:30 PM</strong></div>
        <div><span>Meet</span><strong>${beachDateFlow.venue}</strong></div>
        <div><span>Estimated cost</span><strong>$15–$20</strong></div>
        <div><span>Weather</span><strong>22°C and clear</strong></div>
        <div><span>Wear</span><strong>Something comfortable you can move in</strong></div>
        <div><span>Bring</span><strong>A light hoodie and water</strong></div>
        <div><span>Getting there</span><strong>Rideshare from UCLA · allow 35–45 minutes</strong></div>
        `;
  const experiencePreview = isWorkshopScenario
    ? "<span>Meet the group</span><span>Anonymous opening</span><span>Fresh pasta workshop</span><span>Dinner together</span><span>Final group moment</span>"
    : isCafeScenario
      ? "<span>Meet the group</span><span>Anonymous opening</span><span>Cafe challenge</span><span>Dessert and coffee</span><span>Final group moment</span>"
      : "<span>Meet the group</span><span>Create something together</span><span>Team challenge</span><span>Food and sunset</span><span>Final group moment</span>";
  card.innerHTML = `
    <img src="${activeDateFlow.image}" alt="${activeDateFlow.title}">
    <div class="experience-card-copy experience-details-copy">
      <p class="participant-kicker">${formatSimulatedCalendarDate(simulatedSchedule.liveDateTimestampMinutes)}</p>
      <h2>${activeDateFlow.title}</h2>
      <div class="experience-facts">
        ${experienceFacts}
      </div>
      <div class="experience-preview">${experiencePreview}</div>
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
  if (usesRelationshipBooklet) {
    startRelationshipBooklet(button);
    return;
  }
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

function startRelationshipBooklet(button) {
  button.closest(".inline-action-pair").querySelectorAll("button").forEach((item) => { item.disabled = true; });
  advanceSimulatedTime(2);
  appendOutgoing("Got it");
  setParticipantScreen(16);
  appendPacedIncoming([
    ["That's everything you need for now.", "I'll handle the rest when the date begins."],
    ["One thing before the date."],
    ["Complete this anonymous relationship booklet.", "Keep the answers short and honest."],
  ], () => {
    const control = appendConversation(`
      <div class="message-row attachment-row" data-control="booklet-upload">
        <div class="postcard-upload-card relationship-booklet-form">
          ${RELATIONSHIP_BOOKLET_QUESTIONS.map((question, questionIndex) => `
            <section>
              <p><strong>${questionIndex + 1}. ${escapeHtml(question.prompt)}</strong></p>
              <textarea class="relationship-booklet-answer" data-booklet-text="${question.id}" aria-label="${escapeHtml(question.prompt)}" maxlength="180" rows="2" placeholder="Write a short answer"></textarea>
            </section>
          `).join("")}
          <p>Your name and profile details will not be attached.</p>
          <p class="inline-message-validation" data-booklet-validation aria-live="polite"></p>
          <button class="inline-primary" data-participant-action="submit-booklet" disabled>Submit Booklet</button>
        </div>
      </div>
    `);
    initializeRelationshipBookletForm(control);
  });
}

function readRelationshipBookletForm(control) {
  const answers = {};
  let complete = true;

  RELATIONSHIP_BOOKLET_QUESTIONS.forEach((question) => {
    const answer = control.querySelector(`[data-booklet-text='${question.id}']`).value.trim();
    answers[question.id] = answer;
    complete = complete && Boolean(answer);
  });

  return { answers, complete };
}

function updateRelationshipBookletForm(control) {
  const result = readRelationshipBookletForm(control);
  control.querySelector("[data-participant-action='submit-booklet']").disabled = !result.complete;
  if (result.complete) control.querySelector("[data-booklet-validation]").textContent = "";
}

function initializeRelationshipBookletForm(control) {
  control.querySelectorAll("textarea").forEach((input) => {
    input.addEventListener("input", () => {
      updateRelationshipBookletForm(control);
    });
  });
  updateRelationshipBookletForm(control);
}

function submitRelationshipBooklet() {
  const control = app.querySelector("[data-control='booklet-upload']");
  const result = readRelationshipBookletForm(control);
  if (!result.complete) {
    control.querySelector("[data-booklet-validation]").textContent = "Complete all six questions before submitting.";
    return;
  }

  liveDateState.submittedBooklets[defaultParticipantId] = relationshipBookletFor(
    defaultParticipantId,
    result.answers,
  );
  selectedIds.forEach((participantId) => {
    if (!liveDateState.submittedBooklets[participantId]) {
      liveDateState.submittedBooklets[participantId] = relationshipBookletFor(participantId);
    }
    liveDateState.bookletOptionsByParticipant[participantId] = eligiblePeopleFor(participantId).map((person) => person.id);
  });
  completeControl("booklet-upload");
  advanceSimulatedTime(3);
  appendOutgoing("Booklet submitted");
  appendPacedIncoming([
    ["Everyone completed one."],
    ["I'm sending you two anonymous booklets.", "Pick the one you want to talk about first."],
  ], renderEligibleBooklets);
}

function renderEligibleBooklets() {
  const eligibleOwnerIds = liveDateState.bookletOptionsByParticipant[defaultParticipantId];
  const picker = appendConversation(`
    <div class="message-row attachment-row" data-control="booklet-selection">
      <div class="anonymous-postcard-picker relationship-booklet-picker" data-booklet-owner-ids="${eligibleOwnerIds.join(",")}">
        <div class="relationship-booklet-library" data-booklet-library></div>
        <div class="relationship-booklet-reader" data-booklet-reader hidden></div>
        <div class="relationship-booklet-choices" data-booklet-choices hidden>
          <p>Which booklet do you want to talk about first?</p>
          <div class="message-actions">
            ${eligibleOwnerIds.map((ownerId, index) => `
              <button class="relationship-booklet-choice" aria-pressed="false" data-participant-action="select-booklet" data-booklet-owner="${ownerId}">
                Choose Booklet ${String.fromCharCode(65 + index)}
              </button>
            `).join("")}
          </div>
          <button class="inline-primary" data-participant-action="confirm-booklet" disabled>Pick This Booklet</button>
        </div>
      </div>
    </div>
  `);
  refreshRelationshipBookletPicker(picker.querySelector(".relationship-booklet-picker"));
}

function relationshipBookletOwnerIds(picker) {
  return picker.dataset.bookletOwnerIds.split(",");
}

function refreshRelationshipBookletPicker(picker) {
  const ownerIds = relationshipBookletOwnerIds(picker);
  const library = picker.querySelector("[data-booklet-library]");
  const reader = picker.querySelector("[data-booklet-reader]");
  const choices = picker.querySelector("[data-booklet-choices]");
  library.innerHTML = ownerIds.map((ownerId, index) => {
    const label = String.fromCharCode(65 + index);
    const wasRead = participantState.bookletReviewed.has(ownerId);
    return `
      <button class="relationship-booklet-cover cover-${label.toLowerCase()}" aria-label="Open anonymous Booklet ${label}" data-participant-action="open-booklet" data-booklet-owner="${ownerId}">
        <span class="relationship-booklet-binding" aria-hidden="true"></span>
        <small>Anonymous notes</small>
        <strong>Booklet ${label}</strong>
        <em>${wasRead ? "Read" : "Six pages"}</em>
      </button>
    `;
  }).join("");
  library.hidden = false;
  reader.hidden = true;
  choices.hidden = participantState.bookletReviewed.size < ownerIds.length;
}

function openRelationshipBooklet(button) {
  const picker = button.closest(".relationship-booklet-picker");
  participantState.openBookletOwnerId = button.dataset.bookletOwner;
  participantState.bookletPageIndex = 0;
  picker.querySelector("[data-booklet-library]").hidden = true;
  picker.querySelector("[data-booklet-choices]").hidden = true;
  picker.querySelector("[data-booklet-reader]").hidden = false;
  renderRelationshipBookletPage(picker);
}

function renderRelationshipBookletPage(picker) {
  const ownerIds = relationshipBookletOwnerIds(picker);
  const ownerId = participantState.openBookletOwnerId;
  const booklet = liveDateState.submittedBooklets[ownerId];
  const pageIndex = participantState.bookletPageIndex;
  const item = booklet[pageIndex];
  const bookletLabel = String.fromCharCode(65 + ownerIds.indexOf(ownerId));
  const reader = picker.querySelector("[data-booklet-reader]");
  reader.innerHTML = `
    <div class="relationship-booklet-page cover-${bookletLabel.toLowerCase()}">
      <div class="relationship-booklet-page-meta">
        <span>Booklet ${bookletLabel}</span>
        <span>${pageIndex + 1} / ${booklet.length}</span>
      </div>
      <p>${escapeHtml(item.question)}</p>
      <blockquote>${escapeHtml(item.answer)}</blockquote>
      <div class="relationship-booklet-page-controls">
        <button class="inline-secondary" data-participant-action="booklet-previous-page" ${pageIndex === 0 ? "disabled" : ""}>Previous</button>
        <button class="inline-primary" data-participant-action="booklet-next-page">${pageIndex === booklet.length - 1 ? "Finish" : "Next"}</button>
      </div>
      <button class="relationship-booklet-back" data-participant-action="close-booklet">Back to covers</button>
    </div>
  `;
  scrollParticipantThread();
}

function showPreviousRelationshipBookletPage(button) {
  if (participantState.bookletPageIndex === 0) return;
  participantState.bookletPageIndex -= 1;
  renderRelationshipBookletPage(button.closest(".relationship-booklet-picker"));
}

function showNextRelationshipBookletPage(button) {
  const booklet = liveDateState.submittedBooklets[participantState.openBookletOwnerId];
  if (participantState.bookletPageIndex < booklet.length - 1) {
    participantState.bookletPageIndex += 1;
    renderRelationshipBookletPage(button.closest(".relationship-booklet-picker"));
    return;
  }
  participantState.bookletReviewed.add(participantState.openBookletOwnerId);
  closeRelationshipBooklet(button);
}

function closeRelationshipBooklet(button) {
  const picker = button.closest(".relationship-booklet-picker");
  participantState.openBookletOwnerId = undefined;
  participantState.bookletPageIndex = 0;
  refreshRelationshipBookletPicker(picker);
  scrollParticipantThread();
}

function selectRelationshipBooklet(button) {
  const picker = button.closest(".relationship-booklet-picker");
  picker.querySelectorAll(".relationship-booklet-choice").forEach((booklet) => {
    booklet.classList.remove("is-selected");
    booklet.setAttribute("aria-pressed", "false");
  });
  button.classList.add("is-selected");
  button.setAttribute("aria-pressed", "true");
  participantState.bookletSelection = button.dataset.bookletOwner;
  picker.querySelector("[data-participant-action='confirm-booklet']").disabled = false;
}

function confirmRelationshipBookletSelection() {
  if (!participantState.bookletSelection) return;
  if (!storeBookletSelection(defaultParticipantId, participantState.bookletSelection)) return;
  completeControl("booklet-selection");
  advanceSimulatedTime(2);
  appendOutgoing("Picked one");
  appendPacedIncoming([
    ["Got it."],
    ["The owner stays anonymous until the date."],
  ], () => scheduleParticipant(renderOneDayReminder, 800));
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
  const scenarioReminderLines = isWorkshopScenario
    ? ["Your workshop spots are reserved.", "Come ready to cook and eat."]
    : isCafeScenario
      ? ["Your table is reserved.", "Come ready for dessert and coffee."]
      : ["Looks like 22°C and clear.", "Bring a light hoodie for later."];
  const lines = [
    `${liveDateDayLabel} 👀`,
    activeDateFlow.title,
    `${liveDateDayLabel} at ${scheduledStartTime()}`,
    activeDateFlow.venue,
    "Everyone's still in.",
    ...scenarioReminderLines,
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
        <img src="${activeDateFlow.image}" alt="${activeDateFlow.title}">
        <div><strong>${simulatedWeekdayLabel(simulatedSchedule.liveDateTimestampMinutes)} · ${scheduledStartTime()}</strong><span>${activeDateFlow.venue}</span><span>${isWorkshopScenario ? "Teaching kitchen · Fresh pasta" : isCafeScenario ? "Indoor table · Dessert and coffee" : "22°C and clear · Bring a light hoodie"}</span></div>
      </div>
    </div>
  `);
}

function showDateStart() {
  completeControl("reminder");
  appendOutgoing("Got it");
  setParticipantScreen(18);
  const privacyLines = [
    "One rule for tomorrow:",
    "Keep your age, occupation, and contact details private. I'll let you know when each one unlocks.",
  ];
  scheduleParticipant(() => {
    showParticipantTyping(() => {
      appendIncoming(privacyLines);
      scheduleParticipant(beginDateStart, readingPauseMs(privacyLines));
    }, privacyLines);
  }, 700);
}

function beginDateStart() {
  setSimulatedTime(simulatedSchedule.liveDateTimestampMinutes);
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
  }, 250);
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
      advanceSimulatedTime(1);
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
  return activeDateFlow.phases.find((phase) => phase.id === id);
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

function advanceNaturalTime(nextPhaseId, durationMinutes = DEFAULT_NATURAL_TIME_INTERVAL_MINUTES) {
  const configuredDuration = activeDateFlow.naturalIntervals?.[nextPhaseId] ?? durationMinutes;
  if (configuredDuration > 0) advanceSimulatedTime(configuredDuration);
  return configuredDuration;
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
  const requiresSnapshot = participantChanged || (!renderedParticipantId && participantId !== defaultParticipantId);

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
        copy.timestampMinutes = previousTimestamp + 1;
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
  const partnerId = liveDateState.firstPairing
    .find((pair) => pair.includes(participantId))
    ?.find((candidateId) => candidateId !== participantId);
  const participantIsSelector = participantId === selectedBy.id;
  const participantIsOwner = participantId === photoOwner.id;

  let intro;
  let ownerLine;

  if (participantIsSelector) {
    intro = "Remember the photo you picked?";
    ownerLine = `That was ${photoOwner.name}'s.`;
  } else if (participantIsOwner) {
    intro = `${selectedBy.name} picked your photo earlier.`;
    ownerLine = `${selectedBy.name} selected yours.`;
  } else {
    intro = `${selectedBy.name} picked this photo earlier.`;
    ownerLine = `It belongs to ${photoOwner.name}.`;
  }

  return [
    incomingDateEntry([intro]),
    controlDateEntry(`postcard-reveal-${participantId}`, `
      <article class="postcard-reveal-pass">
        <img src="${selectedPhoto}" alt="Selected anonymous postcard">
      </article>
    `),
    incomingDateEntry([ownerLine]),
    incomingDateEntry([`${personById(partnerId).name} is your first partner.`]),
  ];
}

function bookletRevealFor(participantId) {
  const ownerId = liveDateState.bookletSelections[participantId];
  const owner = personById(ownerId);
  return [
    incomingDateEntry(["Remember the booklet you picked?"]),
    controlDateEntry(`booklet-reveal-${participantId}`, `
      <article class="postcard-reveal-pass">
        <div class="postcard-owner-reveal"><span>Booklet selected</span><strong>Anonymous</strong></div>
      </article>
    `),
    incomingDateEntry([`It belongs to ${owner.name}.`]),
    incomingDateEntry([`${owner.name} is your first partner.`]),
  ];
}

function beginLiveDate() {
  if (liveDateState.dateStarted) return;
  liveDateState.dateStarted = true;
  if (usesRelationshipBooklet) {
    ensureLiveDateBookletState();
  } else {
    ensureLiveDatePostcardState();
  }
  initializeLiveDateClock();
  liveDateState.preDateHtmlByParticipant[defaultParticipantId] = participantConversation().innerHTML;
  const defaultParticipantAlreadyHasCurrentDivider = Boolean(app.querySelector(
    `[data-date-separator-timestamp="${simulatedTimeline.currentTimestampMinutes}"]`,
  ));
  app.querySelector("[data-pov-switch]").hidden = false;
  setParticipantScreen(19);

  setLiveDatePhase("arrival");
  liveDateState.phaseAppended.arrival = true;
  selectedIds.forEach((participantId) => {
    const divider = participantId === defaultParticipantId && defaultParticipantAlreadyHasCurrentDivider
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
    addSharedDateEntries([incomingDateEntry(["Quick reminder: keep your age, occupation, and contact details private for now."])], "phase-arrival-information-privacy");
    renderActiveDateThread();
  }, 1050, "live-arrival-information-privacy");
  scheduleParticipant(() => {
    selectedIds.forEach((participantId) => {
      const revealEntries = usesRelationshipBooklet
        ? bookletRevealFor(participantId)
        : postcardRevealFor(participantId);
      addDateEntries([participantId], revealEntries, usesRelationshipBooklet
        ? "phase-arrival-booklet-reveal"
        : "phase-arrival-postcard-reveal");
    });
    renderActiveDateThread();
  }, 1400, usesRelationshipBooklet ? "live-arrival-booklet-reveal" : "live-arrival-postcard-reveal");
  scheduleParticipant(
    isWorkshopScenario
      ? showWorkshopRolePick
      : isCafeScenario
        ? showCouplePhotoChallenge
        : showLinkedDodgeball,
    1900,
    isWorkshopScenario
      ? "live-workshop-role-pick"
      : isCafeScenario
        ? "live-cafe-couple-photo"
        : "live-linked-dodgeball",
  );
}

function workshopPairKey(pair) {
  return [...pair].sort().join(":");
}

function showWorkshopRolePick() {
  if (liveDateState.phaseAppended["workshop-role-pick"]) return;
  advanceLiveDatePhase("arrival");
  const firstPairing = liveDateState.firstPairing.map((pair) => [...pair]);
  recordPairingPhase("workshop-role-pick", firstPairing, {
    source: "booklet_selection",
    contactLevel: "low_contact",
    representatives: [...workshopDateFlow.simulatedResults.rolePickRepresentatives],
    pairingConsequence: false,
    observedBy: selectedIds,
  });
  appendLiveDatePhase("workshop-role-pick", [
    incomingDateEntry([
      "Your first pairing comes from the booklet pick.",
      `${pairLabel(firstPairing[0])} and ${pairLabel(firstPairing[1])}.`,
      "Arm-Wrestling Role Pick",
      "Each pair, send one person forward.",
      "The winner gets first choice of which cooking task their pair will take.",
    ]),
    controlDateEntry("workshop-role-pick", `<div class="message-actions"><button class="message-action primary" data-participant-action="workshop-role-pick-finished">Role pick finished</button></div>`),
  ]);
}

function finishWorkshopRolePick() {
  if (liveDateState.workshopRolePickResult) return;
  completeLiveDateControl("workshop-role-pick");
  const completionMinutes = advanceLiveDatePhase("workshop-role-pick");
  addDateEntries(
    [liveDateState.activeParticipantId],
    [outgoingDateEntry("Role pick finished", completionMinutes)],
    "result-workshop-role-pick-user",
  );
  const representatives = workshopDateFlow.simulatedResults.rolePickRepresentatives;
  const winnerId = workshopDateFlow.simulatedResults.rolePickWinner;
  const winningPair = liveDateState.firstPairing.find((pair) => pair.includes(winnerId));
  const otherPair = liveDateState.firstPairing.find((pair) => !pair.includes(winnerId));
  const responsibilities = workshopDateFlow.simulatedResults.workshopResponsibilities;
  liveDateState.workshopRolePickResult = {
    representatives: [...representatives],
    winnerId,
    winningPair: [...winningPair],
    otherPair: [...otherPair],
  };
  liveDateState.workshopResponsibilities = {
    [workshopPairKey(winningPair)]: responsibilities[workshopPairKey(winningPair)],
    [workshopPairKey(otherPair)]: responsibilities[workshopPairKey(otherPair)],
  };
  liveDateState.completedTasks.push("workshop-role-pick");
  addSharedDateEntries([incomingDateEntry([
    `${representatives.map((participantId) => personById(participantId).name).join(" and ")} stepped forward.`,
    `${personById(winnerId).name} won.`,
    `${pairLabel(winningPair)} chose to ${liveDateState.workshopResponsibilities[workshopPairKey(winningPair)]}.`,
    `${pairLabel(otherPair)} will ${liveDateState.workshopResponsibilities[workshopPairKey(otherPair)]}.`,
    "You have 28 minutes. Work with your pair and keep the conversation going.",
  ], completionMinutes)], "result-workshop-role-pick");
  setLiveDatePhase("workshop-cooking");
  liveDateState.phaseAppended["workshop-cooking"] = true;
  const cookingCompletionMinutes = advanceLiveDatePhase("workshop-cooking");
  renderActiveDateThread();
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Occupation unlocked."], cookingCompletionMinutes)], "workshop-occupation-unlock");
    renderActiveDateThread();
  }, 700, "live-workshop-occupation-unlock");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry([
      "You can tell the group what you do or what you're studying now. Keep your age and contact details private.",
    ], cookingCompletionMinutes)], "workshop-occupation-unlock-followup");
    renderActiveDateThread();
  }, 1050, "live-workshop-occupation-unlock-followup");
  scheduleParticipant(() => {
    advanceSimulatedTime(SILENT_REVEAL_INTERVAL_MINUTES);
    showFirstImpression();
  }, 1450, "live-workshop-first-impression");
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
      `Your first pairing comes from the ${usesRelationshipBooklet ? "booklet" : "photo"} pick.`,
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
  scheduleParticipant(() => {
    advanceNaturalTime("couple-photo");
    showCouplePhotoChallenge();
  }, 1450, "live-couple-photo");
}

function showCouplePhotoChallenge() {
  if (liveDateState.phaseAppended["couple-photo"]) return;
  if (isCafeScenario) {
    advanceLiveDatePhase("arrival");
    recordPairingPhase("couple-photo", liveDateState.firstPairing, {
      source: "booklet_selection",
      observedBy: selectedIds,
    });
    appendLiveDatePhase("couple-photo", [
      incomingDateEntry([
        "Each pair has eight minutes to take one photo that could convince everyone you've been dating for six months.",
        "The other pair will judge.",
      ]),
      controlDateEntry("couple-photo", `<div class="message-actions"><button class="message-action primary" data-participant-action="photos-taken">Photos taken</button></div>`),
    ]);
    return;
  }
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
  if (isCafeScenario) {
    finishCafeCouplePhotoChallenge();
    return;
  }
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
  scheduleParticipant(() => {
    advanceNaturalTime("cookout-setup");
    showCookoutSetup();
  }, 1450, "live-cookout-setup");
}

function finishCafeCouplePhotoChallenge() {
  completeLiveDateControl("couple-photo");
  const completionMinutes = advanceLiveDatePhase("couple-photo");
  addDateEntries([liveDateState.activeParticipantId], [outgoingDateEntry("Photos taken", completionMinutes)], "result-cafe-couple-photo-user");
  liveDateState.couplePhotoResult = { pairs: liveDateState.firstPairing.map((pair) => [...pair]) };
  liveDateState.completedTasks.push("couple-photo");
  renderActiveDateThread();
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Occupation unlocked."], completionMinutes)], "cafe-occupation-unlock");
    renderActiveDateThread();
  }, 700, "live-cafe-occupation-unlock");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry([
      "You can tell the group what you do or what you're studying now. Keep your age and contact details private.",
    ], completionMinutes)], "cafe-occupation-unlock-followup");
    renderActiveDateThread();
  }, 1050, "live-cafe-occupation-unlock-followup");
  scheduleParticipant(() => {
    advanceSimulatedTime(SILENT_REVEAL_INTERVAL_MINUTES);
    showFirstImpression();
  }, 1450, "live-first-impression");
}

function validateEligibleParticipantName(rawValue, participantId, allowNoOne = false) {
  const result = validateParticipantName(rawValue, participantId, allowNoOne);
  if (result.error) return result;
  if (result.value === "no_one") return result;
  return isMutuallyEligible(participantId, result.value)
    ? result
    : { error: "That person is not one of your eligible choices tonight." };
}

function showFirstImpression() {
  if (liveDateState.phaseAppended["first-impression"]) return;
  setLiveDatePhase("first-impression");
  liveDateState.phaseAppended["first-impression"] = true;
  selectedIds.forEach((participantId) => {
    addDateEntries([participantId], [
      incomingDateEntry([
        "First impression.",
        "Who are you most curious to talk to next?",
        "Send me one eligible name. Your choice stays private.",
      ]),
      controlDateEntry(`first-impression-${participantId}`, nameInputControl(
        `first-impression-${participantId}`,
        "first-impression-submit",
        "Type one eligible name",
      )),
    ], "phase-first-impression");
  });
  renderActiveDateThread();
}

function simulateRemainingFirstImpressions() {
  Object.entries(activeDateFlow.simulatedResults.firstImpressions).forEach(([participantId, choiceId]) => {
    const record = liveDateRecord(participantId);
    if (record.firstImpressionChoice !== undefined) return;
    record.firstImpressionChoice = choiceId;
    addDateEntries([participantId], [
      outgoingDateEntry(personById(choiceId).name, simulatedTimeline.currentTimestampMinutes),
      incomingDateEntry(["Locked.", "Your choice stays private."], simulatedTimeline.currentTimestampMinutes),
    ], "first-impression-simulated-choice");
    completeLiveDateControl(`first-impression-${participantId}`, [participantId]);
  });
}

function pairingConfigurationKey(configuration) {
  return configuration
    .map((pair) => [...pair].sort().join(":"))
    .sort()
    .join("|");
}

function resolveFirstImpressions() {
  if (liveDateState.firstImpressionsResolved) return;
  advanceLiveDatePhase("first-impression");
  const firstPairingKey = pairingConfigurationKey(liveDateState.firstPairing);
  const freshConfigurations = validPairingConfigurations()
    .filter((configuration) => pairingConfigurationKey(configuration) !== firstPairingKey)
    .sort((left, right) => {
      const choiceScore = (configuration) => configuration.reduce((score, pair) => (
        score + pair.filter((participantId) => {
          const partnerId = pair.find((id) => id !== participantId);
          return liveDateRecord(participantId).firstImpressionChoice === partnerId;
        }).length
      ), 0);
      return choiceScore(right) - choiceScore(left)
        || pairingConfigurationKey(left).localeCompare(pairingConfigurationKey(right));
    });
  const nextPairing = freshConfigurations[0] || validPairingConfigurations()[0];
  liveDateState.eyeContactPairing = nextPairing.map((pair) => [...pair]);
  liveDateState.firstImpressionsResolved = true;
  scheduleParticipant(() => {
    if (isWorkshopScenario) {
      advanceNaturalTime("sensory-kitchen");
      showSensoryKitchenChallenge();
      return;
    }
    advanceNaturalTime("eye-contact");
    showEyeContact();
  }, 800, isWorkshopScenario ? "live-sensory-kitchen" : "live-eye-contact");
}

function submitFirstImpression() {
  const participantId = liveDateState.activeParticipantId;
  const record = liveDateRecord(participantId);
  if (record.firstImpressionChoice !== undefined) return;
  const control = app.querySelector(`[data-control='first-impression-${participantId}']`);
  const result = validateEligibleParticipantName(control.querySelector("input").value, participantId);
  if (result.error) {
    control.querySelector(".inline-message-validation").textContent = result.error;
    return;
  }
  record.firstImpressionChoice = result.value;
  addDateEntries([participantId], [
    outgoingDateEntry(result.label, simulatedTimeline.currentTimestampMinutes),
    incomingDateEntry(["Locked.", "Your choice stays private."], simulatedTimeline.currentTimestampMinutes),
  ], "first-impression-user-choice");
  completeLiveDateControl(`first-impression-${participantId}`, [participantId]);
  simulateRemainingFirstImpressions();
  renderActiveDateThread();
  if (selectedIds.every((id) => liveDateRecord(id).firstImpressionChoice !== undefined)) {
    scheduleParticipant(resolveFirstImpressions, 800, "live-first-impression-resolution");
  }
}

function showEyeContact() {
  if (liveDateState.phaseAppended["eye-contact"]) return;
  recordPairingPhase("eye-contact", liveDateState.eyeContactPairing, {
    source: "private_first_impression",
    freshRematch: pairingConfigurationKey(liveDateState.eyeContactPairing)
      !== pairingConfigurationKey(liveDateState.firstPairing),
    observedBy: selectedIds,
  });
  appendLiveDatePhase("eye-contact", [
    incomingDateEntry([
      "New pairs.",
      `${pairLabel(liveDateState.eyeContactPairing[0])} and ${pairLabel(liveDateState.eyeContactPairing[1])}.`,
      "Sit across from your new partner.",
      "When Ditto counts you in, hold eye contact for ten seconds. No talking.",
      "3. 2. 1.",
    ]),
    controlDateEntry("eye-contact", `<div class="message-actions"><button class="message-action primary" data-participant-action="eye-contact-finished">10 seconds finished</button></div>`),
  ]);
}

function finishEyeContact() {
  if (liveDateState.eyeContactCompleted) return;
  completeLiveDateControl("eye-contact");
  const completionMinutes = advanceLiveDatePhase("eye-contact");
  addDateEntries([liveDateState.activeParticipantId], [outgoingDateEntry("10 seconds finished", completionMinutes)], "result-eye-contact-user");
  liveDateState.eyeContactCompleted = true;
  liveDateState.completedTasks.push("eye-contact");
  addSharedDateEntries([incomingDateEntry(["That's ten seconds."], completionMinutes)], "result-eye-contact");
  renderActiveDateThread();
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Age unlocked."], completionMinutes)], "cafe-age-unlock");
    renderActiveDateThread();
  }, 700, "live-cafe-age-unlock");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry([
      "You can share your age now. Contact details stay private until after the date.",
    ], completionMinutes)], "cafe-age-unlock-followup");
    renderActiveDateThread();
  }, 1050, "live-cafe-age-unlock-followup");
  scheduleParticipant(() => {
    advanceSimulatedTime(SILENT_REVEAL_INTERVAL_MINUTES);
    showCafeFreeTime();
  }, 1450, "live-cafe-free-time");
}

function showCafeFreeTime() {
  const appended = appendLiveDatePhase("cafe-free-time", [incomingDateEntry([
    "Free time.",
    "Order dessert, refill your coffee, and talk.",
    "I'll be back later.",
  ])]);
  if (!appended) return;
  scheduleParticipant(showPrivateWindow, 1500, "live-private-window");
}

function showSensoryKitchenChallenge() {
  if (liveDateState.phaseAppended["sensory-kitchen"]) return;
  recordPairingPhase("sensory-kitchen", liveDateState.eyeContactPairing, {
    source: "private_first_impression",
    freshRematch: pairingConfigurationKey(liveDateState.eyeContactPairing)
      !== pairingConfigurationKey(liveDateState.firstPairing),
    contactLevel: "low_contact",
    roleVariants: {
      pair1: ["blindfolded", "cannot_speak"],
      pair2: ["blindfolded", "headphones"],
    },
    switchRolesHalfway: true,
    safeActivities: ["prep", "assembly", "shaping", "identification", "plating"],
    winner: false,
    pairingConsequence: false,
    observedBy: selectedIds,
  });
  appendLiveDatePhase("sensory-kitchen", [
    incomingDateEntry([
      "New pairs.",
      `Pair 1: ${pairLabel(liveDateState.eyeContactPairing[0])}.`,
      `Pair 2: ${pairLabel(liveDateState.eyeContactPairing[1])}.`,
      "Sensory Kitchen Challenge",
      "Pair 1: One person will be blindfolded. The other person cannot speak.",
      "Pair 2: One person will be blindfolded. The other person will wear headphones.",
      "Complete your assigned part of the recipe, then switch roles halfway through.",
    ]),
    controlDateEntry("sensory-kitchen", `<div class="message-actions"><button class="message-action primary" data-participant-action="sensory-kitchen-finished">Challenge finished</button></div>`),
  ]);
}

function finishSensoryKitchenChallenge() {
  if (liveDateState.sensoryKitchenCompleted) return;
  completeLiveDateControl("sensory-kitchen");
  const completionMinutes = advanceLiveDatePhase("sensory-kitchen");
  addDateEntries(
    [liveDateState.activeParticipantId],
    [outgoingDateEntry("Challenge finished", completionMinutes)],
    "result-sensory-kitchen-user",
  );
  liveDateState.sensoryKitchenCompleted = true;
  liveDateState.completedTasks.push("sensory-kitchen");
  renderActiveDateThread();
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry(["Age unlocked."], completionMinutes)], "workshop-age-unlock");
    renderActiveDateThread();
  }, 700, "live-workshop-age-unlock");
  scheduleParticipant(() => {
    addSharedDateEntries([incomingDateEntry([
      "You can share your age now. Contact details stay private until after the date.",
    ], completionMinutes)], "workshop-age-unlock-followup");
    renderActiveDateThread();
  }, 1050, "live-workshop-age-unlock-followup");
  scheduleParticipant(() => {
    advanceSimulatedTime(SILENT_REVEAL_INTERVAL_MINUTES);
    showWorkshopFreeTime();
  }, 1450, "live-workshop-free-time");
}

function showWorkshopFreeTime() {
  const appended = appendLiveDatePhase("workshop-free-time", [incomingDateEntry([
    "Free time.",
    "Finish plating, grab water, and talk.",
    "I'll be back later.",
  ])]);
  if (!appended) return;
  scheduleParticipant(showPrivateWindow, 1500, "live-private-window");
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
  scheduleParticipant(() => {
    advanceNaturalTime("arm-wrestling");
    showArmWrestling();
  }, 750, "live-arm-wrestling");
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
  scheduleParticipant(() => {
    advanceNaturalTime("grilling-dinner");
    showGrillingDinner();
  }, 650, "live-grilling-dinner");
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
  const precedingPhaseId = isWorkshopScenario
    ? "workshop-free-time"
    : isCafeScenario
      ? "cafe-free-time"
      : "grilling-dinner";
  advanceLiveDatePhase(precedingPhaseId);
  setLiveDatePhase("private-window");
  liveDateState.phaseAppended["private-window"] = true;
  selectedIds.forEach((participantId) => {
    addDateEntries([participantId], [
      { type: "divider", minutes: simulatedTimeline.currentTimestampMinutes, entryKey: "divider" },
      incomingDateEntry([
        "Ten-minute window is open.",
        "There's someone here you want more time with.",
        usesEligibilityLimitedChoices ? "Send me one eligible name—or send 'no one.'" : "Send me their name.",
      ]),
      controlDateEntry(`private-window-${participantId}`, nameInputControl(
        `private-window-${participantId}`,
        "private-window-submit",
        usesEligibilityLimitedChoices ? "Type one name or no one" : "Type one name",
      )),
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
  Object.entries(activeDateFlow.simulatedResults.privateWindowChoices).forEach(([participantId, choiceId]) => {
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
  const result = usesEligibilityLimitedChoices
    ? validateEligibleParticipantName(control.querySelector("input").value, participantId, true)
    : validateParticipantName(control.querySelector("input").value, participantId);
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
      lines.push(
        `${personById(partnerId).name} asked for ten minutes with you too.`,
        isWorkshopScenario
          ? "Take the side table near the kitchen."
          : isCafeScenario
            ? "Take the quiet table by the window."
            : "Meet by the water.",
      );
      record.privateWindowOutcome = { type: "mutual", partnerId };
    } else if (record.privateWindowChoice && record.privateWindowChoice !== "no_one") {
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
  scheduleParticipant(() => {
    if (isWorkshopScenario) {
      showStayLinkedDinner();
      return;
    }
    if (isCafeScenario) {
      advanceNaturalTime("stay-linked");
      showStayLinked();
      return;
    }
    showBeachFinalSignal();
  }, 1200, isWorkshopScenario ? "live-stay-linked-dinner" : isCafeScenario ? "live-stay-linked" : "live-final-signal");
}

function showStayLinkedDinner() {
  if (liveDateState.phaseAppended["stay-linked-dinner"]) return;
  recordPairingPhase("stay-linked-dinner", liveDateState.eyeContactPairing, {
    preservedFrom: "sensory-kitchen",
    contactLevel: "light_closeness",
    removableProp: true,
    observedBy: selectedIds,
  });
  appendLiveDatePhase("stay-linked-dinner", [
    incomingDateEntry([
      "Stay Linked Dinner",
      "For the first 15 minutes of dinner, each pair will wear a set of connected couple rings.",
      "Eat the pasta you made, keep the conversation going, and work around each other until time is up.",
      "Before the rings come off, offer your partner one bite.",
    ]),
    controlDateEntry("stay-linked-dinner", `<div class="message-actions"><button class="message-action primary" data-participant-action="stay-linked-dinner-finished">15 minutes finished</button></div>`),
  ]);
}

function finishStayLinkedDinner() {
  if (liveDateState.stayLinkedDinnerCompleted) return;
  completeLiveDateControl("stay-linked-dinner");
  const completionMinutes = advanceLiveDatePhase("stay-linked-dinner");
  addDateEntries(
    [liveDateState.activeParticipantId],
    [outgoingDateEntry("15 minutes finished", completionMinutes)],
    "result-stay-linked-dinner-user",
  );
  liveDateState.stayLinkedDinnerCompleted = true;
  liveDateState.completedTasks.push("stay-linked-dinner");
  addSharedDateEntries([incomingDateEntry([
    "Time.",
    "Rings off.",
  ], completionMinutes)], "result-stay-linked-dinner");
  renderActiveDateThread();
  scheduleParticipant(showBeachFinalSignal, 800, "live-final-signal");
}

function showStayLinked() {
  if (liveDateState.phaseAppended["stay-linked"]) return;
  recordPairingPhase("stay-linked", liveDateState.eyeContactPairing, {
    preservedFrom: "eye-contact",
    contactLevel: "light_closeness",
    removableProp: true,
    observedBy: selectedIds,
  });
  appendLiveDatePhase("stay-linked", [
    incomingDateEntry([
      "Stay Linked",
      "Each pair will wear a set of connected couple rings for the next 15 minutes.",
      "Eat dessert, drink your coffee, and talk without taking them off. You'll have to work around each other until time is up.",
    ]),
    controlDateEntry("stay-linked", `<div class="message-actions"><button class="message-action primary" data-participant-action="stay-linked-finished">15 minutes finished</button></div>`),
  ]);
}

function finishStayLinked() {
  if (liveDateState.stayLinkedCompleted) return;
  completeLiveDateControl("stay-linked");
  const completionMinutes = advanceLiveDatePhase("stay-linked");
  addDateEntries([liveDateState.activeParticipantId], [outgoingDateEntry("15 minutes finished", completionMinutes)], "result-stay-linked-user");
  liveDateState.stayLinkedCompleted = true;
  liveDateState.completedTasks.push("stay-linked");
  addSharedDateEntries([incomingDateEntry([
    "Time.",
    "Rings off. No winner—just one last stretch of the date.",
  ], completionMinutes)], "result-stay-linked");
  renderActiveDateThread();
  scheduleParticipant(showBeachFinalSignal, 800, "live-final-signal");
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
  Object.entries(activeDateFlow.simulatedResults.finalSignals).forEach(([participantId, choiceId]) => {
    const record = liveDateRecord(participantId);
    if (record.finalSignalLocked) return;
    record.finalSignal = choiceId;
    record.finalSignalLocked = true;
    const choiceLabel = choiceId === "no_one" ? "No one" : personById(choiceId).name;
    addDateEntries([participantId], [outgoingDateEntry(choiceLabel, simulatedTimeline.currentTimestampMinutes), incomingDateEntry([
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
  const result = usesEligibilityLimitedChoices
    ? validateEligibleParticipantName(control.querySelector("input").value, participantId, true)
    : validateParticipantName(control.querySelector("input").value, participantId, true);
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
