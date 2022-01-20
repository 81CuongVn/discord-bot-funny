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
    const disableButton: string[] = [];
    interaction.message.components?.map((component) => {
      component.components?.map((button) => {
        if (button.type === "BUTTON" && button.disabled === true) {
          if (button.customId) disableButton.push(button.customId);
        }
      });
    });
    const allRow: MessageActionRow[] = [];
    const button = getButton();
    let pair = [],
      pair3 = [];

    for (let i = 0; i <= button.length; i++) {
      pair3.push(button[i]);
      if ((i + 1) % 5 == 0) {
        pair.push(pair3);
        pair3 = [];
      }
    }
    pair.map((rows, index) => {
      const row = new MessageActionRow();
      rows.map((button, index) => {
        if (button.customId) {
          if (disableButton.includes(button.customId)) {
            button.setDisabled(true);
          }
          if (button.customId === ButtonId.loopMusic) {
            button.setLabel(
              queue.repeatMode === RepeatMode.QUEUE ? "loop" : "bỏ loop"
            );
            button.setEmoji(queue.repeatMode === RepeatMode.QUEUE ? "➡️" : "⏹");
            button.setStyle("PRIMARY");
            button.setDisabled(false);
          }
          row.addComponents(button);
        }
      });
      allRow.push(row);
    });
    queue.setRepeatMode(
      queue.repeatMode === RepeatMode.QUEUE
        ? RepeatMode.DISABLED
        : RepeatMode.QUEUE
    );
    interaction.update({
      content: "Bot đã bật chế độ loop",
      components: allRow,
    });
    return;
  },
} as IButtonCommandHandlers;
