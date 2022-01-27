import axios from "axios";
import { Message } from "discord.js";
import { IClient } from "../../types";
import checkUserSpam from "../../utils/CheckSpamMessage";
import { BotChatChannelModel } from "../../model/BotChatChannelModel";
import xpMessage from "../../utils/rankMessage";
import { BotInfoModel } from "../../model/BotInfo";

export const MessageCreateHandler = async (
  message: Message,
  client: IClient
) => {
  try {
    if (message.author.bot) return;
    if (message.channel.type === "DM") {
      console.log("DM", message);
      message.channel.send("Bạn không thể gửi tin nhắn trong DM");
      return;
    }

    // get guild id
    const guildId = message.guild?.id;

    const botChatChannel = await BotChatChannelModel.findOne({
      serverId: guildId,
    });
    const botInfo = await BotInfoModel.findOne({});
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
        message.channel.sendTyping();
        if ("stopBot".toLocaleLowerCase() !== command.name) {
          if (botInfo) {
            let historyBotUpAndDown = botInfo.historyBotUpAndDown;
            if (historyBotUpAndDown) {
              const lastHistory =
                historyBotUpAndDown[historyBotUpAndDown.length - 1];
              if (lastHistory) {
                if (lastHistory.down) {
                  message.reply(
                    `Bot đang down vì lý do ${lastHistory.reason} thật lòng xin lỗi `
                  );
                  return;
                }
              }
            }
          }
        }
        if (command.permission) {
          for (const permission of command.permission) {
            if (!message.member?.permissions.has(permission)) {
              message.channel.send(
                `Bạn không có quyền để sử dụng lệnh ${command.name}`
              );
              return;
            }
          }
        }
        command.run(client, message, args);
        return;
      }
    } else {
      try {
        if (botChatChannel?.channelId !== message.channel.id) {
          await checkUserSpam(message, client);
        }
      } catch (error) {
        console.log(error);
      }
    }

    await xpMessage(message, client);

    const channelId = message.channel.id;
    if (botChatChannel) {
      if (channelId === botChatChannel?.channelId) {
        message.channel.sendTyping();
        if (botInfo) {
          let historyBotUpAndDown = botInfo.historyBotUpAndDown;
          if (historyBotUpAndDown) {
            const lastHistory =
              historyBotUpAndDown[historyBotUpAndDown.length - 1];
            if (lastHistory) {
              if (lastHistory.down) {
                message.reply(
                  `Bot đang down vì lý do ${lastHistory.reason} thật lòng xin lỗi `
                );
                return;
              }
            }
          }
        }
        const messagesContent = message.content;
        const apiUrl = encodeURI(
          `http://api.brainshop.ai/get?bid=162827&key=${process.env.chatBotApiKey}&uid=${message.author.id}&msg=${messagesContent}`
        );
        const response = await axios.get(apiUrl, {
          timeout: 10000,
        });
        const data = response.data;
        const reply: string = data.cnt;
        console.log(data);
        if (!data.cnt || reply.trim().length === 0) {
          await message.reply("Xin lỗi, tôi không hiểu ý bạn");
          return;
        }
        message.reply(data.cnt);
      }
    }
    // get this channel id
  } catch (e) {
    console.log(e);
    message.reply(
      "bot có một chút lỗi vui lòng thử lại sau lại sau nếu vẫn còn lỗi thì liên hệ với ngủ"
    );
  }
};
