import { Constants } from "discord.js";
import { SpamChannelModel } from "../../model/SpamChannel";
import { ISlashCommandHandlers } from "../../types/slashCommand";
const ConfigBotSendMessageToSpamChannel: ISlashCommandHandlers = {
  name: "configBotSendMessage".toLocaleLowerCase(),
  description: "config bot send message to spam channel",
  usage: "configBotSendMessageToSpamChannel",
  aliases: ["p"],
  options: [
    {
      name: "action",
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
      description: "action want to do",
      options: [
        {
          name: "on",
          type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
          description:
            "if turn on when user send spam message , bot will send message to spam channel",
        },
        {
          name: "off",
          type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
          description:
            "if turn off when user send spam message , bot will not send message to spam channel",
        },
      ],
    },
  ],
  run: async (client, interaction, args) => {
    try {
      if (!interaction.guild?.me?.permissions.has("MANAGE_MESSAGES")) {
        interaction.reply({
          content: "bạn không có quyền dùng lệnh này",
          ephemeral: true,
        });
        return;
      }

      const action = args.getSubcommand();
      // get server id
      const serverId = interaction.guild?.id;
      if (action === "on") {
        await SpamChannelModel.findOneAndUpdate(
          { serverId },
          { turnOnBotSendMessageToSpamChannel: true }
        );
        interaction.reply({
          content: "bot will send message to spam channel",
          ephemeral: true,
        });
      } else if (action === "off") {
        await SpamChannelModel.findOneAndUpdate(
          { serverId },
          { turnOnBotSendMessageToSpamChannel: false }
        );
        interaction.reply({
          content: "bot will not send message to spam channel",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "server have some error try again later",
        ephemeral: true,
      });
    }
  },
};
export default ConfigBotSendMessageToSpamChannel;
