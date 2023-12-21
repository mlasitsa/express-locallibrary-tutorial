const League = require("../models/league");
const Team = require("../models/team");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all leagues.
exports.league_list = asyncHandler(async (req, res) => {
  const allLeagues = await League.find().sort({ title: 1 }).exec();
  res.render("league_list", {
    title: "League List",
    league_list: allLeagues,
  });
});

// Display detail page for a specific league.
exports.league_detail = asyncHandler(async (req, res, next) => {
  const [league, teamsInLeague] = await Promise.all([
    League.findById(req.params.id).exec(),
    Team.find({ league: req.params.id }).exec(),
  ]);
  if (!league) {
    const err = new Error("League not found");
    err.status = 404;
    return next(err);
  }
  res.render("league_detail", {
    title: "League Detail",
    league,
    league_teams: teamsInLeague,
  });
});

// Display league create form on GET.
exports.league_create_get = (req, res) => {
  res.render("league_form", { title: "Create League" });
};

// Handle league create on POST.
exports.league_create_post = [
  body("name", "League name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const league = new League({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("league_form", {
        title: "Create League",
        league,
        errors: errors.array(),
      });
    } else {
      const leagueExists = await League.findOne({ name: req.body.name }).exec();
      if (leagueExists) {
        res.redirect(leagueExists.url); 
      } else {
        await league.save();
        res.redirect(league.url);
      }
    }
  }),
];

// Display league delete form on GET.
exports.league_delete_get = asyncHandler(async (req, res, next) => {
  const [league, teamsInLeague] = await Promise.all([
    League.findById(req.params.id).exec(),
    Team.find({ league: req.params.id }).exec(),
  ]);

  if (!league) {
    res.redirect("/catalog/leagues");
  } else {
    res.render("league_delete", {
      title: "Delete League",
      league,
      league_teams: teamsInLeague,
    });
  }
});

// Handle league delete on POST.
exports.league_delete_post = asyncHandler(async (req, res, next) => {
  const [league, teamsInLeague] = await Promise.all([
    League.findById(req.params.id).exec(),
    Team.find({ league: req.params.id }).exec(),
  ]);

  if (teamsInLeague.length > 0) {
    res.render("league_delete", {
      title: "Delete League",
      league,
      league_teams: teamsInLeague,
    });
  } else {
    await League.findByIdAndRemove(req.params.id);
    res.redirect("/catalog/leagues");
  }
});

// Display league update form on GET.
exports.league_update_get = asyncHandler(async (req, res) => {
  const league = await League.findById(req.params.id).exec();
  if (!league) {
    const err = new Error("League not found");
    err.status = 404;
    return next(err);
  }
  res.render("league_form", { title: "Update League", league });
});

// Handle league update on POST.
exports.league_update_post = [
  body("name", "League name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("league_form", {
        title: "Update League",
        league: { name: req.body.name, _id: req.params.id },
        errors: errors.array(),
      });
    } else {
      await League.findByIdAndUpdate(req.params.id, { name: req.body.name });
      res.redirect(`/catalog/league/${req.params.id}`); 
    }
  }),
];
