import { Message, TextChannel } from "discord.js";
import { IClient } from "./../types/index";
import { ServerInfoModel } from "../model/ServerInfo";
const checkUserSpam = async (message: Message, client: IClient) => {
  const spamChannel = (
    await ServerInfoModel.findOne({
      ServerId: message.guild?.id,
    })
  )?.SpamChannel;
  if (spamChannel) {
    if (message.channelId !== spamChannel?.ChannelId) {
      const messages = await message.channel.messages.fetch({ limit: 10 });
      const AllMessage = messages
        .map((m) => m)
        .filter((m) => m.author.bot !== true)
        .slice(1);
      let mustDelete = false;
      AllMessage.map((m) => {
        if (
          m.content === message.content &&
          m.author.id === message.author.id
        ) {
          mustDelete = true;
        }
      });
      //   message.author.send(
      //     message.author.tag +
      //       " Bạn đã 1 nhắn tin lặp lại rồi tin bạn nhắn có nội dung như này : " +
      //       message.content
      //   );
      if (spamChannel.turnOnBotSendMessageToSpamChannel) {
        (
          client.channels.cache.get(
            spamChannel.LogChannelId || spamChannel.ChannelId
          ) as TextChannel
        ).send(
          `${message.author} đã gửi một tin nhắn bị trùng với nội dung là : ${message.content}, tại kênh ${message.channel} :)`
        );
      }
      if (mustDelete) {
        if (message.deletable) message.delete();
        return;
      }
    }
  }
};
export default checkUserSpam;
