import { Collection, TextChannel } from "discord.js";
import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path from "path";
import { IClient } from "./types";
import interactionCreate from "./event/interaction/interactionCreate";
import onClientReady from "./event/ready";
import { MessageCreateHandler } from "./event/message/messageCreate";

import { Player } from "discord-player";
export const bot = () => {
  dotenv.config({ path: path.join(__dirname, "./.env") });
  const client: IClient = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
  });
  const player = new Player(client);
  player.on("trackStart", (queue: any, track) => {
    //queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
    const channel = queue.metadata.channel as TextChannel;
    channel.send(
      `🎶 | Now playing **${track.title}**! với thời lượng ${track.duration}`
    );
  });
  player.on("trackEnd", async (queue: any, track) => {
    // //queue.metadata.channel.send(`🎶 | **${track.title}** has ended!`)
    // const channel = queue.metadata.channel as TextChannel;
    // channel.send(`🎶 | **${track.title}** has ended!`);
    // const fetched = await channel.messages.fetch({
    //   limit: 100,
    // });
    // let messageNumber = 0;
    // fetched.map((msg, index) => {
    //   messageNumber = messageNumber + 1;
    //   if (msg.author.id === client.user?.id) {
    //     if (msg.deletable) msg.delete();
    //   }
    // });
  });
  player.on("queueEnd", async (queue: any) => {
    // //queue.metadata.channel.send(`🎶 | Queue has ended!`)
    const channel = queue.metadata.channel as TextChannel;
    channel.send(`🎶 | Queue has ended!`);
    const fetched = await channel.messages.fetch({
      limit: 100,
    });
    let messageNumber = 0;
    fetched.map((msg, index) => {
      messageNumber = messageNumber + 1;
      if (msg.author.id === client.user?.id) {
        if (msg.deletable) msg.delete();
      }
    });
    // channel.send(`🎶 | Queue has ended!`);
  });
  player.on("error", (queue: any, error) => {
    //queue.metadata.channel.send(`🎶 | An error occurred: ${error.message}`)
    const channel = queue.metadata.channel as TextChannel;
    channel.send(`🎶 | An error occurred: ${error.message}`);
  });
  player.on("tracksAdd", (queue: any, tracks: any) => {
    //queue.metadata.channel.send(`🎶 | Added ${tracks.length} tracks to the queue!`)
    const channel = queue.metadata.channel as TextChannel;
    channel.send(`🎶 | Added ${tracks.length} tracks to the queue!`);
  });
  player.on("channelEmpty", (queue: any) => {
    // //queue.metadata.channel.send(`🎶 | The channel is empty!`)
    // const channel = queue.metadata.channel as TextChannel;
    // channel.send(`🎶 | The channel is empty! làm cho bot cảm thấy cô đơn :)`);
  });
  player.on("connectionError", (queue: any, error) => {
    //queue.metadata.channel.send(`🎶 | An error occurred: ${error.message}`)
    console.log(error);
  });
  client.player = player;
  client.slashCommand = new Collection();
  client.commands = new Collection();
  client.aliases = new Collection();
  client.categories = readdirSync(path.join(__dirname, "./commands/"));
  client.prefix = process.env.PREFIX || ",";
  client.UserCreatBotId = "889140130105929769";
  client.buttonCommand = new Collection();
  readdirSync(path.join(__dirname, "./handlers/")).forEach((han) => {
    const commands = path.join(__dirname, "./handlers/", `./${han}`);
    const handlers = require(commands).default;
    handlers(client);
  });

  client.on("ready", async () => {
    await onClientReady(client);
  });
  client.on("messageCreate", async (message) => {
    await MessageCreateHandler(message, client);
  });
  client.on("interactionCreate", async (interaction) => {
    await interactionCreate(interaction, client);
  });

  const token = process.env.BOT_KEY;
  client.login(token);
};
