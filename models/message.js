import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Message = new Schema({
  user: Schema.Types.ObjectId,
  content: String,
  room: Schema.Types.ObjectId,
  date: new Date(),
});

export default mongoose.model("message", Message);
