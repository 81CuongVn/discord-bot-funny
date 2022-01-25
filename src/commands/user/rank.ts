import { xpUserModel } from "../../model/RankUser";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
import { xpForOneRank, xpForOneLevel } from "./../../constant";
import { MessageEmbed } from "discord.js";
export default {
  name: "rank",
  category: "user",
  aliases: ["level", "r"],
  description: "Xem thông tin rank của bạn hoặc là người khác",
  usage: "rank [@user]",
  permission: [],
  run: async (client, message, args) => {
    const embed = new MessageEmbed()
      .setTimestamp()
      .setFooter(`được yêu cầu bởi ${message.author.tag}`);
    const member =
      message.mentions.members?.first() ||
      message.guild?.members.cache.get(args[0]) ||
      message.member;
    const memberId = member?.id;
    const UserRank = await xpUserModel.findOne({
      userId: memberId,
      serverId: message.guild?.id,
    });
    embed.setTitle(`Rank của ${member?.user.tag}`);
    embed.setDescription(`
        lưu ý rank được tính từ lúc bot vào server và không tính lúc bot offline vì update
      `);
    if (!UserRank) {
      const newUserRank = new xpUserModel({
        userId: memberId,
        xpMessage: 0,
        xpAnswer: 0,
        serverId: message.guild?.id,
      });
      newUserRank.save();
      embed.addField("Rank", `0`, true);
      embed.addField("Level", `0`, true);
      embed.addField("Xp", `0`, true);
      embed.setColor("RANDOM");
    } else {
      const level = Math.floor(UserRank.xpMessage / xpForOneLevel);
      const rank = Math.floor(UserRank.xpMessage / xpForOneRank);
      embed.addField("Rank", `${rank}`, true);
      embed.addField("Level", `${level}`, true);
      embed.addField("XP", `${UserRank.xpMessage}`, true);
      embed.setColor("RANDOM");
    }
    message.channel.send({ embeds: [embed] }); 
  },
} as IMessageCommandHandlers;
