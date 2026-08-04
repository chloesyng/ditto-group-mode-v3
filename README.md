# Ditto Group Mode

While researching the existing Ditto experience, I noticed a recurring theme in public user feedback: some users said they had been waiting a long time for a match, while others felt like they might never receive one.

That made me wonder whether the one-to-one matching format itself was limiting the number of possible connections.

Group Mode explores a different approach: bringing four compatible users together for one shared date, then using personalized tasks and pair rotations to help chemistry develop throughout the experience.

[Try the live experience](https://ditto-group-mode-v3.vercel.app)

## The problem

Ditto already goes beyond traditional dating apps by matching users and planning personalized dates for them.

However, the experience still depends on finding one compatible pairing at a time. From the public user feedback I reviewed, the biggest pain point was not necessarily the quality of the date plan. It was getting to the match in the first place.

Users described:

- waiting a long time without receiving a match
- feeling uncertain about whether a match would ever happen
- having only one possible connection when a date was formed
- feeling pressure for that single pairing to work

I wanted to explore whether a four-person format could create more possible connections within one experience, reduce the perceived wait for a date, and make meeting someone new feel more natural.

## The idea

Group Mode matches four compatible users for one shared date.

Ditto still handles the personalized date plan, but Group Mode extends the experience by supporting what happens after everyone arrives.

Throughout the date, Ditto acts as a quiet host by:

- explaining why the four users were grouped together
- coordinating availability and reminders
- guiding the group through personalized activities
- rotating pairings at different stages of the date
- creating opportunities for one-to-one interaction
- collecting private interest signals
- revealing mutual matches at the end

The goal is not to script every conversation. The tasks provide enough structure to reduce awkwardness while still leaving room for natural chemistry.

## Why four people

A four-person group gives each user more than one possible connection without making the experience feel too large or impersonal.

Users can begin in a lower-pressure group setting, then gradually interact in different pairings throughout the date.

Compared with a traditional one-to-one date, this creates more opportunities for someone to meet a compatible person within the same experience.

## What I built

I designed and developed an interactive end-to-end experience covering:

- user applications
- four-person group formation
- compatibility explanations
- personalized date recommendations
- availability coordination
- pre-date reminders
- live task orchestration
- dynamic pair rotations
- private interest selection
- final mutual-match reveals

The prototype includes five different four-person groups. Each group has its own users, compatibility reasoning, location, date plan, and activity sequence.

I also developed a structured task library that selects activities based on factors such as:

- the stage of the date
- the venue
- group energy
- social intensity
- coordination required
- the type of interaction the task is designed to create

## Key product decisions

### Increase the number of possible connections

Instead of depending on one predetermined pairing, each user has the opportunity to interact with multiple compatible people.

### Extend the experience beyond date planning

Ditto already decides where users should go. Group Mode explores how it could also shape what happens during the date and create stronger conditions for chemistry.

### Reduce awkwardness without over-controlling the experience

The tasks give users natural reasons to talk, collaborate, compete, and spend time in different pairings without forcing specific conversations.

### Build toward a clear emotional payoff

At the end of the experience, each user privately selects who they are interested in. Mutual interest is then revealed, giving the date a clear and meaningful conclusion.

## Business opportunity

Group Mode could also create a new revenue stream through partnerships with local businesses.

Restaurants, cafés, workshops, entertainment venues, and activity providers could host group dates selected around the users’ interests and personalities.

This could create value for everyone involved:

- users receive a more thoughtful and coordinated experience
- local businesses receive qualified four-person bookings
- Ditto expands from matching and date planning into real-world experience orchestration

## Tools

HTML, CSS, JavaScript, Cursor, Codex, GitHub, and Vercel.

## Disclaimer

This is an independent speculative product concept created by Chloe Ng.

It is not affiliated with Ditto and does not use Ditto’s internal code, APIs, infrastructure, or user data. All users and scenarios shown are fictional.
