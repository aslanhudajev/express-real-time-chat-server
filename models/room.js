import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Room = new Schema({
  members: [mongoose.Types.ObjectId],
});

export default mongoose.model("room", Room);
