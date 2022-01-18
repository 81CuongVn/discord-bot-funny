import ConnectToDb from "../utils/connectDB";
import { IClient } from './../types/index';

const onClientReady = async(client: IClient) => {
    const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }
  await ConnectToDb(databaseUrl);
  console.log(`Logged in as ${client.user?.tag}!`);
  let servers = await client.guilds.cache.size
  let serverCount = await client.guilds.cache.reduce((acc, guild) => {
    return acc + guild.memberCount;
  }, 0);
  const activity = [
    `${client.prefix}help | ${servers} servers`,
    `invite me | watching ${serverCount} users`,
  ]
  let lastStatus = 0;
  client.guilds.cache.map(async(guild) => {
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
  setInterval(() => {

    const status = activity[Math.floor(lastStatus)];
    client.user?.setPresence({
      status: "online",
      afk: false,
      activities: [
        {
          name: status,
          type: "WATCHING",
          url: "https://discord.com/api/oauth2/authorize?client_id=890871180268023829&permissions=8&scope=bot",
        },
      ],
    });
    if (lastStatus >= activity.length - 1) {
      lastStatus = 0;
    } else {
      lastStatus++;
    }
  }, 5000);
};
export default onClientReady;