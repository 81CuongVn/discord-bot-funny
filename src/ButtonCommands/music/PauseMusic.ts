import { checkSameRoom, getVoiceChannel } from "../../utils/checkSameRoom";
import { IButtonCommandHandlers } from "../../types/buttonCommands";
import { ButtonId } from "../../types/ButtonId";
export default {
  name: ButtonId.PauseMusic,
  run: async (client, interaction, args) => {
    const voiceChannel = getVoiceChannel(interaction, client);
    if (!voiceChannel) {
      interaction.update({
        content: "Bạn phải ở trong voice channel",
      });
      return;
    }
    if (!(await checkSameRoom(interaction, voiceChannel))) {
      interaction.editReply({
        content: "Bạn phải ở trong voice channel",
      });
      return;
    }
    if (!interaction.guild) {
      interaction.update({
        content: "Bot chỉ dùng trong server",
      });
      return;
    }
    const queue = client.player?.getQueue(interaction.guild);
    if (!queue) {
      interaction.update({
        content: "bot could not join your voice channel!",
      });
      return;
    }
    if (!queue.connection) {
      interaction.update({
        content: "bot could not join your voice channel!",
      });
      return;
    }

    queue.setPaused(true);
    interaction.update({
      content: "Bot đã tạm dừng",
    });
    return;
  },
} as IButtonCommandHandlers;
