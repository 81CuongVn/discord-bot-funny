import { IMessageCommandHandlers } from "../../types/MessageCommand";
import { Client, Message, MessageEmbed } from "discord.js";

const AvatarController: IMessageCommandHandlers = {
  name: "avatar",
  category: "user",
  aliases: ["ava"],
  description: "Hiển thị avatar của bạn hoặc người khác",
  usage: "avatar [@user]",
  permission: [],
  run: async (client: Client<boolean>, message: Message, args: string[]) => {
    try {
      const member =
        message.mentions.members?.first() ||
        message.guild?.members.cache.get(args[0]) ||
        message.member;
      const url = member?.user.displayAvatarURL();
      if (!url) return;
      const avatarEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setImage(url)
        .setURL(url)
        .setTitle(
          `${url ? "Download image here" : "you don't have the avatar"}`
        );
      message.channel.send({ embeds: [avatarEmbed] });
    } catch (error) {
      console.log(error);
      message.channel.send("server have some error try again later");
    }
  },
};
export default AvatarController;
