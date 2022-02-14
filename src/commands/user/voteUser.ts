import { VoteModel } from "../../model/VoteModel";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
export default {
  name: "voteUser".toLowerCase(),
  category: "user",
  aliases: ["voteu"],
  description: "vote cho người khác",
  usage: `voteUser <vote hoặc là unvote hoặc là deleteVote> <@user>`,
  permission: [],
  run: async (client, message, args) => {
    if (!message.guild) return;
    if (!args[0] || !args[1]) {
      message.reply("bạn chưa nhập thông tin");
      return;
    }

    const member =
      message.mentions.members?.first() ||
      message.guild?.members.cache.get(args[1]);
    const memberId = member?.id;
    if (!member) {
      message.reply("không tìm thấy người này");
      return;
    }
    if (args[0].toLowerCase() === "deleteVote".toLowerCase()) {
      const votes = await VoteModel.find({
        UserId: memberId,
        ServerId: message.guild?.id,
      });
      const vote = votes.map((v) =>
        v.VoteData.UserVote === message.author.id ? v : null
      )[0];
      if (!vote) {
        message.channel.send("Bạn chưa có vote nào");
        return;
      }
      message.channel.send("Vote đã bị xóa");
      await VoteModel.findOneAndDelete({
        _id: vote._id,
      });
      return;
    }
    if (message.author.id === memberId) {
      message.reply("không thể vote cho chính mình");
      return;
    }
    let voteValue;
    if (args[0] === "vote") {
      voteValue = 1;
    } else if (args[0] === "unvote") {
      voteValue = -1;
    } else {
      message.reply("không tìm thấy vote hoặc unvote");
      return;
    }
    const votes = await VoteModel.find({
      UserId: memberId,
      ServerId: message.guild?.id,
    });
    const vote = votes.map((v) =>
      v.VoteData.UserVote === message.author.id ? v : null
    )[0];
    console.log(vote);
    if (vote) {
      if (vote.VoteData.VoteValue !== voteValue) {
        await VoteModel.findOneAndUpdate(
          {
            UserId: memberId,
            ServerId: message.guild?.id,
            VoteData: {
              UserVote: message.author.id,
            },
          },
          {
            $set: {
              VoteData: {
                UserVote: message.author.id,
                VoteValue: voteValue,
              },
            },
          }
        );
        message.reply(`vote thành công`);
      } else {
        message.reply("Bạn đã vote cho người này");
        return;
      }
    }
    if (!vote) {
      const newVote = new VoteModel({
        UserId: memberId,
        ServerId: message.guild?.id,
        VoteNumber: voteValue,
        VoteData: {
          UserVote: message.author.id,
          VoteValue: voteValue,
        },
      });
      await newVote.save();
      message.reply(`vote thành công`);
      return;
    }
    return;
  },
} as IMessageCommandHandlers;
