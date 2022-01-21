import { MessageEmbed } from "discord.js";
import { IMessageCommandHandlers } from "../../types/MessageCommand";

export default {
  name: "code".toLocaleLowerCase(),
  category: "authorMakeBot",
  aliases: ["code"],
  description: "code",
  usage: "code <code>",
  run: async (client, message, args) => {
    try {
      if (!client.UserCreatBotId) {
        message.channel.send("bot chưa được thêm người tạo");
        return;
      }
      if (client.UserCreatBotId !== message.author.id) {
        message.channel.send("bạn không có quyền sử dụng tính năng này");
        return;
      }
      if (!args[0]) {
        message.channel.send("Bạn chưa nhập code");
        return;
      }
      const code = args.join(" ").replace(/```/g, " ");
      const result = eval(code);
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("code")
        .setTimestamp()
        .setFooter("code");
      // embed description must have the code snippet result and type in it
      embed.setDescription(
        ` code ban đầu \`\`\`js\n${code}\n\`\`\` \n kết quả \n\`\`\`js\n${result}\n\`\`\` \n dạng của kết quả  \n \`\`\`js\n${typeof result}\n\`\`\``
      );
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.channel.send(`bot xảy ra lỗi vui lòng thử lại sau`);
    }
  },
} as IMessageCommandHandlers;
