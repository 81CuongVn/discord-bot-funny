import { BotInfoModel } from "src/model/BotInfo";
import ConnectToDb from "../utils/connectDB";
import { IClient } from "./../types/index";

const onClientReady = async (client: IClient) => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }
  await ConnectToDb(databaseUrl);
  console.log(`Logged in as ${client.user?.tag}!`);

  let lastStatus = 0;
  client.guilds.cache.map(async (guild) => {
    const guildId = guild.id;
    if (!guildId) return;
    if (guildId) {
      if (client.slashCommandObject) {
        await client.guilds.cache
          .get(guildId)
          ?.commands.set(client.slashCommandObject);
      }
    }
  });
  setInterval(async () => {
    let status = "";
    if (lastStatus === 0) {
      status = `${client.prefix}help | ${client.guilds.cache.size} servers`;
    } else {
      const memberCount = client.guilds.cache.reduce((acc, guild) => {
        return acc + guild.memberCount;
      }, 0);
      status = `invite me | watching ${memberCount} users`;
    }
    client.user?.setPresence({
      status: "online",
      afk: true,
      activities: [
        {
          name: status,
          type: "WATCHING",
          url: "https://discord.com/api/oauth2/authorize?client_id=890871180268023829&permissions=8&scope=bot",
        },
      ],
    });
    if (lastStatus >= 1) {
      lastStatus = 0;
    } else {
      lastStatus++;
    }
  }, 5000);
  const botInfo = await BotInfoModel.findOne({});
  if (!botInfo) {
    const botInfoModel = new BotInfoModel({
      username: client.user?.username,
      owner: client.UserCreatBotId,
      historyBotUpAndDown: [],
    });
    await botInfoModel.save();
  }

};
export default onClientReady;
