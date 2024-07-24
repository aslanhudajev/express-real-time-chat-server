import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Request = new Schema({
  sender: mongoose.Types.ObjectId,
  receiver: mongoose.Types.ObjectId,
});

export default mongoose.model("request", Request);
