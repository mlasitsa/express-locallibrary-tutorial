const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LeagueSchema = new Schema({
  name: { type: String, required: true , minLength: 3, maxLength: 100},
});

// Virtual for leagues's URL
LeagueSchema.virtual("url").get(function () {
  return `/catalog/league/${this._id}`;
});

// Export model
module.exports = mongoose.model("League", LeagueSchema);