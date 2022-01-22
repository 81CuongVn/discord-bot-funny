import { Collection, GuildTextBasedChannel, TextChannel } from "discord.js";
import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path from "path";
import { IClient } from "./types";
import interactionCreate from "./event/interaction/interactionCreate";
import onClientReady from "./event/ready";
import { MessageCreateHandler } from "./event/message/messageCreate";

import { Player } from "discord-player";
import { DisTube, Song } from "distube";
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
  const player = new DisTube(client, {});
  player.on("addSong", (queue, song) => {
    queue.textChannel?.send(
      `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`
    );
  });
  player.on("playSong", (queue, song) => {
    queue.textChannel?.send(
      `Now playing ${song.name} - \`${song.formattedDuration}\` by ${song.user}.`
    );
  });
  player.on("finish", async (queue) => {
    if (queue.textChannel) {
      // delete bot Message
      const botMessage = await queue.textChannel.messages.fetch({
        limit: 100,
      });
      if (botMessage.size > 0) {
        botMessage.map((m) => {
          if (m.author.bot && m.author.id === client.user?.id) {
            m.delete();
          }
        });
      }
    }
    queue.textChannel?.send("The queue has finished.");
    queue.stop();
  });
  client.disTube = player;

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
