import { MessageActionRow, MessageButton } from "discord.js";
import { ButtonId } from "./../types/ButtonId";

export enum MessageButtonDisabled {
  None = "none",
  SkipMusic = "skipMusic",
  PauseMusic = "pauseMusic",
  ResumeMusic = "resumeMusic",
  StopMusic = "stopMusic",
  TurnOnRepeatMusic = "turnOnRepeatMusic",
  TurnOffRepeatMusic = "turnOffRepeatMusic",
}

export const getMessageButtonForMusic = (disabled: MessageButtonDisabled[]) => {
  const row = new MessageActionRow();
  row.addComponents(
    new MessageButton()
      .setCustomId(ButtonId.SkipMusic)
      .setLabel("bỏ qua bài hát")
      .setEmoji("⏭️")
      .setStyle("PRIMARY")
      .setDisabled(disabled.includes(MessageButtonDisabled.SkipMusic)),
  );
  row.addComponents(
    new MessageButton()
      .setCustomId(ButtonId.PauseMusic)
      .setLabel("tạm dừng bài hát")
      .setEmoji("⏸")
      .setStyle("PRIMARY").setDisabled(disabled.includes(MessageButtonDisabled.PauseMusic)),
  );
  row.addComponents(
    new MessageButton()
      .setCustomId(ButtonId.ResumeMusic)
      .setEmoji("⏯")
      .setLabel("tiếp tục bài hát")
      .setStyle("PRIMARY").setDisabled(disabled.includes(MessageButtonDisabled.ResumeMusic)),
  );
  row.addComponents(
    new MessageButton()
      .setCustomId(ButtonId.StopMusic)
      .setLabel("dừng phát nhạc")
      .setEmoji("⏹")
      .setStyle("PRIMARY").setDisabled(disabled.includes(MessageButtonDisabled.StopMusic)),
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
