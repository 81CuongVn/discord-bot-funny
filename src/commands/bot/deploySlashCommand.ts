
import { IMessageCommandHandlers } from './../../types/MessageCommand';
export default { 
    name: "deploy",
    description: "deploy slash command",
    category: "bot",
    aliases: ["deploy"],
    usage: "deploy",
    run: async (client, message, args) => {
        try {
            if (!message.member?.permissions.has("MANAGE_MESSAGES")) {
                message.reply("Bạn không có quyền admin");
                return;
            }
            if (!message.guild) {
                message.reply("bot chỉ dùng trong server");
                return;
            }
            const guildId = message.guild.id;
            if (!guildId) return;
            if (guildId) {
              if (client.slashCommandObject) {
                await client.guilds.cache
                  .get(guildId)
                  ?.commands.set(client.slashCommandObject);
              }
            }
            message.reply("bot đã deploy thành công");
            message.react("✅");
        } catch (error) {
            console.log(error);
            message.channel.send(`bot xảy ra lỗi vui lòng thử lại sau`);
        }
    }


} as IMessageCommandHandlers