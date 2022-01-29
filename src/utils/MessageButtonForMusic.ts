import {
  ButtonInteraction,
  CacheType,
  MessageActionRow,
  MessageButton,
  SelectMenuInteraction,
} from "discord.js";
import { Queue, RepeatMode } from "distube";
import { ButtonId } from "./../types/ButtonId";

export const getMessageButtonForMusic = (queue: Queue) => {
  const allRow: MessageActionRow[] = [];
  const disabledButton: string[] = [];
  const button = getButton();
  let pair = [],
    pair3 = [];
  if (queue.paused) {
    disabledButton.push(ButtonId.PauseMusic);
  } else {
    disabledButton.push(ButtonId.ResumeMusic);
  }
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
        if (disabledButton.includes(button.customId.split("_")[0])) {
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
  return allRow;
};
export const getButton = () => {
  const buttonTimeOut = new Date(Date.now() + 1000 * 60 * 60);
  return [
    new MessageButton()
      .setCustomId(`${ButtonId.SkipMusic}_${buttonTimeOut.toISOString()}`)
      .setLabel("bỏ qua bài hát")
      .setEmoji("⏭️")
      .setStyle("PRIMARY"),

    new MessageButton()
      .setCustomId(`${ButtonId.PauseMusic}_${buttonTimeOut.toISOString()}`)
      .setLabel("tạm dừng bài hát")
      .setEmoji("⏸")
      .setStyle("PRIMARY"),

    new MessageButton()
      .setCustomId(`${ButtonId.ResumeMusic}_${buttonTimeOut.toISOString()}`)
      .setEmoji("⏯")
      .setLabel("tiếp tục bài hát")
      .setStyle("PRIMARY"),

    new MessageButton()
      .setCustomId(`${ButtonId.StopMusic}_${buttonTimeOut.toISOString()}`)
      .setLabel("dừng phát nhạc")
      .setEmoji("⏹")
      .setStyle("PRIMARY"),

    new MessageButton()
      .setLabel("loop")
      .setCustomId(`${ButtonId.loopMusic}_${buttonTimeOut.toISOString()}`)
      .setEmoji("➡️")
      .setStyle("PRIMARY"),
  ];
};
