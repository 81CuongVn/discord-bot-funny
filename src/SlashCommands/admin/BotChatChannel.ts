import { ISlashCommandHandlers } from "src/types/slashCommand";
import { Constants } from "discord.js";
import { BotChatChannelModel } from "../../model/BotChatChannelModel";

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
      if (!interaction.guild?.members?.guild.me?.permissions.has("MANAGE_MESSAGES")) {
        interaction.reply({
          content: "bạn không có quyền dùng lệnh này",
          ephemeral: true,
        });
        return;
      }

      const action = args.getSubcommand();
      if (action === "add") {
        const channel = interaction.options.getChannel("channel");
        // get server id
        const serverId = interaction.guild?.id;
        if (!channel) {
          interaction.reply({
            content: "channel not found",
            ephemeral: true,
          });
          return;
        }
        const botChatChannel = await BotChatChannelModel.findOne({
          serverId,
        });
        if (botChatChannel) {
          if (botChatChannel.channelId === channel.id) {
            interaction.reply({
              content: "channel already added",
              ephemeral: true,
            });
            return;
          } else {
            await BotChatChannelModel.findOneAndUpdate(
              { serverId },
              { channelId: channel.id }
            );
            interaction.reply({
              content: "channel changed channel info in bot database",
              ephemeral: true,
            });
            return;
          }
        } else {
          const newBotChatChannel = new BotChatChannelModel({
            serverId,
            channelId: channel.id,
          });
          await newBotChatChannel.save();
          interaction.reply({
            content: "channel added to bot database",
            ephemeral: true,
          });
          return;
        }
      } else if (action === "remove") {
        const serverId = interaction.guild?.id;
        const botChatChannel = await BotChatChannelModel.findOne({
          serverId,
        });
        if (!botChatChannel) {
          interaction.reply({
            content: "channel not found",
            ephemeral: true,
          });
          return;
        }
        await BotChatChannelModel.findOneAndDelete({
          serverId,
        });
        interaction.reply({
          content: "channel removed from bot database",
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
