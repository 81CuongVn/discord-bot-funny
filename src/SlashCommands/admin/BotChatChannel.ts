import { ISlashCommandHandlers } from "../../types/slashCommand";
import { Constants } from "discord.js";
import { ServerInfoModel } from "../../model/ServerInfo";

const BotChatChannelHandler: ISlashCommandHandlers = {
  name: "BotChatChannel".toLocaleLowerCase(),
  description: "Bot Chat Channel bot",
  usage: "BotChatChannel",
  aliases: ["p"],
  options: [
    {
      name: "action",
      description: "action you want to do",
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
      options: [
        {
          name: "add",
          description: "add bot chat channel",
          type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
          options: [
            {
              name: "channel",
              description: "channel you want to add",
              type: Constants.ApplicationCommandOptionTypes.CHANNEL,
              required: true,
            },
          ],
        },
        {
          name: "remove",
          description: "remove bot chat channel",
          type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
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
          if (ServerInfoData.BotChatChannel?.ChannelId === channel.id) {
            interaction.reply({
              content: "server đã có BotChatChannel",
              ephemeral: true,
            });
            return;
          }
          await ServerInfoModel.findOneAndUpdate(
            { ServerId },
            {
              BotChatChannel: {
                ChannelId: channel.id,
              },
            }
          );
          interaction.reply({
            content: "BotChatChannel đã được thêm",
            ephemeral: true,
          });
          return;
        }
        const newServerInfo = new ServerInfoModel({
          ServerId,
          BotChatChannel: {
            ChannelId: channel.id,
          },
        });
        newServerInfo.save();
        interaction.reply({
          content: "BotChatChannel đã được thêm",
          ephemeral: true,
        });
        return;
      } else if (action === "remove") {
        if (ServerInfoData) {
          ServerInfoData.BotChatChannel = null;
          ServerInfoData.save();
          interaction.reply({
            content: "BotChatChannel đã được xóa",
            ephemeral: true,
          });
          return;
        }
        interaction.reply({
          content: "server chưa có BotChatChannel",
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
export default BotChatChannelHandler;
