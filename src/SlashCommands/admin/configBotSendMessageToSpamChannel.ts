import { Constants } from "discord.js";
import { ISlashCommandHandlers } from "../../types/slashCommand";
import { ServerInfoModel } from "../../model/ServerInfo";
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
          options: [
            {
              name: "Channel".toLocaleLowerCase(),
              type: Constants.ApplicationCommandOptionTypes.CHANNEL,
              description:
                "nếu chọn log channel sẽ gửi log ra các tin nhắn spam",
              required: false,
            },
          ],
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
      if (
        !interaction.guild?.members?.guild.me?.permissions.has(
          "MANAGE_MESSAGES"
        )
      ) {
        interaction.reply({
          content: "bạn không có quyền dùng lệnh này",
          ephemeral: true,
        });
        return;
      }

      const action = args.getSubcommand();
      // get server id
      const serverId = interaction.guild?.id;
      const ServerInfoData = await ServerInfoModel.findOne({
        ServerId: serverId,
      });
      if (!ServerInfoData) {
        interaction.reply({
          content: "không tìm thấy server id",
          ephemeral: true,
        });
        return;
      }
      if (action === "on") {
        const logChannel = args.getChannel("Channel".toLocaleLowerCase());

        const updateData: {
          turnOnBotSendMessageToSpamChannel?: boolean;
          LogChannelId?: string;
        } = {
          turnOnBotSendMessageToSpamChannel: true,
        };
        if (logChannel) {
          updateData.LogChannelId = logChannel.id;
        }
        await ServerInfoModel.findOneAndUpdate(
          { ServerId: serverId },
          {
            SpamChannel: updateData,
          }
        );
      } else if (action === "off") {
        await ServerInfoModel.findOneAndUpdate(
          { ServerId: serverId },
          {
            $set: {
              "SpamChannel.turnOnBotSendMessageToSpamChannel": false,
            },
          }
        );
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
