const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema(
  {
    title: { type: String },
    time: { type: Date },
    tag: { type: String },
    content: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", Notification);
