import {
  ButtonInteraction,
  CacheType,
  MessageActionRow,
  MessageButton,
  SelectMenuInteraction,
} from "discord.js";
import { ButtonId } from "./../types/ButtonId";

export const getMessageButtonForMusic = (
  disabled: string[],
  interaction: SelectMenuInteraction<CacheType> | ButtonInteraction<CacheType>
) => {
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
        if (disabled.includes(button.customId)) {
          button.setDisabled(true);
        }
        row.addComponents(button);
      }
    });
    allRow.push(row);
  });
  return allRow;
};
export const getButton = () => {
  return [
    new MessageButton()
      .setCustomId(ButtonId.SkipMusic)
      .setLabel("bỏ qua bài hát")
      .setEmoji("⏭️")
      .setStyle("PRIMARY"),

    new MessageButton()
      .setCustomId(ButtonId.PauseMusic)
      .setLabel("tạm dừng bài hát")
      .setEmoji("⏸")
      .setStyle("PRIMARY"),

    new MessageButton()
      .setCustomId(ButtonId.ResumeMusic)
      .setEmoji("⏯")
      .setLabel("tiếp tục bài hát")
      .setStyle("PRIMARY"),

    new MessageButton()
      .setCustomId(ButtonId.StopMusic)
      .setLabel("dừng phát nhạc")
      .setEmoji("⏹")
      .setStyle("PRIMARY"),

    new MessageButton()
      .setLabel("loop")
      .setCustomId(ButtonId.loopMusic)
      .setEmoji("➡️")
      .setStyle("PRIMARY"),
  ];
};
