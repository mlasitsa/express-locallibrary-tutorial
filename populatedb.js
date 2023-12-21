#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Team = require("./models/team"); // Team
const Player = require("./models/player");  // Player
const League = require("./models/league"); // League

const leagues = []; // League
const players = []; // Player
const teams = []; // Team

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createLeagues(); // League
  await createPlayers(); // Player
  await createTeams(); // Team
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function leagueCreate(index, name) {
  const league = new League({ name: name });
  await league.save();
  leagues[index] = league;
  console.log(`Added league: ${name}`);  // League
}

async function playerCreate(index, first_name, family_name, d_birth, d_death) {  // Player
  const playerdetail = { first_name: first_name, family_name: family_name };
  if (d_birth != false) playerdetail.date_of_birth = d_birth;
  if (d_death != false) playerdetail.date_of_death = d_death;   // I CAN REMOVE THIS ???

  const player = new Player(playerdetail);

  await player.save();
  players[index] = player;
  console.log(`Added player: ${first_name} ${family_name}`);
}

async function teamCreate(title, summary, playersArray, leaguesArray) { // Team
  const teamdetail = {
    title: title,
    summary: summary,
    players: playersArray, // Pass an array of players
  };
  if (leaguesArray) teamdetail.leagues = leaguesArray; // Pass an array of leagues

  const team = new Team(teamdetail);
  await team.save();
  teams.push(team);
  console.log(`Added team: ${title}`);
}

async function createLeagues() {  // League
  console.log("Adding leagues");
  await Promise.all([
    leagueCreate(0, "NCAA D1"),
    leagueCreate(1, "NCAA D3"),
    leagueCreate(2, "ACHA D1"),
  ]);
}

async function createPlayers() {  // Player
  console.log("Adding players");
  await Promise.all([
    playerCreate(0, "Max", "Lasitsa", "2001-01-22", false),
    playerCreate(1, "Danylo", "Sukhonos", "1999-09-16", false),
    playerCreate(2, "Arkhip", "Ledenkov", "1999-12-04", false),
    playerCreate(3, "Filimon", "Ledenkov", "1999-12-04", false),
    playerCreate(4, "Mike", "Makarenko", "2000-03-10", false),
  ]);
}

async function createTeams() {  // create Team
  console.log("Adding Teams");
  await Promise.all([
    teamCreate(
      "College of St Scholastica",
      "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
      [players[0]],
      [leagues[1]]
    ),
    teamCreate(
      "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
      "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
      [players[0]],
      [leagues[0]]
    ),
    teamCreate(
      "The Slow Regard of Silent Things (Kingkiller Chronicle)",
      "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
      [players[0]],
      [leagues[0]]
    ),
    teamCreate(
      "Apes and Angels",
      "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
      [players[1]],
      [leagues[1]]
    ),
    teamCreate(
      "Death Wave",
      "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
      [players[1]],
      [leagues[1]]
    ),
    teamCreate(
      "Test Book 1",
      "Summary of test book 1",
      [players[4]],
      [leagues[0], leagues[1]]
    ),
    teamCreate(
      "Test Book 2",
      "Summary of test book 2",
      [players[4]],
      [leagues[1]]
    ),
  ]);
}
