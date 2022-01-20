import { ButtonId } from "../../types/ButtonId";
import { IButtonCommandHandlers } from "../../types/buttonCommands";
import { checkSameRoom, getVoiceChannel } from "../../utils/checkSameRoom";
import { getMessageButtonForMusic } from "../../utils/MessageButtonForMusic";

export default {
  name: ButtonId.ResumeMusic,
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
    const queue = client.disTube?.getQueue(interaction.guild);
    if (!queue) {
      interaction.update({
        content: "bot could not join your voice channel!",
      });
      return;
    }
    if (!queue?.voice || !queue?.voice.connection || !queue.voiceChannel) {
      interaction.update({
        content: "bot could not join your voice channel!",
      });
      return;
    }
    queue.resume();
    const row = getMessageButtonForMusic([ButtonId.ResumeMusic], interaction);
    interaction.update({
      content: "Bot đã tiếp tục",
      components: row,
    });
    return;
  },
} as IButtonCommandHandlers;
