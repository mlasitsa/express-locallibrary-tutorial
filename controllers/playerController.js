const Player = require("../models/player"); 
const asyncHandler = require("express-async-handler");
const Team = require("../models/team");
const { body, validationResult } = require("express-validator");


// Display list of all Players.
exports.player_list = asyncHandler(async (req, res, next) => {
  const allPlayers = await Player.find().select('first_name family_name position').sort({ family_name: 1 }).exec();
  res.render("player_list", {
    title: "Player List",
    player_list: allPlayers,
  });
});

// Display detail page for a specific Player.
exports.player_detail = asyncHandler(async (req, res, next) => {
  const [player, allTeamsByPlayer] = await Promise.all([
    Player.findById(req.params.id).exec(),
    Team.find({ player: req.params.id }, "title summary").exec(),
  ]);

  if (player === null) {
    const err = new Error("Player not found");
    err.status = 404;
    return next(err);
  }

  res.render("player_detail", {
    title: "Player Detail",
    player: player,
    player_teams: allTeamsByPlayer,
  });
});

// Display Player create form on GET.
exports.player_create_get = (req, res) => {
  res.render("player_form", { title: "Create Player" });
};

// Handle Player create on POST.
exports.player_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("position", "Position must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isIn(['goalie', 'forward', 'defence']),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const player = new Player({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      position: req.body.position,
    });

    if (!errors.isEmpty()) {
      res.render("player_form", {
        title: "Create Player",
        player: player,
        errors: errors.array(),
      });
    } else {
      await player.save();
      res.redirect(player.url);
    }
  }),
];

// Display Player delete form on GET.
exports.player_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of player and all their teams 
  const [player, allTeamsByPlayer] = await Promise.all([
    Player.findById(req.params.id).exec(),
    Team.find({ player: req.params.id }, "title summary").exec(),
  ]);

  if (player === null) {
    // No results.
    res.redirect("/catalog/players");
  }

  res.render("player_delete", {
    title: "Delete Player",
    player: player,
    player_teams: allTeamsByPlayer,
  });
});

// Handle Player delete on POST.
exports.player_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of player and all their teams
  const [player, allTeamsByPlayer] = await Promise.all([
    Player.findById(req.params.id).exec(),
    Team.find({ player: req.params.id }, "title summary").exec(),
  ]);

  if (allTeamsByPlayer.length > 0) {
    // Player has teams. Render in the same way as for the GET route.
    res.render("player_delete", {
      title: "Delete Player",
      player: player,
      player_teams: allTeamsByPlayer,
    });
    return;
  } else {
    // Player has no teams. Delete object and redirect to the list of players.
    await Player.findByIdAndRemove(req.body.playerid);
    res.redirect("/catalog/players");
  }
});

// Display Player update form on GET.
exports.player_update_get = asyncHandler(async (req, res, next) => {
  const player = await Player.findById(req.params.id).exec();
  if (player === null) {
    const err = new Error("Player not found");
    err.status = 404;
    return next(err);
  }

  res.render("player_form", { title: "Update Player", player: player });
});

// Handle Player update on POST.
exports.player_update_post = [

  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("position", "Position must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isIn(['goalie', 'forward', 'defence']),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const playerData = {
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      position: req.body.position,
      _id: req.params.id, 
    };

    if (!errors.isEmpty()) {
      res.render("player_form", {
        title: "Update Player",
        player: playerData,
        errors: errors.array(),
      });
    } else {
      await Player.findByIdAndUpdate(req.params.id, playerData);
      res.redirect(`/catalog/player/${req.params.id}`);
    }
  }),
];

