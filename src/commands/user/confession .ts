import { MessageEmbed, TextChannel } from "discord.js";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
import { ServerInfoModel } from "../../model/ServerInfo";

export default {
  name: "confession",
  description: "Confession",
  category: "user",
  aliases: ["confession"],
  usage: "confession <confession>",
  permission: [],
  run: async (client, message, args) => {
    try {
      if (!message.guild) return;
      let confessionChannel = (
        await ServerInfoModel.findOne({
          ServerId: message.guild.id,
        })
      )?.confessionChannel;
      if (!confessionChannel) {
        message.reply("không có confession channel nào ");
        return;
      }

      if (!args[0]) {
        message.channel.send("Bạn chưa nhập confession");
        return;
      }
      const confession = args.join(" ");
      const embed = new MessageEmbed()
        .setTitle("Confession")
        .setDescription(confession)
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter("được gửi từ người ẩn danh");
      const channel = client.channels.cache.get(
        confessionChannel.ChannelId
      ) as TextChannel;
      if (!channel) {
        message.reply("không tìm thấy kênh confession");
        return;
      }
      channel.sendTyping();
      channel.send({ embeds: [embed] });
      // message.channel => channel
      if (message.deletable) message.delete(); // message.channel is a channel
    } catch (error) {
      console.log(error);
      message.channel.send(`bot xảy ra lỗi vui lòng thử lại sau`);
    }
  },
} as IMessageCommandHandlers;
