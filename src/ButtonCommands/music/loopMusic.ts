import { checkSameRoom, getVoiceChannel } from "../../utils/checkSameRoom";
import {
  getButton,
  getMessageButtonForMusic,
} from "../../utils/MessageButtonForMusic";
import { IButtonCommandHandlers } from "../../types/buttonCommands";
import { ButtonId } from "../../types/ButtonId";
import { MessageActionRow } from "discord.js";
import { QueueRepeatMode } from "discord-player";
import { RepeatMode } from "distube";

export default {
  name: ButtonId.loopMusic,
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
    const row = getMessageButtonForMusic(queue);
    queue.setRepeatMode(
      queue.repeatMode === RepeatMode.QUEUE
        ? RepeatMode.DISABLED
        : RepeatMode.QUEUE
    );
    interaction.update({
      content: "Bot đã bật chế độ loop",
      components: row,
    });
    return;
  },
  category: "music",
} as IButtonCommandHandlers;
