const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  position: { type: String, required: true, enum: ['goalie', 'forward', 'defence'] }, 
});

// Virtual for player's full name
PlayerSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  return fullname;
});

// Virtual for player's URL
PlayerSchema.virtual("url").get(function () {
  return `/catalog/player/${this._id}`;
});

// Virtual for formatted date of birth
PlayerSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

// Export model
module.exports = mongoose.model("Player", PlayerSchema);
