import mongoose from "mongoose";
export default async function ConnectToDb(url: string) {
  try {
    await mongoose.connect(url, {});
    // await mongoose.connection.on("connected", () => {
    //   console.log("Connected to DB");
    // });
    console.log("Connected to DB");
  } catch (e) {
    console.log(e);
  }
}
