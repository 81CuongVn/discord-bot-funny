import { MessageActionRow, MessageButton } from "discord.js";
import { ButtonId } from "./../types/ButtonId";

export const getMessageButtonForMusic = () => {
  const row = new MessageActionRow();
  row.addComponents(
    new MessageButton()
      .setCustomId(ButtonId.SkipMusic)
      .setLabel("bỏ qua bài hát")
      .setEmoji("⏭️")
      .setStyle("PRIMARY")
  );
  row.addComponents(
    new MessageButton()
      .setCustomId(ButtonId.PauseMusic)
      .setLabel("tạm dừng bài hát")
      .setEmoji("⏸")
      .setStyle("PRIMARY")
  );
  row.addComponents(
    new MessageButton()
      .setCustomId(ButtonId.ResumeMusic)
      .setEmoji("⏯")
      .setLabel("tiếp tục bài hát")
      .setStyle("PRIMARY")
  );
  row.addComponents(
    new MessageButton()
      .setCustomId(ButtonId.StopMusic)
      .setLabel("dừng phát nhạc")
      .setEmoji("⏹")
      .setStyle("PRIMARY")
  );
  //   row.addComponents(
  //     new MessageButton()
  //       .setLabel("lặp lại bài hát hiện tại (thuộc lệnh lặp lại)")
  //       .setCustomId(ButtonId.TurnOnRepeatMusic)
  //       .setEmoji("⏯")
  //   );
  //   row.addComponents(
  //     new MessageButton()
  //       .setLabel("tắt lệnh lặp lại")
  //       .setEmoji("⏹")
  //       .setCustomId(ButtonId.TurnOffRepeatMusic)
  //   );

  return row;
};
