import mongoose, { ConnectOptions } from "mongoose";

const connectToMongoDB = async (): Promise<void> => {
  try {
    const mongo_uri = process.env.MONGO_DB_CONNECT_URI;
    if (!mongo_uri) return;
    await mongoose.connect(mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Mongo_DB connected successfully");
  } catch (error) {
    console.log("Error Connecting to Mongo_DB", error);
    return;
  }
};

export default connectToMongoDB;
