import { IMessageCommandHandlers } from "./../../types/MessageCommand";
export default {
  name: "testUserJoinServer".toLocaleLowerCase(),
  description: "testUserJoinServer",
  category: "authorMakeBot",
  aliases: ["testUserJoinServer"],
  usage: "testUserJoinServer",
  permission: [],
  run: async (client, message, args) => {
      try {
          if (message.author.id !== client.UserCreatBotId) {
              message.channel.send("Bạn không có quyền sử dụng lệnh này");
              return;
            }
      const member =
        message.mentions.members?.first() ||
        message.guild?.members.cache.get(args[0]) ||
        message.member;
      if (!member) return;
      message.channel.send(`${member.user.tag} join the server`);
      client.emit("guildMemberAdd", member);
      return;
    } catch (error) {
      console.log(error);
      message.channel.send(`bot xảy ra lỗi vui lòng thử lại sau`);
    }
  },
} as IMessageCommandHandlers;
