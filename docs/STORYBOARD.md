# Ditto Group Mode Storyboard

This document defines every screen in the prototype.

It is the source of truth for the user experience.

If this document conflicts with implementation,
the storyboard wins.

---

# ACT 1 — Before the Date

Purpose:
Introduce the product vision and explain how Ditto creates a group before letting the founder experience the product from a participant's perspective.

Narrative:
"What is this?"
↓
"What information does Ditto use?"
↓
"How does a group emerge?"
↓
"Why these people?"
↓
"What experience did Ditto create?"
↓
"What does the participant actually experience?"

---

Screen 1 — Landing
Question answered:
"What am I about to experience?"

Emotion:
Curiosity

---

Screen 2 — Studio: Applications
Question answered:
"What does Ditto know about people?"

Emotion:
Understanding

---

Screen 3 — Group Formation
Question answered:
"How does Ditto create a group?"

Emotion:
Anticipation

---

Screen 4 — Group Reveal
Question answered:
"Who ended up together?"

Emotion:
Excitement

---

Screen 5 — Why This Group?
Question answered:
"Why did Ditto choose these people?"

Emotion:
Trust

---

Screen 6 — Date Plan
Question answered:
"What kind of experience did Ditto create?"

Emotion:
Excitement

---

Screen 7 — Enter Participant Mode
Question answered:
"What does this actually feel like?"

Emotion:
Immersion

# Screen 2 — Applications

## Purpose

Introduce the founder to the information Ditto uses before any matching occurs.

This screen establishes that Group Mode is built on a deep understanding of people rather than superficial profile similarities.

---

## Audience

Ditto founders.

Participants never see this screen.

---

## Question Answered

"What does Ditto know about people?"

---

## Emotion

Understanding.

The founder should think:

"Okay... the AI actually has rich context to work with."

---

## Entry Transition

The landing screen slides upward.

The page fades in.

Application cards animate into place one by one.

---

## Visual Layout

This screen lives inside Ditto Studio.

Top Navigation

- Back
- Applications
- "6 Applicants"

Main Content

A clean canvas containing six application cards.

The cards are evenly spaced with generous whitespace.

The layout should feel premium, minimal and modern rather than like a dashboard.

---

## Application Card

Each card contains only a summary of the application.

Display:

- Profile photo
- Name
- University
- Major
- Relationship intention
- Three interests
- Two personality traits
- Social energy
- Availability

Do not display every application answer directly.

---

## Interaction

Selecting an application opens a bottom sheet.

The bottom sheet displays the complete fictional application, including:

- Basic information
- Relationship goals
- Interests
- Personality
- Lifestyle
- Prompt responses
- Uploaded photos

Closing the sheet returns to the Applications screen.

---

## Primary Action

Button:

Generate Group

This begins Ditto's group formation process.

---

## Motion

When Generate Group is pressed:

- The button fades away.
- Application cards subtly lift.
- The cards move toward the center.
- Soft connection lines begin appearing between compatible applicants.
- The interface transitions into Screen 3.

The animation should feel calm and intentional rather than flashy.

---

## Founder Learns

Ditto is not matching people based only on shared interests.

It understands multiple dimensions of compatibility before creating a group.

---

## Exit Transition

Applications transform into the group formation visualization.

Screen 3 begins automatically.

# Screen 3 — Group Formation

## Purpose

Demonstrate how Ditto transforms a pool of applicants into an optimized group rather than simply selecting one pair.

This screen should communicate that Group Mode considers the chemistry of the entire group.

---

## Audience

Ditto founders.

Participants never see this screen.

---

## Question Answered

"How does Ditto create a group?"

---

## Emotion

Anticipation.

The founder should feel:

"I want to see who ends up together."

---

## Entry Transition

The animation begins automatically after pressing "Generate Group."

The application cards leave their grid layout and move toward the center of the canvas.

---

## Visual Layout

The interface becomes a clean visualization.

Each applicant is represented as a circular profile node.

Soft connection lines appear between compatible applicants.

Connection lines should animate naturally rather than appearing instantly.

The visualization should feel elegant and minimal.

---

## Animation

The visualization evolves over several seconds.

Examples of visual behaviors:

- Stronger candidate combinations move closer together.
- Less suitable combinations drift further apart.
- Some connection lines fade.
- Others become stronger.
- Several possible groups briefly emerge before collapsing into one final group.

Avoid showing numerical compatibility scores.

The animation should communicate exploration rather than certainty.

---

## Primary Message

Centered near the bottom of the screen:

Creating the strongest overall group...

---

## Founder Learns

Group Mode is solving a group optimization problem rather than repeating pair matching multiple times.

Every participant influences the chemistry of the entire group.

---

## Exit Transition

The final four selected participants move toward the center.

The remaining applicants gently fade into the background.

The selected group expands into the next screen.

Screen 4 begins automatically.


# Screen 4 — Group Reveal

## Purpose

Reveal the final selected group.

This moment serves as the payoff to the group formation process and should create excitement while leaving the founder wanting to know more.

This screen is intentionally focused only on revealing who is in the group.

---

## Audience

Ditto founders.

Participants never see this screen.

---

## Question Answered

"Who did Ditto choose?"

---

## Emotion

Excitement.

The founder should immediately become curious about why this particular combination was selected.

---

## Entry Transition

The selected group expands from the center of the previous visualization.

The remaining applicants softly fade away.

Only the selected participants remain.

---

## Visual Layout

Four participant cards are displayed.

Each card contains:

- Profile photo
- First name
- University
- Major

No compatibility scores.

No explanations.

No date information.

The layout should feel balanced and intentional.

---

## Primary Message

Centered above the group:

One group found.

---

## Secondary Message

Centered below the group:

Now let's understand why.

---

## Interaction

Primary button:

Why This Group

---

## Motion

The participant cards settle naturally into position.

Hovering over a participant gently highlights them.

No additional information is shown yet.

The focus should remain on the group as a whole.

---

## Founder Learns

The objective of Group Mode is to create the strongest overall group rather than maximizing one romantic pair.

The group itself is the product.

---

## Exit Transition

Selecting "Why This Group" zooms into the group.

Connection lines softly animate back into view.

Screen 5 begins.

# Screen 5 — Why This Group?

## Purpose

Explain the reasoning behind the selected group in a way that feels intuitive, human, and trustworthy.

This screen demonstrates that Group Mode optimizes the chemistry of the entire group rather than simply maximizing compatibility between individual pairs.

---

## Audience

Ditto founders.

Participants never see this screen.

---

## Question Answered

"Why did Ditto choose this group?"

---

## Emotion

Trust.

The founder should think:

"This reasoning feels thoughtful and product-driven."

---

## Entry Transition

The selected group remains on screen.

Soft connection lines fade back into view.

A reasoning panel slides up from the bottom.

---

## Visual Layout

The selected participants remain visible at the top.

Below them is a clean explanation panel.

The panel explains the reasoning using natural language rather than numerical scores.

Avoid percentages or compatibility ratings.

---

## Explanation Categories

Present the reasoning as several short insights.

Examples:

### Balanced Group Energy

This group naturally balances initiative, curiosity, and comfort.

No single personality dominates the conversation.

---

### Multiple Relationship Paths

Each participant has more than one meaningful potential connection.

This allows relationships to develop naturally instead of forcing predetermined pairs.

---

### Complementary Differences

Some participants share interests.

Others challenge each other with different perspectives.

The combination encourages richer conversations throughout the date.

---

### Shared Intent

Everyone entered Ditto looking for meaningful new relationships.

Although their personalities differ, their expectations for the experience are well aligned.

---

## Primary Message

This group wasn't built around one perfect match.

It was built to create the strongest shared experience.

---

## Interaction

Primary button:

Generate Date

---

## Motion

As each reasoning section appears, the corresponding participants softly highlight.

The visualization should feel alive but subtle.

Avoid flashy animations.

---

## Founder Learns

Group Mode is fundamentally different from traditional matchmaking.

The objective is to maximize opportunities for meaningful relationships across the entire group.

---

## Exit Transition

The reasoning panel slides away.

The selected group transitions into the generated date experience.

Screen 6 begins automatically.

# Screen 6 — Generated Date Plan

## Purpose

Reveal the curated experience Ditto created for this specific group.

This screen demonstrates that Ditto generates an experience rather than simply assigning a venue.

The focus is on the overall date concept rather than the detailed timeline.

---

## Audience

Ditto founders.

Participants do not see this version of the date plan.

---

## Question Answered

"What kind of experience did Ditto create?"

---

## Emotion

Excitement.

The founder should immediately imagine themselves wanting to experience the date.

---

## Entry Transition

The selected group smoothly shifts upward.

A personalized date card fades into view.

---

## Visual Layout

Large hero image.

Below:

• Date title

• One sentence describing the experience

• Location

• Estimated duration

• Small preview timeline

Do not reveal every task yet.

---

## Example

Golden Hour Beach Cookout

An evening designed around collaboration,
playfulness and meaningful conversations.

Dockweiler State Beach

Approximately 3 Hours

Preview

• Cook together

• Team challenge

• Sunset dinner

• Campfire

---

## Primary Message

Every group deserves a different experience.

---

## Interaction

Primary Button

Experience the Date

---

## Motion

The hero image slowly fades into place.

The timeline preview animates upward.

Everything should feel calm and cinematic.

---

## Founder Learns

The AI is not only matching people.

It is curating experiences specifically designed for that group.

---

## Exit Transition

The date plan gently fades away.

The phone slides upward from the bottom of the screen.

Participant Mode begins.


# Screen 7 — Enter Participant Mode

## Purpose

Transition the founder from observing Ditto's decision-making process into experiencing Group Mode exactly as a participant would.

This marks the end of Ditto Studio and the beginning of the actual user experience.

From this point forward, the founder should forget about the backend and experience the product exactly as a participant would.

---

## Audience

Ditto founders.

After this transition, they experience the product from Jacob's perspective.

---

## Question Answered

"What does this actually feel like?"

---

## Emotion

Immersion.

The founder should feel like they have stepped inside the product.

---

## Entry Transition

The founder presses:

Experience the Date

The date plan fades away.

The screen briefly becomes empty.

After a short pause, an iPhone slowly slides upward from the bottom of the screen.

The phone locks into the center of the page.

The Ditto Studio interface disappears completely.

No Studio navigation remains visible.

---

## Visual Layout

A realistic phone frame occupies the center of the screen.

Inside the phone is Jacob's Messages app.

The conversation with Ditto is already open.

Nothing outside the phone should distract from the experience.

The founder should feel like they are now holding Jacob's phone.

---

## Primary Message

None.

The conversation itself becomes the interface.

---

## Interaction

The first incoming message from Ditto automatically appears after a short delay.

No additional clicks are required.

The founder naturally begins reading the conversation.

---

## Motion

The phone slides upward smoothly.

The Messages app opens naturally.

Ditto begins typing.

Typing indicator appears.

The first message arrives.

Everything should feel calm, confident and cinematic.

---

## Founder Learns

The participant never sees how the group was created.

They simply experience Ditto as a trusted companion guiding them through the date.

---

## Exit Transition

Participant Mode begins.

The remaining prototype unfolds entirely through Jacob's conversation with Ditto.

---

# ACT 2 — Before the Date (Participant POV)

Goal:

Transform curiosity into commitment.

The participant gradually discovers who they are meeting,
confirms they want to join this specific group,
allows Ditto to coordinate everyone's schedules,
and receives a personalized date plan.

The participant should progressively feel:

"I actually can't wait for Friday."

Narrative:

"Am I interested?"

↓

"Who am I meeting?"

↓

"Do I want this group?"

↓

"When are we all free?"

↓

"What's the plan?"

↓

"I'm excited."

# Screen 8 — Invitation

## Purpose

Invite the participant to join this specific Group Mode experience.

This screen should feel exciting but slightly mysterious.

The participant knows a group has been found, but nothing else has been revealed yet.

---

## Audience

Participants.

The founder is now fully experiencing the product from Jacob's perspective.

---

## Question Answered

"Do I want to try this?"

---

## Emotion

Curiosity.

The participant should think:

"I don't know exactly what's happening yet... but I'm interested."

---

## Entry Transition

The phone is already open inside Messages.

After a short typing indicator, Ditto sends the invitation.

---

## Conversation

Ditto

Group date this week?

4 people.

One plan.

Several possibilities.

No group chat.

No planning.

You in?

---

## Interaction

Primary Button

I'm in

Secondary Button

Maybe next time

---

## System Logic

If the participant selects:

### I'm in

Proceed to Screen 9.

---

### Maybe next time

The participant returns to the matching pool.

No further coordination occurs.

The remaining group continues searching for another eligible participant.

---

## Motion

Ditto's typing indicator appears.

Each message arrives naturally.

The reply buttons slide upward.

The interaction should feel like a real conversation rather than a form.

---

## Participant Learns

Joining Group Mode is only an expression of interest.

They have not yet committed to meeting this specific group.

---

## Exit Transition

After selecting "I'm in", Ditto briefly types before introducing the other participants.

Screen 9 begins.

# Screen 9 — Meet Your Group

## Purpose

Reveal the people Ditto selected before asking the participant to commit to the date.

This is the participant's first look at the group.

The goal is to build excitement while allowing them to decide whether they genuinely want to spend an evening with these people.

Ditto should reveal just enough to spark curiosity without revealing everything.

---

## Audience

Participants.

---

## Question Answered

"Who am I meeting?"

---

## Emotion

Excitement.

The participant should think:

"These people actually seem interesting."

---

## Entry Transition

After the participant selects "I'm in,"

Ditto briefly types.

A message appears:

"I found a group I think you'll genuinely enjoy meeting."

The participant cards animate into view one by one.

---

## Visual Layout

Display four participant cards.

Each card contains:

- Profile photo
- First name
- University
- Major
- Three interests
- One short personality sentence

Example:

Olivia

USC

Communication

☕ Cafés

🎞 Film photography

🌅 Sunset walks

"Usually the one convincing everyone to stay a little longer."

---

Do not show:

- compatibility scores
- personality traits
- relationship intentions
- detailed application answers

The goal is to make each person feel real, not analyzed.

---

## Primary Message

Meet your group.

---

## Secondary Message

Take a look around.

No pressure.

You'll decide in a moment if this feels like your kind of night.

---

## Interaction

Primary Button

I'm down

Secondary Button

Maybe next time

---

## Motion

Participant cards appear naturally one after another.

Small hover animations are allowed.

The layout should feel warm, premium, and personal.

---

## Participant Learns

Ditto values transparency.

Participants know who they are meeting before committing to the date.

---

## Exit Transition

After selecting "I'm down",

Ditto thanks the participant and begins waiting for everyone else's decision.

Screen 10 begins.


# Screen 10 — Group Confirmation

## Purpose

Allow the participant to make an informed decision after seeing the group.

This is the true commitment point.

The participant is no longer agreeing to try Group Mode in general.

They are deciding whether they want to spend an evening with this specific group.

---

## Audience

Participants.

---

## Question Answered

"Am I still interested after seeing who's coming?"

---

## Emotion

Commitment.

The participant should think:

"Yeah... I'd actually like to meet these people."

---

## Entry Transition

After reviewing the group,

Ditto sends a short message.

---

## Conversation

Ditto

So...

Still down?

---

## Interaction

Primary Button

Absolutely.

Secondary Button

Maybe next time.

---

## System Logic

If the participant selects:

### Absolutely

Their seat becomes temporarily reserved.

Ditto now waits for every remaining participant to make the same decision.

Proceed to Screen 11.

---

### Maybe next time

The participant leaves this potential group.

They return to Ditto's matching pool.

The remaining participants continue searching for another eligible replacement.

No scheduling occurs.

---

## Motion

The confirmation message appears naturally.

Buttons slide upward.

The interaction should feel lightweight rather than dramatic.

---

## Participant Learns

Seeing the group comes before making a real commitment.

Participants never commit without first knowing who they will meet.

---

## Exit Transition

After selecting "Absolutely",

Ditto briefly confirms the response.

Screen 11 begins.

# Screen 11 — Group Lock-In

## Purpose

Coordinate the group's final confirmation before planning the date.

This screen demonstrates that Ditto actively orchestrates the experience rather than assuming every participant immediately accepts.

The participant should feel like Ditto is quietly coordinating everything in the background.

---

## Audience

Participants.

---

## Question Answered

"Did everyone join?"

---

## Emotion

Anticipation.

The participant should think:

"I hope everyone says yes."

---

## Entry Transition

After the participant selects "Absolutely,"

Ditto immediately acknowledges the response.

A short typing indicator appears.

---

## Conversation

Ditto

Awesome.

I'm checking with everyone else.

Sit tight.

---

## Waiting State

A subtle progress indicator appears.

Examples:

✓ Olivia confirmed

✓ Kayla confirmed

Checking one more person...

Avoid displaying names beside rejected participants.

The participant should never see:

"Lucas declined."

Instead, Ditto quietly handles changes.

---

## Replacement Logic

The group is not considered confirmed until every participant accepts.

If any participant declines:

• Keep every confirmed participant locked.

• Preserve the group's mutual eligibility structure.

• Identify the declined participant's role within the group.

• Search only for candidates capable of restoring that role.

Example:

If a heterosexual group contains two women and two men,
and one man declines,

Ditto should first search for another mutually eligible man
before considering alternative configurations.

After identifying the strongest replacement,
invite only that participant.

Repeat until every seat has been accepted.

Only after every participant has confirmed should scheduling begin.

---

## Conversation Example

Ditto

One spot just opened up.

Finding another great fit...

...

Emily just joined your group 🎉

Everyone's in.

---

## Primary Message

Your group is locked.

---

## Motion

The confirmation status updates naturally.

Replacement events should feel calm and seamless.

Avoid making replacement participants feel like a second choice.

---

## Participant Learns

Ditto actively coordinates the group until every participant has committed.

The participant only sees the final confirmed group.

---

## Exit Transition

Once every participant has accepted,

Ditto begins collecting everyone's availability.

Screen 12 begins.


# Screen 12 — Availability

## Purpose

Collect each participant's availability before planning the date.

Rather than asking participants to negotiate in a group chat, Ditto quietly coordinates everyone's schedules behind the scenes.

The experience should feel effortless.

---

## Audience

Participants.

---

## Question Answered

"When can we all meet?"

---

## Emotion

Progress.

The participant should think:

"Nice. I don't have to organize anything."

---

## Entry Transition

After the group is fully confirmed,

Ditto immediately begins the next step.

---

## Conversation

Ditto

Now let's find a time that works for everyone.

Choose every time you're available this week.

---

## Interaction

A lightweight availability picker appears.

Participants can select multiple time slots.

Examples:

□ Thursday Evening

☑ Friday Evening

☑ Saturday Afternoon

☑ Saturday Evening

□ Sunday Afternoon

Primary Button

Submit Availability

---

## System Logic

Every participant submits their availability privately.

Participants cannot see each other's schedules.

Ditto collects every response before searching for the best overlapping time.

Scheduling does not begin until every participant has responded.

---

## Motion

The availability picker slides up naturally from the bottom.

Selected time slots animate with subtle feedback.

Submitting availability returns to the conversation.

---

## Participant Learns

There is no need for a group chat or manual coordination.

Ditto handles scheduling automatically.

---

## Exit Transition

After submission,

Ditto begins processing everyone's availability.

Screen 13 begins.

# Screen 13 — Planning Your Experience

## Purpose

Create a personalized group date after every participant has confirmed and submitted their availability.

Rather than simply selecting a venue, Ditto generates a complete experience tailored to this specific group at this specific time.

The experience should feel thoughtfully curated rather than automatically generated.

No two groups should necessarily receive the same date.

---

## Audience

Participants.

---

## Question Answered

"What are we doing?"

---

## Emotion

Anticipation.

The participant should think:

"This feels like someone is planning something specifically for us."

---

## Entry Transition

After every participant submits their availability,

Ditto begins planning.

A typing indicator appears.

---

## Conversation

Ditto

Perfect.

Give me a minute.

I'm putting everything together.

---

## Planning Animation

Instead of a loading spinner,

Ditto quietly progresses through several planning steps.

Example:

✓ Everyone confirmed

✓ Availability aligned

✓ Weather checked

✓ Local events

✓ Best locations

✓ Group preferences

✓ Logistics

✓ Experience ready

Each step appears naturally over several seconds.

Avoid exposing technical details or algorithms.

The planning process should feel thoughtful, calm, and human.

---

## System Logic

The experience is generated only after:

- every participant has accepted the group
- every participant has submitted their availability

Ditto considers multiple factors before finalizing the experience, including:

- participant profiles
- shared and complementary interests
- personalities
- relationship intentions
- mutual availability
- weather
- season
- time of day
- local events
- venue availability
- travel distance
- estimated budget
- overall group chemistry

The objective is not to recommend a venue.

The objective is to curate the best possible shared experience for this specific group.

The same group may receive completely different date plans on different weeks.

---

## Motion

Each planning step fades naturally into the conversation.

Completed steps remain visible.

The Messages conversation should never become a loading screen.

Everything should continue feeling like a real conversation with Ditto.

---

## Participant Learns

Ditto handles the planning automatically.

Participants never need to coordinate schedules, search for activities, or organize logistics themselves.

---

## Exit Transition

After the final planning step,

Ditto begins revealing the personalized experience.

Screen 14 begins.

# Screen 14 — Experience Reveal

## Purpose

Reveal the personalized group date Ditto created.

This should feel like an emotional payoff after the participant has confirmed the group, submitted availability, and waited while Ditto planned the experience.

The goal is not to explain every logistical detail yet.

The goal is to make the participant think:

"Wait... this actually sounds so fun."

---

## Audience

Participants.

---

## Question Answered

"What did Ditto plan for us?"

---

## Emotion

Excitement.

The participant should feel surprised, curious, and genuinely eager to attend.

---

## Entry Transition

After the final planning step is completed,

Ditto pauses briefly.

A typing indicator appears.

Then the experience reveal arrives.

---

## Conversation

Ditto

Okay.

I found your plan.

---

## Experience Reveal Card

Display one visually rich experience card containing:

- Hero image
- Experience title
- One short sentence describing the experience
- Day and date
- Start time
- General area or venue name

Example:

Golden Hour Beach Cookout

Cook together, compete a little,
then stay for the sunset.

Friday, July 17

6:00 PM

Dockweiler State Beach

---

## Content Rules

The experience title and description must be generated specifically for the confirmed group.

The reveal should not feel like a generic venue recommendation.

It should communicate the overall mood and concept of the date.

Keep the copy extremely short.

Do not reveal:

- the complete timeline
- every activity
- task instructions
- pair assignments
- private missions
- what to bring
- parking or transit information
- the closing mechanic

Those details are revealed later.

---

## Visual Direction

The reveal should feel cinematic and desirable.

Use:

- real or realistic photography
- strong visual atmosphere
- minimal text
- generous spacing
- clear hierarchy
- subtle motion

Avoid:

- itinerary-style layouts
- dense information
- large explanatory paragraphs
- dashboard cards
- generic calendar-event styling

---

## Interaction

Primary Button

View Details

---

## Motion

The hero image fades into view first.

The title appears next.

The description, date, time, and location follow gradually.

The reveal should feel like opening an invitation rather than receiving an appointment.

---

## Participant Learns

Ditto created a personalized experience for this exact group.

The date plan is now confirmed.

---

## Exit Transition

After selecting "View Details",

the experience card expands to reveal practical information.

Screen 15 begins.

# Screen 15 — Experience Details

## Purpose

Give the participant the practical information they need to attend the date confidently.

This screen expands the experience reveal without exposing the live tasks, pair assignments, private missions, or surprises Ditto will send during the date.

The information should feel complete but not overwhelming.

---

## Audience

Participants.

---

## Question Answered

"When and where is it, and what do I need to know?"

---

## Emotion

Reassurance.

The participant should think:

"Everything is handled. I just need to show up."

---

## Entry Transition

After the participant selects "View Details,"

the experience card expands smoothly.

The hero image remains visible while the practical information appears below it.

---

## Information Displayed

Show:

- Day and date
- Start time
- Expected end time or duration
- Exact venue name
- Exact address or meeting point
- Estimated cost
- Weather forecast
- Suggested clothing
- What to bring
- Transportation or parking information
- Arrival instructions
- A short preview of the experience

---

## Example

Golden Hour Beach Cookout

Friday, July 17

6:00 PM–8:30 PM

Dockweiler State Beach

Meet beside the main entrance.

Estimated cost:

$15–$20

Weather:

22°C and clear

Wear:

Something comfortable you can move in.

Bring:

A light hoodie and water.

Getting there:

12-minute walk from campus.

---

## Experience Preview

Show only broad phases.

Example:

- Meet the group
- Create something together
- Team challenge
- Food and sunset
- Final group moment

Do not reveal:

- exact task rules
- pair assignments
- competition outcomes
- private conversation prompts
- anonymous signals
- closing selections

The live experience should still contain surprises.

---

## Conversation

Ditto

That's everything you need for now.

I'll handle the rest when the date begins.

---

## Interaction

Primary Button

Add to Calendar

Secondary Button

Got it

For the prototype, adding to the calendar may be simulated.

---

## System Logic

The date plan is now confirmed for every participant.

Every participant receives the same operational facts:

- date
- time
- location
- duration
- expected cost
- meeting instructions

The wording may differ slightly between users, but the facts must remain identical.

---

## Motion

Practical details appear in small sections rather than one large block.

The experience should remain visually calm and easy to scan.

Avoid presenting the information as a dense itinerary or booking receipt.

---

## Participant Learns

Ditto has handled the planning and logistics.

The participant does not need to coordinate with the group before arriving.

---

## Exit Transition

After the participant selects "Got it,"

the conversation returns to its normal Messages state.

Time advances to the one-day reminder.

Screen 16 begins.

# Screen 16 — Postcard Pick

## Purpose

Run the approved Postcard Pick mechanic before the date so each participant contributes one meaningful image and privately chooses an anonymous submission from an eligible match.

The assignment should feel playful and meaningful rather than like homework.

It also creates the first hidden connection between participants before they meet.

---

## Audience

Participants.

---

## Question Answered

"What do I need to do before the date?"

---

## Emotion

Curiosity.

The participant should think:

"Wait... what is Ditto going to do with this?"

---

## Entry Transition

After the participant reviews the experience details,

Ditto sends one final message before the conversation pauses.

---

## Conversation

Ditto

One thing before the date.

Send me a photo of a place, object, or moment that means something to you.

Nothing too serious.

Just something with a story behind it.

---

## Postcard Submission

The participant can:

- Upload one photo
- Add an optional short caption
- Submit the photo privately to Ditto

Example caption:

"The view from the place I go when I need to clear my head."

---

## Privacy Rules

The submission is private.

Other participants do not see:

- who submitted each photo
- the original caption
- any personal explanation

Ditto should clearly communicate that the photo may be used anonymously during the date.

Do not request sensitive, identifying, or intimate content.

---

## Anonymous Postcard Pick

After all four participants submit,

Ditto privately shows each participant only the anonymous submissions belonging to people they are romantically eligible to match with.

---

## Conversation

Ditto

Everyone sent something in.

Pick the one you're most curious about.

Don't overthink it.

---

## Interaction — Selection

Display only eligible anonymous submissions.

Do not show:

- names
- profile photos
- gender labels
- identifying captions
- submissions from romantically incompatible participants

The participant selects one submission.

Primary Button

Pick This One

---

## Eligibility Example

For a heterosexual group containing two women and two men:

- each woman sees only the two men's submissions
- each man sees only the two women's submissions

A woman should not receive the other woman's submission if neither participant is interested in women.

The same rule applies to every group configuration.

Ditto must filter submissions using mutual romantic eligibility rather than gender alone.

A submission should appear only when:

- the viewer's preferences include the submitter
- the submitter's preferences include the viewer
- both participants are eligible to match with one another

---

## System Logic

Each participant submits one response privately.

After all submissions are received:

- remove names and identifying metadata
- determine mutual romantic eligibility for every participant pair
- show each participant only submissions from eligible matches
- allow each participant to select one eligible submission
- record every selection privately

The Postcard Pick result may be used to create:

- the first pairing
- a conversation moment
- an activity assignment
- a later reveal

The participant should not yet learn:

- whose submission they selected
- who selected their submission
- how the selection will affect the date


---

## Content Rules

Postcard Pick should be:

- quick
- visually simple
- emotionally safe
- easy to complete
- relevant to the live date

Avoid turning it into a personality test or long written prompt.

---

## Motion

The upload interface should appear naturally inside the Messages experience.

After submission, the photo settles into the conversation as a sent attachment.

The anonymous selection cards appear only after everyone has submitted.

---

## Participant Learns

Ditto is already creating connections before the group meets through an approved mechanic from the Task Library.

Their response will influence part of the live experience.

---

## Exit Transition

After the participant selects a photo,

Ditto sends:

Got it.

You'll find out why during the date.

Time advances to the one-day reminder.

Screen 17 begins.


# Screen 17 — One-Day Reminder

## Purpose

Remind the participant about the upcoming date without making the experience feel administrative.

The reminder should rebuild excitement, confirm the essential logistics, and make the participant feel prepared.

---

## Audience

Participants.

---

## Question Answered

"Is everything still happening, and am I ready?"

---

## Emotion

Anticipation.

The participant should think:

"Tomorrow is actually going to be fun."

---

## Entry Transition

Time advances to approximately one day before the confirmed date.

The conversation returns to Jacob's Messages thread with Ditto.

A typing indicator appears.

---

## Conversation

Ditto

Tomorrow 👀

Golden Hour Beach Cookout

Friday at 6:00 PM

Dockweiler State Beach

Everyone's still in.

---

## Reminder Content

Include:

- Experience title
- Day and start time
- Exact meeting location
- Weather update
- One useful preparation note
- Confirmation that the group is still attending

Example:

Looks like 22°C and clear.

Bring a light hoodie for later.

I'll message you again before it starts.

---

## Content Rules

Keep the reminder short.

Do not repeat the full experience details.

Do not reveal:

- live tasks
- pair assignments
- private missions
- anonymous mechanics
- the final selection mechanic

The participant should feel prepared without knowing exactly how the date will unfold.

---

## Interaction

Primary Button

View Details

Secondary Button

Got it

---

## System Logic

The reminder is sent only after:

- the group is fully confirmed
- the date plan is finalized
- no participant has withdrawn

If a participant withdraws before the date, Ditto should resolve the group before sending a normal reminder.

The system should not falsely tell participants that everyone is still attending.

---

## Motion

The reminder arrives as a natural sequence of messages.

The experience title may appear as a compact preview card.

Avoid using push-notification mockups or dashboard layouts.

The interaction should continue feeling like a real Messages conversation.

---

## Participant Learns

The date is still happening.

The important details have not changed.

Ditto is continuing to coordinate everything.

---

## Exit Transition

After the participant selects "Got it,"

time advances to shortly before the date begins.

Screen 18 begins.

# Screen 18 — Date Starts

## Purpose

Transition the participant from preparation into the live Group Mode experience.

This screen marks the moment Ditto stops planning in the background and begins actively guiding the date.

The participant should immediately understand that the experience is now live.

---

## Audience

Participants.

---

## Question Answered

"What do I do now?"

---

## Emotion

Nervous excitement.

The participant should think:

"Okay. This is actually happening."

---

## Entry Transition

Time advances to the confirmed start time.

The participant has arrived at the meeting location.

The Messages conversation with Ditto becomes active again.

A typing indicator appears.

---

## Conversation

Ditto

You're here.

Date starts now.

Say hi to everyone first.

I'll send the next step when you're ready.

---

## Live Status

Display a subtle live indicator:

Group Mode is live

Do not introduce a new dashboard or separate app interface.

The participant should remain inside the Messages conversation.

---

## Interaction

Primary Button

We're all here

Secondary Button

Someone's missing

---

## System Logic

If the participant selects:

### We're all here

Ditto confirms that the group has assembled.

Proceed to the first live date instruction.

---

### Someone's missing

Ditto begins an arrival check.

It privately contacts the missing participant and updates the group without exposing unnecessary personal information.

Example:

I'm checking in with them now.

Give me a minute.

If the participant is delayed, Ditto provides a neutral update.

If they are no longer attending, Ditto adapts the experience for the remaining group.

---

## Content Rules

Keep the opening simple.

Do not immediately send:

- pair assignments
- private missions
- anonymous prompts
- long instructions
- multiple tasks at once

Participants should have a natural moment to arrive, greet one another, and settle in.

---

## Motion

The start message arrives at the exact scheduled time.

The live status appears subtly.

The response buttons slide upward.

The interface should feel active without becoming visually intense.

---

## Participant Learns

Ditto is now guiding the experience in real time.

They do not need to remember the plan or organize the group themselves.

---

## Exit Transition

After the participant confirms that everyone has arrived,

Ditto sends the first live group instruction.

The next act begins.

# ACT 3 — During the Date

## Implemented Beach-Cookout Sequence

This section is the source of truth for the active beach-cookout prototype and supersedes the older representative Screen 19–35 task sequence below. The older sequence remains as product exploration only and is not active in the prototype.

- **6:00 PM — Date begins:** Ditto says, “You’re all here. Phones away for a minute. I’ll step in when I’m needed.” No input is required.
- **6:10 PM — Linked dodgeball:** Ditto explicitly names the game as linked dodgeball. Jacob + Olivia compete against Lucas + Kayla while remaining linked by hand, arm, or the provided wrist band. Disconnecting awards the other pair a point. The only action is **Game finished**. The simulated result is stored in shared date state.
- **6:40 PM — Couple-photo challenge:** Pairings switch to Olivia + Lucas and Kayla + Jacob. Each pair has eight minutes to take one convincing six-month-couple photo. The only action is **Photos taken**. The simulated winner determines the next phase.
- **7:00 PM — Cookout setup and ingredient preparation:** The losing photo pair receives ingredient-prep duty only. One member must wear the blindfold for the prep round while their partner guides. The winning photo pair handles the table, drinks, plates, and barbecue-area setup. User-facing copy stays concise and does not expose internal safety logic. The only action is **We’re ready to grill**.
- **7:20 PM — Arm-wrestling grill-duty challenge:** Each photo pair chooses one representative in person. One arm-wrestling match decides grill duty, with no representative-selection or score-entry UI. The only action is **Match finished**. The deterministic result is stored separately from the couple-photo result, and the losing arm-wrestling pair receives grill duty.
- **7:25 PM — Grilling and dinner:** Grilling begins immediately after the arm-wrestling result. There is no scored task, form, quiz, or phone input during dinner.
- **8:00 PM — Private ten-minute window:** Each participant privately types one group member’s name. Matching is trimmed and case-insensitive; self-selection and invalid names receive conversational inline validation. Outcomes resolve only after all four submissions exist and are delivered simultaneously to each private POV.
- **8:25 PM — Final Signal:** Each participant privately types one group member’s name or “no one.” The response locks permanently on submission. There is no secondary choice, edit, undo, or reopen state.
- **Waiting state:** Ditto confirms the locked signal and shows a subtle prototype-only **Fast-forward to 12:00 AM** control.
- **12:00 AM — Result reveal:** A visible midnight divider is appended. All four locked signals resolve once. Each participant sees only their personalized mutual or non-mutual result, and one-sided choices remain private.

Shared instructions are delivered separately to all four private Ditto threads. Shared state, pairing history, outcomes, locks, and delivered messages persist across prototype POV switching. The active flow contains no MBTI read, clue race, ranking form, repeated questionnaire, or unrelated dinner task.

## Goal

Transform four strangers into meaningful connections through live, adaptive orchestration.

Ditto guides the group using approved mechanics from `TASK_LIBRARY.md`.

The storyboard defines the participant-facing sequence.

The Task Library defines the reusable mechanic rules, safety logic, eligibility checks, data handling, and implementation constraints.

When the two documents conflict:

- The storyboard controls the narrative order and visible participant experience.
- `TASK_LIBRARY.md` controls the internal rules of the selected mechanic.
- Codex must not invent a new mechanic when an approved mechanic can support the intended moment.

---

## Participant Journey

"Okay, this is actually happening."

↓

"That was their postcard?"

↓

"I am starting to notice different people."

↓

"Someone here is curious about me."

↓

"I know who I want more time with."

↓

"Who would I actually see again?"

---

## Live-Date Design Rules

- The experience remains inside each participant's private Ditto conversation.
- There is no public group chat.
- Shared instructions are sent separately to all four participants.
- Private choices, rankings, compliments, questions, and requests remain private.
- Pairing options must always respect mutual romantic eligibility.
- Earlier signals may influence later pairings but may never create a false mutual result.
- Do not expose compatibility scores, popularity counts, private application answers, or internal pairing logic.
- Do not repeatedly reward, isolate, or validate the same participant.
- Participants may privately skip or decline eligible mechanics without their reason being exposed.
- Live tasks should create interaction through action, choice, coordination, or curiosity rather than generic icebreakers.
- Avoid forced confessions, humiliation, public rejection, sexual pressure, or non-consensual physical contact.
- The exact task sequence may adapt to the venue and group, but the prototype follows the representative sequence below.

---

# Screen 19 — Postcard Pick Reveal

## Purpose

Reveal whose anonymous postcard Jacob selected before the date and use that choice to create the first pairing.

This is the payoff to the pre-date Postcard Pick mechanic.

---

## Audience

Participants.

Each participant receives only their own reveal through their private Ditto conversation.

---

## Question Answered

"Whose postcard did I choose?"

---

## Emotion

Surprise and curiosity.

The participant should think:

"Oh—that was theirs."

---

## Entry Transition

After everyone confirms that they have arrived, Ditto gives the group a brief natural moment to greet one another.

A typing indicator appears.

The postcard Jacob selected reappears in the conversation.

---

## Conversation

Ditto

Remember the postcard you picked?

It was Kayla's.

For the first part,

you are with her.

---

## Visual Treatment

- Reuse the exact anonymous postcard shown before the date.
- Fade Kayla's name in beneath it.
- Transition the postcard into a compact pairing pass.
- Keep the reveal inside Messages rather than opening a separate dashboard.

---

## Pairing Logic

The first pairing uses the locked Postcard Pick selections.

Prioritize:

1. Mutual postcard selections
2. One-sided selections that support the strongest complete group configuration
3. Underexplored eligible pairings
4. Pairing balance across all four participants

Every participant must receive exactly one partner.

The system must validate both resulting pairs before revealing either one.

---

## Privacy Rules

Reveal only:

- The owner of the postcard the participant selected
- The participant's first partner
- The next action

Do not reveal:

- Who selected the participant's postcard
- Whether the selection was mutual
- Other participants' postcard choices
- Internal pairing scores
- Any caption or explanation that was not approved for sharing

---

## Interaction

Primary Button

Got it

---

## Participant Learns

A small private choice made before the date directly shapes the live experience.

---

## Exit Transition

The pairing pass lifts and expands into the first paired task.

Screen 20 begins.

# Screen 20 — Opening Paired Task

## Purpose

Give both initial pairs a short cooperative activity that reduces awkwardness and creates natural interaction.

The task must be selected from the approved Task Library and adapted to the generated date.

---

## Question Answered

"What are we doing together?"

---

## Emotion

Playful momentum.

---

## Representative Beach Cookout Example

Pair A:

Choose the ingredients for the shared meal within the assigned budget.

Pair B:

Prepare the cooking area and complete the setup clue.

Both pairs are working toward the same later group outcome.

---

## Conversation

Ditto

First mission.

Kayla + Jacob:

choose the ingredients for the group.

Olivia + Ethan:

set up the cooking station and unlock the first clue.

You have twelve minutes.

---

## Task Selection Logic

Codex must:

1. Identify the emotional objective for this phase.
2. Search `TASK_LIBRARY.md` for the best approved early-date mechanic.
3. Validate venue, weather, timing, accessibility, comfort, and available materials.
4. Adapt the mechanic without changing its core purpose.
5. Generate concise participant-facing instructions.
6. Fall back to an approved seated or conversation-based mechanic when the environment changes.

Do not generate a completely new mechanic unless no approved option can reasonably work.

---

## Interaction

Primary Button

Start

Secondary Button

Need help

---

## Content Rules

- Keep instructions short enough to understand at a glance.
- Do not add a long list of questions.
- Do not force physical contact.
- Do not ask participants to perform romance.
- Both pairs should receive comparable effort, duration, and quality.
- The task should require cooperation rather than four independent phone actions.

---

## Motion

The partner appears first.

The task objective appears second.

Any time limit or material constraint appears last.

A subtle live state begins after the participant selects Start.

---

## Exit Transition

When both pairs complete their tasks, Ditto brings the group back together.

Screen 21 begins.

# Screen 21 — Group Convergence

## Purpose

Combine the outputs of both paired tasks into one shared group action.

The reunion happens through doing, not through formal reflection.

---

## Question Answered

"How do both pair tasks connect?"

---

## Emotion

Shared momentum.

---

## Conversation

Ditto

Both pairs are done.

Bring everything back to the main spot.

You need what the other pair has.

---

## Representative Beach Cookout Example

- Kayla and Jacob return with ingredients.
- Olivia and Ethan finish the cooking station.
- The four participants assemble the meal together.
- A clue from one pair determines how the other pair's items are used.

Neither pair can complete the next phase alone.

---

## Core Rules

The convergence must include:

- One shared physical or practical objective
- A visible reason both pairs' work matters
- An immediate next action
- A result all four participants contribute to

Do not ask participants to:

- Present what they learned
- Evaluate their partner
- Explain how the task made them feel
- Take turns answering generic prompts

Conversation should emerge naturally from the shared action.

---

## Interaction

Primary Button

Everyone's back

Secondary Button

We need more time

---

## Exit Transition

Once the shared action is underway, Ditto briefly steps back.

After a natural interaction period, the next approved mechanic appears.

Screen 22 begins.

# Screen 22 — The MBTI Read

## Purpose

Create playful observation and teasing by asking the group to identify whose personality type is being revealed one dimension at a time.

---

## Task Library Mechanic

`early_mbti_read`

---

## Question Answered

"How are we already reading one another?"

---

## Emotion

Playful recognition.

---

## Entry Conditions

Run only when enough participants have usable MBTI or personality-dimension data.

Do not treat MBTI as objective science or proof of compatibility.

If the required data is unavailable, replace this screen with another approved early-date mechanic.

---

## Conversation

Ditto

Quick read.

One person here is:

E.

Who do you think it is?

---

## Interaction

Each participant privately selects one name.

Ditto then reveals the next dimension:

N

Then:

F

Then:

P

Participants may update their private guess after each reveal.

---

## Final Reveal

Ditto

ENFP.

It was Olivia.

Three of you changed your answer halfway through.

---

## Privacy and Content Rules

- Do not expose the full application answer.
- Do not diagnose or stereotype participants.
- Do not claim the type predicts relationship success.
- Do not reveal each participant's exact guess.
- Do not repeat the mechanic for every participant.
- Keep the entire sequence brief.

---

## Exit Transition

The reveal creates a short natural conversation.

Ditto then introduces one shared competitive moment.

Screen 23 begins.

# Screen 23 — Earn Your Paradise

## Purpose

Create a brief shared competition with a reward that meaningfully changes the next part of the date.

---

## Task Library Mechanic

`early_earn_your_paradise`

---

## Question Answered

"What are we playing for?"

---

## Emotion

Playful competition.

---

## Representative Challenge

The group completes a short collaborative clue race using items from the cookout setup.

The winning pair earns first choice of the next paired role.

---

## Conversation

Ditto

Paradise is open.

First pair to solve the clue gets first choice of the next role.

Eight minutes.

Go.

---

## Reward Rules

The reward must affect the date.

Approved examples:

- First choice of the next paired role
- Best seats for the next phase
- Choice of dessert or shared item
- Control of the next pairing within eligibility rules
- A private clue
- Selection of the next music or activity

Do not award popularity, romantic ownership, or public validation.

---

## Interaction

Primary Button

Start Challenge

Secondary Button

View Rules

---

## System Logic

- Explain the winning criteria before the challenge starts.
- Keep the challenge under ten minutes.
- Validate accessibility and venue suitability.
- Apply the reward immediately after the result.
- Prevent one participant from accumulating repeated structural advantages.
- Fall back to a seated puzzle when needed.

---

## Exit Transition

The result appears.

The reward changes the next pairing or role without exposing private attraction data.

Screen 24 begins.

# Screen 24 — Reverse Pairing

## Purpose

Move the group into less-explored valid pairings before obvious connections become fixed too early.

---

## Task Library Mechanic

`mid_reverse_pairing`

---

## Question Answered

"Who am I getting to know next?"

---

## Emotion

Fresh anticipation.

---

## Conversation

Ditto

Switching it up.

Jacob + Olivia

Kayla + Ethan

For the next round,

each pair is finishing one part of dinner.

---

## Pairing Logic

Prioritize:

1. Valid pairs with no previous one-on-one interaction
2. Pairs with the lowest total interaction time
3. Pairs with plausible shared or complementary interests
4. The most balanced two-pair configuration

Before confirming, check:

- Mutual romantic eligibility
- Decline and opt-out history
- Recent pairing repetition
- One-on-one time balance
- Venue and task suitability
- Whether both resulting pairs are valid

---

## Interaction

Primary Button

Ready

Secondary Button

Request another pairing

A pairing-change request is private.

Ditto adapts without revealing who requested the change.

---

## Privacy Rules

Do not tell participants:

- Why the pairing was selected
- Who has received less attention
- Which pair Ditto predicts is strongest
- That a previous connection is being interrupted
- That the pairing is designed to create jealousy

---

## Exit Transition

The short paired role begins.

After enough interaction has occurred, Ditto collects the first private preference data.

Screen 25 begins.

# Screen 25 — First Impression Ranking

## Purpose

Capture each participant's early curiosity without exposing full rankings or public rejection.

---

## Task Library Mechanic

`early_first_impression_ranking`

---

## Question Answered

"Who am I most curious to know better?"

---

## Emotion

Private curiosity.

---

## Conversation

Ditto

First impression check.

Based only on the date so far,

rank who you are most curious to know better.

No one sees your list.

---

## Interaction

Show only romantically eligible participants.

Require a complete private ranking with no ties.

Optional Button

Not ready yet

---

## Reveal Logic

After all responses are collected, Ditto may release one safe positive reveal.

Prioritize:

1. A mutual first-place choice
2. Someone receiving a first-place choice
3. Two people choosing the same person
4. A participant appearing in multiple top-two rankings
5. A vague group-level pattern

Never reveal:

- Who ranked last
- Who received no first-place choices
- A full participant ranking
- One-sided rejection
- Popularity counts

---

## Example Group-Level Reveal

Ditto

One first impression was mutual.

That is all you get for now.

---

## System Logic

Store the full ranking privately.

Use it only as one input for later pairing, curiosity, and side-conversation mechanics.

The ranking must not determine the final result.

---

## Exit Transition

The ranking interface collapses.

The date returns to the shared activity before Ditto introduces an anonymous conversation mechanic.

Screen 26 begins.

# Screen 26 — Secret Question Drop

## Purpose

Let participants ask something they genuinely want answered without immediately claiming the question.

---

## Task Library Mechanic

`early_secret_question_drop`

---

## Question Answered

"What do I actually want to know about someone here?"

---

## Emotion

Intrigue.

---

## Conversation

Ditto

Drop one question you actually want answered.

Pick one person or send it to anyone.

They will see the question,

not your name.

---

## Interaction

Fields:

- Recipient
- Question

Recipient options:

- Specific eligible participant
- Current partner
- Anyone

Primary Button

Send privately

Secondary Button

Skip

---

## Delivery

Ditto screens all submissions and releases selected approved questions one at a time.

Example:

Ditto

Question for Ethan:

What changed most from your first impression of this group?

---

## Safety Rules

Reject or safely rewrite questions involving:

- Trauma
- Medical history
- Income
- Immigration status
- Sexual history
- Family conflict
- Public ranking
- Humiliation
- Private application information
- Targeted negativity

The recipient may privately skip without penalty.

Do not automatically reveal the sender.

---

## Balance Rules

- Avoid sending several questions to one participant while another receives none.
- Prioritize questions inspired by something that happened during the date.
- Prefer questions that create a natural follow-up conversation.
- Do not turn the mechanic into an interview round.

---

## Exit Transition

After selected questions are answered, the group returns to the date activity.

Later, Ditto opens a more personal but still anonymous positive signal.

Screen 27 begins.

# Screen 27 — Anonymous Compliment Drop

## Purpose

Create genuine positive reinforcement and romantic curiosity through specific observations from the date.

---

## Task Library Mechanic

`early_anonymous_compliment_drop`

---

## Question Answered

"What did I notice about someone tonight?"

---

## Emotion

Warmth and curiosity.

---

## Conversation

Ditto

Send one compliment to someone here.

Make it specific enough that it could only be about today.

They will get it without your name.

---

## Interaction

Fields:

- Recipient
- Compliment

Primary Button

Send anonymously

Secondary Button

Skip

---

## Example Delivery

Ditto

Someone noticed this about you:

"You make quieter people feel included without making it look forced."

---

## Content Rules

Prioritize:

- Personality
- Energy
- Humour
- Behaviour
- A specific shared moment

Do not allow:

- Backhanded compliments
- Participant comparisons
- Sexual pressure
- Ownership language
- Pure popularity claims
- Generic messages such as "you are hot" or "you seem cool"

Appearance-based compliments may be delivered only when respectful and non-sexualized.

---

## Balance Logic

- Track incoming and outgoing compliment counts.
- Avoid heavily concentrating validation on one participant.
- Do not publicly reveal totals.
- Do not expose that someone received none.
- Save extra approved compliments for later rather than announcing several at once.
- Never invent a compliment to manufacture equality.

---

## Exit Transition

The compliment is delivered privately.

Ditto may use the hidden sender-recipient relationship as one supporting signal for the next mechanic.

Screen 28 begins.

# Screen 28 — Curiosity Ping

## Purpose

Privately tell a participant that someone wants to know them better without revealing the sender or exaggerating the signal.

---

## Task Library Mechanic

`mid_curiosity_ping`

---

## Question Answered

"Is someone here curious about me too?"

---

## Emotion

Suspense.

---

## Entry Conditions

Trigger only when genuine stored data supports the message.

Possible supporting signals:

- Mutual high ranking
- Side-conversation request
- Repeated interest across mechanics
- Specific compliment
- Secret question
- Single high ranking

Skip the screen when no valid signal exists.

---

## Conversation

Ditto

Someone here wants another chance to talk to you.

---

## Interaction

Private options:

- I am curious too
- Give me a hint
- Keep it anonymous
- Not sure yet

---

## Hint Logic

Approved vague hints:

- You have already been paired once.
- They noticed something you said earlier.
- Their first impression changed.
- You have not had much one-on-one time yet.
- They chose you during a private task.

Do not reveal:

- Gender
- Clothing
- Seat position
- Initials
- Exact ranking
- Original submission wording
- Any clue that leaves only one possible sender

---

## Rules

- Never invent curiosity.
- Never say someone "likes you" when the data only shows interest or curiosity.
- Do not send the recipient's response to the sender.
- Limit each participant to one ping unless the date format explicitly supports more.
- Do not repeatedly validate the most popular participant.
- Do not manufacture balance with unsupported signals.

---

## Exit Transition

The private response is stored.

Later pairing logic may use mutual curiosity as one weighted input.

Screen 29 begins.

# Screen 29 — Private Side Conversation Request

## Purpose

Let each participant privately identify someone they want more one-on-one time with.

A one-sided request remains completely hidden.

---

## Task Library Mechanic

`mid_private_side_conversation_request`

---

## Question Answered

"Who do I want more time with?"

---

## Emotion

Choice and vulnerability.

---

## Conversation

Ditto

Anyone here you want ten minutes alone with?

They will not know you picked them unless the request becomes mutual.

---

## Interaction

Show only eligible participants.

Options:

- One participant
- No one yet
- Surprise me later

Primary Button

Lock choice

---

## Mutual Request Logic

A Ten-Minute Side Conversation may be scheduled when:

- Both participants selected each other
- Both remain eligible
- Neither opted out
- The pair has not already received disproportionate time
- The remaining pair is valid and safe
- The venue supports a temporary split
- Enough date time remains

Do not announce that the request was mutual.

---

## One-Sided Request Logic

When only one participant makes the request:

- Store it as a private curiosity signal.
- Do not notify the selected participant.
- Do not guarantee a later pairing.
- Do not treat it as mutual interest.
- Do not expose request counts.

---

## Exit Transition

If a valid mutual request exists, Ditto schedules the side conversation at the next natural break.

Otherwise, the date continues without announcing that no mutual request occurred.

Screen 30 begins only when a valid side conversation is available.

# Screen 30 — Ten-Minute Side Conversation

## Purpose

Create focused one-on-one time for a meaningful, underexplored, or mutually requested pair.

---

## Task Library Mechanic

`mid_ten_minute_side_conversation`

---

## Question Answered

"What happens when it is just us?"

---

## Emotion

Focused chemistry.

---

## Pair Selection Priority

1. Mutual side-conversation request
2. Mutual curiosity signals
3. Strong but underexplored compatibility
4. A valid earned reward
5. Mutual high ranking
6. An unexpected but plausible underexplored pair
7. The pair with the least one-on-one time

The internal reason is never revealed.

---

## Group Message

Ditto

Olivia + Jacob,

you have ten minutes together.

Kayla + Ethan,

you have a small mission of your own.

Meet back here when I call you.

---

## Selected Pair Message

Ditto

You have ten minutes.

No script.

Just talk without the whole group around.

---

## Remaining Pair Activity

Give the remaining pair a lightweight activity of comparable value.

Approved examples:

- Choose dessert for the group
- Take one photo that captures the date mood
- Pick the next song
- Complete a short collaborative puzzle
- Prepare the final part of the meal
- Answer one playful prompt while completing a practical task

Do not make them monitor or compare the selected pair.

---

## Decline Handling

Either selected participant may privately decline.

When declined:

- Do not identify who declined.
- Do not reveal a reason.
- Do not frame it as rejection.
- Replace the moment with a group task or another valid configuration.
- Do not immediately pair the declining participant with someone else.

Fallback:

Ditto

Change of plans.

Staying together for this round.

---

## Timer Logic

- Start only after the split is confirmed.
- Send a private two-minute warning.
- Do not display a large public countdown.
- Allow a brief return grace period.
- Do not automatically extend the conversation.

---

## Exit Transition

Ditto calls both pairs back.

The group completes one final shared phase before the participant-led final pairing.

Screen 31 begins.

# Screen 31 — Recoupling

## Purpose

Let participants privately choose who they want beside them for the final paired activity.

This marks the shift from system-led exploration to participant-led preference.

---

## Task Library Mechanic

`late_recoupling`

---

## Question Answered

"Who do I want for the final part?"

---

## Emotion

Intentional choice.

---

## Conversation

Ditto

Final pairing.

Who do you want beside you for the next round?

Your choice stays private unless it helps create the pairing.

---

## Interaction

Show only eligible participants.

Options:

- One participant
- Let Ditto choose

Primary Button

Lock choice

---

## Configuration Logic

For four participants, generate every valid two-pair configuration.

Score using:

1. Mutual selections
2. Overall preference alignment
3. Romantic eligibility
4. Underexplored connection potential
5. Pairing repetition
6. One-on-one time balance
7. Decline and opt-out history
8. Final-task suitability

Mutuality receives strong weight but never overrides safety or valid remaining-pair logic.

---

## Privacy Rules

Do not reveal:

- Who selected whom
- One-sided selections
- Selection counts
- Who was selected first or last
- Whether a pairing was mutual
- Who chose Let Ditto choose

Announce both final pairs at the same time.

---

## Group Reveal

Ditto

Final pairs:

Jacob + Olivia

Kayla + Ethan

One last task.

---

## Final Activity

Both pairs receive the same activity or equivalent roles.

Approved examples:

- Finish and plate the final course
- Take a final pair photo
- Complete one collaborative challenge
- Choose an item for the other pair
- Walk and complete one conversation prompt
- Select a song that represents the date

Avoid forced affection, public ranking, kissing instructions, or confessions.

---

## Exit Transition

The recoupled pairs complete the final activity.

Before the group leaves, Ditto may send one final positive reveal.

Screen 32 begins.

# Screen 32 — Someone Chose You Reveal

## Purpose

Confirm that a participant received genuine interest while protecting the chooser's identity and avoiding public rejection.

---

## Task Library Mechanic

`late_someone_chose_you_reveal`

---

## Question Answered

"Did anyone choose me tonight?"

---

## Emotion

Romantic tension.

---

## Entry Conditions

Trigger only when:

- A genuine supporting signal exists
- The signal remains valid
- The sender can remain sufficiently anonymous
- The participant has not already received disproportionate validation
- The recipient has not opted out of romantic reveals

Skip the mechanic when a safe reveal is unavailable.

---

## Conversation

Ditto

Someone chose you tonight.

That is all I am telling you for now.

---

## Interaction

Private options:

- I think I know who
- I have someone in mind too
- Give me a vague hint
- Keep it anonymous

The response remains private.

---

## Signal Priority

1. Mutual first-place selection
2. Mutual recoupling selection
3. Direct side-conversation request
4. First-place ranking
5. Repeated interest across mechanics
6. A single valid late-date choice

Do not imply stronger romantic interest than the stored signal supports.

---

## Anonymity Rules

Skip or delay the reveal when:

- Only one eligible sender is possible
- A visible participant-controlled action makes the sender obvious
- A hint would identify one person with certainty
- The signal was withdrawn, superseded, or invalidated

Never reveal:

- Exact mechanic source
- Ranking position
- Selection count
- Original private wording
- Who received no choices

---

## Exit Transition

The reveal closes.

Ditto allows the participants to say goodbye naturally.

The closing choice opens privately near the end of the date.

Screen 33 begins.

# Screen 33 — Final Signal

## Purpose

Capture who each participant would genuinely want to see again.

No result is revealed immediately.

---

## Task Library Mechanic

`closing_final_signal`

---

## Question Answered

"Who would I actually see again?"

---

## Emotion

Private honesty.

---

## Timing

Send near the end of the date after the main experience is complete.

Participants may edit their response until the displayed deadline.

Results are processed at 12:00 AM following the date in the date session's local timezone.

If the session remains active at 12:00 AM, delay processing until the session is marked complete.

---

## Conversation

Ditto

Final signal.

Who would you actually want to see again?

Results unlock at 12:00 AM.

---

## Interaction

Default format:

- One primary selection
- One optional secondary selection
- No one
- Not sure yet

Show only romantically eligible participants.

Primary Button

Lock signal

Secondary Button

Edit before deadline

---

## Submission Rules

- Choices remain private.
- Do not show whether anyone else submitted.
- Use only the latest valid response before the deadline.
- Do not allow self-selection or duplicate selections.
- A missing response becomes `no_response`, not `no_one`.
- Earlier rankings, pairings, and curiosity data cannot submit or override a Final Signal.
- One-sided choices are never revealed.

---

## Conversation After Submission

Ditto

Locked.

You can change it until 11:59 PM.

I will message you at midnight.

---

## Result Logic

A mutual result exists only when:

- Participant A selects Participant B
- Participant B selects Participant A
- Both submissions are valid and locked
- Both completed the date
- Both remain active and eligible
- Neither withdrew
- No safety or moderation restriction blocks the connection

Primary-primary mutuality receives the strongest internal priority.

Do not reveal ranking position in the result copy.

---

## Exit Transition

The date ends.

The live indicator disappears.

The phone returns to its normal Messages state.

Act 4 begins.

# ACT 4 — After the Date

## Goal

Create emotional closure without exposing one-sided interest.

The only romantic identities revealed are valid mutual Final Signal choices.

---

## Narrative

"My choice is locked."

↓

"Did anything come back mutual?"

↓

"What do I want to do next?"

---

# Screen 34 — Waiting for the Reveal

## Purpose

Make the delayed result timing clear without adding a new reflection or second-date-planning flow.

---

## Question Answered

"When do I find out?"

---

## Emotion

Anticipation.

---

## Entry Transition

The date session ends before midnight.

Ditto sends one final status message.

---

## Conversation

Ditto

That is the date.

Your signal is locked.

Mutual results reveal at 12:00 AM.

---

## Visual Treatment

- Return to the ordinary Ditto Messages thread.
- Remove the live Group Mode indicator.
- Show a compact scheduled reveal line.
- Do not create a dashboard, score screen, or countdown spectacle.

---

## System Logic

- Use the date session's local timezone.
- Store the scheduled reveal time.
- Run safety, withdrawal, active-status, and eligibility checks immediately before delivery.
- If the date is still active at midnight, wait until the session is complete.
- Do not reveal partial results early.
- Allow withdrawal only within the approved pre-reveal window.

---

## Exit Transition

Time advances to 12:00 AM.

A typing indicator appears.

Screen 35 begins.

# Screen 35 — Mutual Match Reveal

## Purpose

Reveal a valid mutual Final Signal privately and offer only the immediate next-step options included in the prototype scope.

This is the final screen in the current storyboard.

---

## Task Library Mechanic

`closing_mutual_match_reveal`

---

## Question Answered

"Did anyone choose me too?"

---

## Emotion

Payoff and possibility.

---

## Mutual Reveal Conversation

Ditto

Your final signal came back mutual.

You and Olivia both chose each other.

What do you want to do next?

---

## Interaction

Approved options:

- Exchange Instagram
- Exchange phone number
- Keep it in Ditto
- Not right now

Do not include automated second-date planning in this prototype.

Do not include post-date reflection.

---

## Consent Logic

A next step proceeds only when both participants select compatible options.

Examples:

- Both choose Exchange Instagram  
  → Ask each participant for final confirmation, then share handles.

- Both choose Exchange phone number  
  → Ask each participant for final confirmation, then share numbers.

- Both choose Keep it in Ditto  
  → Open the supported private Ditto communication path.

- One chooses a contact method and the other chooses Keep it in Ditto  
  → Do not share contact information. Offer the least exposing mutually acceptable option.

- Either chooses Not right now  
  → Do not reveal that exact choice to the other participant. Close neutrally.

Consent for one contact method never applies to another.

---

## Privacy Rules

Never reveal:

- One-sided selections
- Selection counts
- Primary or secondary ranking position
- Another mutual match
- Earlier rankings or curiosity data
- Why a next-step option did not proceed
- A participant's private contact information before bilateral confirmation

Mutual results are never posted to the full four-person group.

---

## Multiple Mutual Results

When a participant has more than one valid mutual result:

- Process each connection privately.
- Do not compare the matches.
- Do not reveal one connection to another.
- Keep contact consent separate for every pair.
- Do not force an immediate ranking.

---

## No Mutual Reveal

When no valid mutual result exists:

Ditto

The final signals are in.

No mutual reveal this time.

Thanks for showing up honestly.

Do not say:

- They did not choose you
- You received no interest
- Someone chose someone else
- You were rejected

---

## Invalidated Result

If a withdrawal, block, report, or safety restriction invalidates a result before delivery:

- Do not disclose that a mutual choice previously existed.
- Send the neutral no-mutual closing.
- Prevent contact sharing.
- Store the result as invalidated.

---

## Motion

At 12:00 AM:

- A typing indicator appears.
- The result arrives as ordinary Ditto messages.
- For a mutual result, the matched participant's compact profile image appears.
- Next-step choices slide into view.
- Avoid confetti, compatibility percentages, or game-show styling.
- The moment should feel warm, direct, and private.

---

## Participant Learns

Ditto protects every one-sided choice.

Only mutual interest becomes visible.

---

## Prototype End State

The storyboard ends after:

- A mutual result is revealed and a next-step preference is submitted, or
- A neutral no-mutual result is delivered.

Second-date planning and post-date reflection are outside the current prototype scope.

---

# STORYBOARD IMPLEMENTATION GUARDRAILS

- `TASK_LIBRARY.md` is the source of truth for mechanic-level rules.
- This storyboard is the source of truth for screen order, visible copy, and participant experience.
- Do not restore Golden Ticket, Role Swap, Private Window, Night Signal, Second-Date Unlock, or Post-Date Reflection.
- Use Final Signal instead of Night Signal everywhere.
- Process Final Signal results at 12:00 AM following the date in the session timezone.
- Do not reveal results immediately at the venue.
- Do not expose one-sided selections.
- Do not use compatibility percentages.
- Do not turn Participant Mode into a dashboard.
- Keep the participant experience inside private Ditto Messages.
- Do not create a public four-person chat.
- Do not make every task its own standalone app screen when it can live naturally inside the message flow.
- Preserve mutual romantic eligibility in every selectable option and pairing.
- Keep all private rankings, requests, compliments, questions, and responses hidden unless an approved mechanic explicitly permits a reveal.
- Do not invent unsupported romantic signals for narrative convenience.
- Do not add second-date planning or reflection screens unless the product scope changes.
