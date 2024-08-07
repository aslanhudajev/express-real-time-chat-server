import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Request = new Schema({
  sender: { type: mongoose.Types.ObjectId, ref: "user" },
  receiver: { type: mongoose.Types.ObjectId, ref: "user" },
});

export default mongoose.model("request", Request);
