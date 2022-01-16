import { Constants, MessageEmbed } from "discord.js";
import { ISlashCommandHandlers } from "src/types/slashCommand";

const HelloHandler: ISlashCommandHandlers = {
  name: "Hello".toLocaleLowerCase(),
  description: "bot Hello to you",
  usage: "Hello",
  aliases: ["p"],
  options: [],
  run: async (client, interaction, args) => {
    try {
      const user = interaction.user.displayAvatarURL()
      console.log(user);
      await interaction.reply({ content: "Hello" });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "server have some error try again later",
      });
    }
  },
};
export default HelloHandler;
