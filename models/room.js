import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Room = new Schema({
  members: [{ type: mongoose.Types.ObjectId, ref: "user" }],
});

Room.virtual("url").get(function () {
  return `/room/${this._id}`;
});

export default mongoose.model("room", Room);
