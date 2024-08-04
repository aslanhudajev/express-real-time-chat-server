import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Message = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  content: String,
  room: Schema.Types.ObjectId,
  date: Date,
});

export default mongoose.model("message", Message);
