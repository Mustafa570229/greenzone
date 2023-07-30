import mongoose from "mongoose";

export default async function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  } else {
    const uri = process.env.MONGODB_URI;
    return await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}
