import { IMessageCommandHandlers } from "../../types/MessageCommand";
import { Client, Message, MessageEmbed } from "discord.js";
const HelloController: IMessageCommandHandlers = {
  name: "hello",
  category: "user",
  aliases: ["he"],
  description: "chào bạn",
  usage: "hello",
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
        .setURL(url);
      message.channel.send({ embeds: [avatarEmbed] });
      message.channel.send(`hello ${message.author} you have the good day!`);
    } catch (error) {
      console.log(error);
      message.channel.send("server have some error try again later");
    }
  },
};
export default HelloController;
