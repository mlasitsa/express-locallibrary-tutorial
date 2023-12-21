const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  league: [{ type: Schema.Types.ObjectId, ref: "League" }],
});

// Virtual for team's URL
TeamSchema.virtual("url").get(function () {
  return `/catalog/team/${this._id}`;
});

// Export model
module.exports = mongoose.model("Team", TeamSchema);
