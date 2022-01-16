import { Constants, MessageEmbed } from "discord.js";
import { ISlashCommandHandlers } from "src/types/slashCommand";

const pingHandler: ISlashCommandHandlers = {
  name: "ping".toLocaleLowerCase(),
  description: "bot ping to you",
  usage: "ping",
  aliases: ["p"],
  options: [],
  run: async (client, interaction, args) => {
      try {
          await interaction.reply({
              content: `pong ! ${client.ws.ping}ms`,
              ephemeral: true,
            });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "server have some error try again later",
      });
    }
  },
};
export default pingHandler;
