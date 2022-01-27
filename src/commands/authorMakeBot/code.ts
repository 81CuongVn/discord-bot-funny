import { MessageEmbed } from "discord.js";
import { IMessageCommandHandlers } from "../../types/MessageCommand";
import { BotInfoModel } from "src/model/BotInfo";

export default {
  name: "code".toLocaleLowerCase(),
  category: "authorMakeBot",
  aliases: ["code"],
  description: "code",
  usage: "code <code>",
  permission: [],
  run: async (client, message, args) => {
    try {
      const botInfo = await BotInfoModel.findOne({});
      if (!client.UserCreatBotId || !botInfo) {
        message.channel.send("bot chưa được thêm người tạo");
        return;
      }
      if (client.UserCreatBotId !== message.author.id || message.author.id !== botInfo.owner) {
        message.channel.send("bạn không có quyền sử dụng tính năng này");
        return;
      }
      if (!args[0]) {
        message.channel.send("Bạn chưa nhập code");
        return;
      }
      const code = args.join(" ").replace(/```/g, " ");
      const result = await eval(code);
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
      message.channel.send(`code có lỗi ${error}`);
    }
  },
} as IMessageCommandHandlers;
