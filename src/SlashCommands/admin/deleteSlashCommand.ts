import { ISlashCommandHandlers } from "src/types/slashCommand";

const deleteCommandBotCreateHandler: ISlashCommandHandlers = {
  name: "deleteCommandBotCreate".toLocaleLowerCase(),
  description: "delete Command Bot Create bot",
  usage: "deleteCommandBotCreate",
  aliases: ["p"],
  run: async (client, interaction, args) => {
    try {
      // check user has permission
      if (
        !interaction.guild?.members?.guild.me?.permissions.has(
          "MANAGE_CHANNELS"
        )
      ) {
        interaction.reply({
          content: "Bạn không có quyền thêm xoá bot command",
          ephemeral: true,
        });
        return;
      }
      // get server id
      const serverId = interaction.guild?.id;
      if (serverId) {
        if (client.slashCommandObject) {
          await client.guilds.cache.get(serverId)?.commands.set([]);
        }
      }
      await interaction.reply({
        content:
          "Xoá bot command thành công muốn thêm lại thì chỉ cần nhắn một tin nhắn thôi",
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "server have some error try again later",
        ephemeral: true,
      });
    }
  },
};
export default deleteCommandBotCreateHandler;
