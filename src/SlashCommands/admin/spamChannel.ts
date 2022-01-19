import { Constants } from "discord.js";
import { SpamChannelModel } from "../../model/SpamChannel";
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
  run: async (client, interaction, options) => {
    try {
      if (
        !interaction.guild?.members?.guild.me?.permissions.has(
          "MANAGE_CHANNELS"
        )
      ) {
        interaction.reply({
          content: "Bạn không có quyền thêm vào kênh spam",
          ephemeral: true,
        });
        return;
      }
      const action = options.getSubcommand();

      let server: string | undefined = interaction.guild?.id;
      if (!server) {
        server = interaction.client.user?.id;
      } else {
        server = interaction.guild?.id;
      }
      if (action === "add") {
        const channel = options.getChannel("channel");
        if (!channel) {
          interaction.reply({
            content: "Bạn chưa chọn channel",
            ephemeral: true,
          });
          return;
        }
        const spamChannel = await SpamChannelModel.findOne({
          serverId: server,
        });
        if (spamChannel) {
          if (spamChannel.channelId === channel.id) {
            interaction.reply({
              content: "bạn đã thêm spam channel này rồi ",
              ephemeral: true,
            });
            return;
          }
          await SpamChannelModel.findOneAndUpdate(
            { serverId: server },
            { channelId: channel.id }
          );
          interaction.reply({
            content:
              "Bạn đã có channel spam rồi nên bot chỉ sửa lại thông tin của channel spam",
            ephemeral: true,
          });
          return;
        }
        const newSpamChannelInfo = new SpamChannelModel({
          serverId: server,
          channelId: channel.id,
        });
        newSpamChannelInfo.save();
        interaction.reply({
          content: "thêm thông tin channel spam thành công",
          ephemeral: true,
        });
      } else if (action === "remove") {
        const spamChannel = await SpamChannelModel.findOne({
          serverId: server,
        });
        if (!spamChannel) {
          interaction.reply({
            content: "không có channel spam nào",
            ephemeral: true,
          });
          return;
        }
        await SpamChannelModel.findOneAndDelete({ serverId: server });
        interaction.reply({
          content: "xóa thông tin channel spam thành công",
          ephemeral: true,
        });
      }
    } catch (e) {
      console.log(e);
      interaction.reply({
        content: "server have some error try again later",
        ephemeral: true,
      });
    }
  },
};
export default spamChannelHandler;
