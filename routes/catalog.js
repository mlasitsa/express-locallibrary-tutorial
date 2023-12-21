const express = require("express");
const router = express.Router();

// Require controller modules.
const team_controller = require("../controllers/teamController");
const player_controller = require("../controllers/playerController");
const league_controller = require("../controllers/leagueController");

/// TEAM ROUTES ///

// GET catalog home page.
router.get("/", team_controller.index);

// GET request for creating a Team. NOTE This must come before routes that display Team (uses id).
router.get("/team/create", team_controller.team_create_get);

// POST request for creating Team.
router.post("/team/create", team_controller.team_create_post);

// GET request to delete Team.
router.get("/team/:id/delete", team_controller.team_delete_get);

// POST request to delete Team.
router.post("/team/:id/delete", team_controller.team_delete_post);

// GET request to update Team.
router.get("/team/:id/update", team_controller.team_update_get);

// POST request to update Team.
router.post("/team/:id/update", team_controller.team_update_post);

// GET request for one Team.
router.get("/team/:id", team_controller.team_detail);

// GET request for list of all Team items.
router.get("/teams", team_controller.team_list);

/// PLAYER ROUTES ///

// GET request for creating Player. NOTE This must come before route for id (i.e. display Player).
router.get("/player/create", player_controller.player_create_get);

// POST request for creating Player.
router.post("/player/create", player_controller.player_create_post);

// GET request to delete Player.
router.get("/player/:id/delete", player_controller.player_delete_get);

// POST request to delete Player.
router.post("/player/:id/delete", player_controller.player_delete_post);

// GET request to update Player.
router.get("/player/:id/update", player_controller.player_update_get);

// POST request to update Player.
router.post("/player/:id/update", player_controller.player_update_post);

// GET request for one Player.
router.get("/player/:id", player_controller.player_detail);

// GET request for list of all Players.
router.get("/players", player_controller.player_list);

/// LEAGUE ROUTES ///

// GET request for creating a League. NOTE This must come before route that displays League (uses id).
router.get("/league/create", league_controller.league_create_get);

//POST request for creating League.
router.post("/league/create", league_controller.league_create_post);

// GET request to delete League.
router.get("/league/:id/delete", league_controller.league_delete_get);

// POST request to delete League.
router.post("/league/:id/delete", league_controller.league_delete_post);

// GET request to update League.
router.get("/league/:id/update", league_controller.league_update_get);

// POST request to update League.
router.post("/league/:id/update", league_controller.league_update_post);

// GET request for one League.
router.get("/league/:id", league_controller.league_detail);

// GET request for list of all League.
router.get("/leagues", league_controller.league_list);

module.exports = router;
