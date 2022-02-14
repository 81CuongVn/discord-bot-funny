import { VoteModel } from "../../model/VoteModel";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
import { MessageEmbed } from "discord.js";
const supportCommand = ["vote"];
export default {
  name: "charts".toLowerCase(),
  category: "user",
  aliases: ["charts"],
  description: `bảng xếp hạng ${supportCommand.join(", ")}`,
  usage: `< ${supportCommand.join(", ")} >`,
  permission: [],
  run: async (client, message, args) => {
    if (!message.guild) return;
    if (!args[0]) {
      message.reply("bạn chưa nhập thông tin");
      return;
    }
    if (!supportCommand.includes(args[0].toLowerCase())) {
      message.reply("không tìm thấy hành động");
      return;
    }
    if (args[0].toLowerCase() === supportCommand[0]) {
      const allServerVote = await VoteModel.find({
        ServerID: message.guild.id,
      });
      const VoteUser: {
        [key: string]: {
          voteNumber: number;
          UpVote: number;
          DownVote: number;
        };
      } = {};
      for (const vote of allServerVote) {
        if (!VoteUser[vote.UserId]) {
          VoteUser[vote.UserId] = {
            voteNumber: vote.VoteNumber,
            UpVote: vote.VoteNumber > 0 ? 1 : 0,
            DownVote: vote.VoteNumber < 0 ? 1 : 0,
          };
          continue;
        }
        if (vote.VoteData.VoteValue === 1) {
          VoteUser[vote.UserId].UpVote += 1;
        } else {
          VoteUser[vote.UserId].DownVote += 1;
        }
      }
      const sortVoteUser = Object.keys(VoteUser)
        .map((key) => {
          return VoteUser[key];
        })
        .sort((a, b) => {
          return b.voteNumber - a.voteNumber;
        });
      let description = "";
      let index = 0;
      for (const vote of sortVoteUser) {
        description +=
          `${index} . <@` +
          allServerVote[index].UserId +
          `> ${vote.voteNumber} - ${vote.UpVote} - ${vote.DownVote}\n`;
        index = index + 1;
      }
      const embed = new MessageEmbed()
        .setTitle("Bảng xếp hạng")
        .setColor("#0099ff")
        .setDescription(description)
        .setFooter(`${message.author.username}`)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    }
  },
} as IMessageCommandHandlers;
