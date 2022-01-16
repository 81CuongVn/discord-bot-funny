import { checkSameRoom, getVoiceChannel } from "../../utils/checkSameRoom";
import { ButtonId } from "../../types/ButtonId";
import { IButtonCommandHandlers } from "../../types/buttonCommands";

export default {
  name: ButtonId.StopMusic,
  run: async (client, interaction, args) => {
    const voiceChannel = getVoiceChannel(interaction, client);
    if (!voiceChannel) {
      interaction.update({
        content: "Bạn phải ở trong voice channel",
      });
      return;
    }
    if (!(await checkSameRoom(interaction, voiceChannel))) {
      interaction.update({
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

    queue.stop();
    interaction.update({
      content: "Bot đã dừng phát nhạc",
      embeds: [],
      components: [],
    });
    return;
  },
} as IButtonCommandHandlers;
