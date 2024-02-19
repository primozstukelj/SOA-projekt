import mongoose from "mongoose";

export interface LogDoc extends mongoose.Document {
  timestamp: Date;
  message: string;
}

interface LogModel extends mongoose.Model<LogDoc> {}

const logSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
    },
    message: { type: String },
  },
  { collection: "log" }
);

const Log = mongoose.model<LogDoc, LogModel>("Log", logSchema);

export { Log };
