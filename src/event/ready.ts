import ConnectToDb from "../utils/connectDB";
import { IClient } from './../types/index';

const onClientReady = async(client: IClient) => {
    const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }
  await ConnectToDb(databaseUrl);
  console.log(`Logged in as ${client.user?.tag}!`);

  client.user?.setPresence({
    status: "online",
    afk: false,
    activities: [
      {
        name: "bot chán đời đập đầu vào tường",
        type: "COMPETING",
        url: "https://discord.com/api/oauth2/authorize?client_id=890871180268023829&permissions=8&scope=bot",
      },
    ],
  });
};
export default onClientReady;