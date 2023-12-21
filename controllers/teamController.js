const Team = require("../models/team");
const League = require("../models/league");
const Player = require("../models/player"); 
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numTeams, numLeagues, numPlayers] = await Promise.all([
    Team.countDocuments({}).exec(),
    League.countDocuments({}).exec(),
    Player.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    team_count: numTeams,
    league_count: numLeagues,
    player_count: numPlayers,

  });
});

exports.team_list = asyncHandler(async (req, res, next) => {
  const allTeams = await Team.find({}, "title league")
    .sort({ title: 1 })
    .populate("league")
    .exec();

  res.render("team_list", { title: "Team List", team_list: allTeams });
});

exports.team_detail = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id)
    .populate("league")
    .exec();

  if (team === null) {
    const err = new Error("Team not found");
    err.status = 404;
    return next(err);
  }

  res.render("team_detail", {
    title: team.title,
    team: team,
  });
});

exports.team_create_get = asyncHandler(async (req, res, next) => {
  const allLeagues = await League.find().exec();
  res.render("team_form", {
    title: "Create Team",
    leagues: allLeagues,
  });
});

exports.team_create_post = [
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("league", "League must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const team = new Team({
      title: req.body.title,
      summary: req.body.summary,
      league: req.body.league,
    });

    if (!errors.isEmpty()) {
      const allLeagues = await League.find().exec();
      res.render("team_form", {
        title: "Create Team",
        leagues: allLeagues,
        team: team,
        errors: errors.array(),
      });
    } else {
      await team.save();
      res.redirect(team.url);
    }
  }),
];

exports.team_delete_get = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id).exec();
  if (team === null) {
    res.redirect("/catalog/teams");
  }

  res.render("team_delete", {
    title: "Delete Team",
    team: team,
  });
});

exports.team_delete_post = asyncHandler(async (req, res, next) => {
  await Team.findByIdAndRemove(req.body.teamid);
  res.redirect("/catalog/teams");
});

exports.team_update_get = asyncHandler(async (req, res, next) => {
  const [team, allLeagues] = await Promise.all([
    Team.findById(req.params.id).populate("league").exec(),
    League.find().exec(),
  ]);

  if (team === null) {
    const err = new Error("Team not found");
    err.status = 404;
    return next(err);
  }

  res.render("team_form", {
    title: "Update Team",
    leagues: allLeagues,
    team: team,
  });
});

exports.team_update_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("league", "League must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Team object with escaped/trimmed data and old id.
    const teamData = {
      title: req.body.title,
      summary: req.body.summary,
      league: req.body.league,
    };

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const allLeagues = await League.find().exec();
      res.render("team_form", {
        title: "Update Team",
        leagues: allLeagues,
        team: teamData,
        errors: errors.array()
      });
    } else {
      // Data from form is valid. Update the record.
      const updatedTeam = await Team.findByIdAndUpdate(req.params.id, teamData, { new: true });
      // Redirect to team detail page.
      res.redirect(updatedTeam.url); 
    }
  }),
];