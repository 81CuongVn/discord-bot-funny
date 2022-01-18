import axios from "axios";
import { Message } from "discord.js";
import { IClient } from "src/types";
import checkUserSpam from "../../utils/CheckSpamMessage";
import { BotChatChannelModel } from "../../model/BotChatChannelModel";

export const MessageCreateHandler = async (
  message: Message,
  client: IClient
) => {
  try {
    if (message.author.bot) return;
    // get guild id
    const guildId = message.guild?.id;

    const botChatChannel = await BotChatChannelModel.findOne({
      serverId: guildId,
    });
    try {
      if (botChatChannel?.channelId !== message.channel.id) {
        await checkUserSpam(message, client);
      }
    } catch (error) {
      console.log(error);
    }
    const prefix = client.prefix || "!";
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(" ");
      const cmd = args.shift()?.toLocaleLowerCase();
      if (!cmd) return;
      if (cmd?.length === 0) return;
      let command = client.commands?.get(cmd);
      if (!command) {
        const aliases = client.aliases?.get(cmd);
        if (!aliases) return;
        command = client.commands?.get(aliases);
      }
      if (command) {
        command.run(client, message, args);
        return;
      }
    }
    const channelId = message.channel.id;
    if (!botChatChannel) {
      return;
    }
    // get this channel id
    if (channelId === botChatChannel?.channelId) {
      const messagesContent = message.content;
      const apiUrl = encodeURI(
        `http://api.brainshop.ai/get?bid=162827&key=${process.env.chatBotApiKey}&uid=${message.author.id}&msg=${messagesContent}`
      );
      const response = await axios.get(apiUrl);
      const data = response.data;
      const reply:string = data.cnt;
      if (!data.cnt || reply.trim().length === 0) {
        return;
      }
      
      message.reply(data.cnt);
    }
  } catch (e) {
    console.log(e);
    message.reply(
      "bot có một chút lỗi vui lòng thử lại sau lại sau nếu vẫn còn lỗi thì liên hệ với ngủ"
    );
  }
};
