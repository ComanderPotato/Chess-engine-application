import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const connect_db = async () => {
  try {
    if (!MONGO_URI) throw new Error("Invalid URI");
    console.log(MONGO_URI);
    const conn = await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting to MONGODB: " + error.message);
      process.exit(1); // 1 means there was an error, 0 means success
    }
  }
};
export default connect_db;
