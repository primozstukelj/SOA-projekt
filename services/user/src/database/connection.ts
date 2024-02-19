import config from "../config";
import mongoose from "mongoose";

const connect = async () => {
  console.log("Connecting to DB");
  const dbURI = config.DB;
  if (!dbURI || dbURI.length < 1) {
    console.log("No database URI found");
    return;
  }
  // Handle database connection here
  mongoose
    .connect(dbURI)
    .then(() => console.log(`DB connected`))
    .catch((error) => console.log(`Connection to db failed because ${error}`));
};

export default connect;
