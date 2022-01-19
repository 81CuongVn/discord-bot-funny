import { MessageEmbed, TextChannel } from "discord.js";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
import { confessionChannelModel } from "./../../model/confessionChannelModel";

export default {
  name: "confession",
  description: "Confession",
  category: "user",
  aliases: ["confession"],
  usage: "confession <confession>",
  run: async (client, message, args) => {
    if (!message.guild) return;
    const confessionChannel = await confessionChannelModel.findOne({
      guildId: message.guild?.id,
    });
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
      .setFooter(message.author.username, message.author.displayAvatarURL());
    const channel = client.channels.cache.get(
      confessionChannel.channelId
    ) as TextChannel;
    if (!channel) {
      message.reply("không tìm thấy kênh confession");
      return;
    }
    channel.send({ embeds: [embed] });
    if (message.deletable) message.delete();
  },
} as IMessageCommandHandlers;
