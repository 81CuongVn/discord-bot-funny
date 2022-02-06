import { Collection, MessageEmbed } from "discord.js";
import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path from "path";
import { IClient } from "./types";
import interactionCreate from "./event/interaction/interactionCreate";
import onClientReady from "./event/ready";
import { MessageCreateHandler } from "./event/message/messageCreate";

import { DisTube, Song } from "distube";
import { HelloChannelModel } from "./model/HelloChannel";
import { getMessageButtonForMusic } from "./utils/MessageButtonForMusic";
import { ButtonId } from "./types/ButtonId";
import { kelpBotIsRunning } from "./kelpBotIsRunning";

dotenv.config({ path: path.join(__dirname, "./.env") });
const client: IClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const player = new DisTube(client, {});
// player.on("addSong", (queue, song) => {
//   queue.textChannel?.send(
//     `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`
//   );
// });
player.on("playSong", (queue, song) => {
  let username: undefined | string = undefined;
  // check song.metadata.user have the user and you can get the username
  const metadata: any = song.metadata;
  if (metadata.user) {
    username = metadata.user;
  }
  if (queue.textChannel) {
    const embed = new MessageEmbed()
      .setTitle(song.name || "")
      .setURL(song.url)
      .setDescription(
        `đang chơi nhạc : ${song.name} của : ${song.source} ${
          username ? `, được yêu cầu bởi <@${username}>` : ""
        } , với thời lượng là ${song.formattedDuration} với tổng thời gian là ${
          song.duration
        }ms`
      )
      .setFooter(
        `bot được làm ra bởi ngủ ${
          username ? `, được yêu cầu bởi <@${username}>` : ""
        } `
      )
      .setTimestamp();
    if (song.thumbnail) {
      embed.setThumbnail(song.thumbnail);
      embed.setImage(song.thumbnail);
    }
    const row = getMessageButtonForMusic(queue);
    queue.textChannel
      .send({
        embeds: [embed],
        components: row,
      })
      .then((message) => {
        metadata.messageId = message.id;
      });
  }
});

player.on("finishSong", (queue, song) => {
  const metadata: any = song.metadata;
  if (metadata.messageId) {
    queue.textChannel?.messages.fetch(metadata.messageId).then((msg) => {
      if (msg) {
        if (msg.deletable) msg.delete();
      }
    });
  }
});

player.on("error", (queue, error) => {
  queue.send(`Error: ${error.message}`);
});

client.disTube = player;

client.slashCommand = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = readdirSync(path.join(__dirname, "./commands/"));
client.prefix = process.env.PREFIX || ",";
client.UserCreatBotId = "889140130105929769";
readdirSync(path.join(__dirname, "./handlers/")).forEach((han) => {
  const commands = path.join(__dirname, "./handlers/", `./${han}`);
  const handlers = require(commands).default;
  handlers(client);
});
client.on("guildCreate", async (guild) => {
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

client.on("guildMemberAdd", async (member) => {
  const WelcomeChannelId = await HelloChannelModel.findOne({
    serverId: member.guild.id,
  });
  if (WelcomeChannelId) {
    const WelcomeChannel = member.guild.channels.cache.get(
      WelcomeChannelId.channelId
    );
    console.log(WelcomeChannelId, WelcomeChannel);
    if (WelcomeChannel && WelcomeChannel.type === "GUILD_TEXT") {
      (await WelcomeChannel.send(`Welcome to the server, ${member}`)).react(
        "🎉"
      );
    }
    if (
      WelcomeChannelId.roleId &&
      member.guild.roles.cache.get(WelcomeChannelId.roleId)
    ) {
      member.roles.add(WelcomeChannelId.roleId);
    }
  }
});

client.on("guildMemberRemove", async (member) => {
  const WelcomeChannelId = await HelloChannelModel.findOne({
    serverId: member.guild.id,
  });
  if (WelcomeChannelId) {
    const WelcomeChannel = member.guild.channels.cache.get(
      WelcomeChannelId.channelId
    );
    if (WelcomeChannel && WelcomeChannel.type === "GUILD_TEXT") {
      WelcomeChannel.send(`Goodbye ${member}`);
    }
  }
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
kelpBotIsRunning();
client.login(token);
