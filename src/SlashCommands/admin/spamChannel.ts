import { Constants } from "discord.js";
import { ServerInfoModel } from "../../model/ServerInfo";
import { ISlashCommandHandlers } from "../../types/slashCommand";
const spamChannelHandler: ISlashCommandHandlers = {
  name: "spamChannel".toLocaleLowerCase(),
  description: "do something with spamChannel",
  usage: "spamChannel",
  aliases: ["sc"],
  options: [
    {
      name: "action",
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
      description: "action want to do with the spam channel",
      options: [
        {
          name: "add",
          type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
          description: "add spam channel info",
          options: [
            {
              name: "channel",
              type: Constants.ApplicationCommandOptionTypes.CHANNEL,
              description: "channel want to make the spam channel",
              required: true,
            },
          ],
        },
        {
          name: "remove",
          type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
          description: "remove spam channel info",
          options: [],
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
      const ServerId = interaction.guild?.id;
      if (!ServerId) {
        interaction.reply({
          content: "không tìm thấy server id",
          ephemeral: true,
        });
        return;
      }
      const ServerInfoData =
        (await ServerInfoModel.findOne({ ServerId })) ||
        (await new ServerInfoModel({
          ServerId,
        }).save());
      if (action === "add") {
        const channel = args.getChannel("channel");
        if (!channel) {
          interaction.reply({
            content: "không tìm thấy channel",
            ephemeral: true,
          });
          return;
        }
        if (ServerInfoData) {
          if (ServerInfoData.SpamChannel?.ChannelId === channel.id) {
            interaction.reply({
              content: "server đã có SpamChannel",
              ephemeral: true,
            });
            return;
          }
          await ServerInfoModel.findOneAndUpdate(
            { ServerId },
            {
              SpamChannel: {
                ChannelId: channel.id,
                LogChannelId: channel.id,
              },
            }
          );
          interaction.reply({
            content: "SpamChannel đã được thêm",
            ephemeral: true,
          });
          return;
        }
        const newServerInfo = new ServerInfoModel({
          ServerId,
          SpamChannel: {
            ChannelId: channel.id,
          },
        });
        newServerInfo.save();
        interaction.reply({
          content: "SpamChannel đã được thêm",
          ephemeral: true,
        });
        return;
      } else if (action === "remove") {
        if (ServerInfoData) {
          ServerInfoData.SpamChannel = null;
          ServerInfoData.save();
          interaction.reply({
            content: "SpamChannel đã được xóa",
            ephemeral: true,
          });
          return;
        }
        interaction.reply({
          content: "server chưa có SpamChannel",
          ephemeral: true,
        });
        return;
      }
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "server have some error try again later",
      });
    }
  },
};
export default spamChannelHandler;
