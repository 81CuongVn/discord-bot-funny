import { GuildTextBasedChannel, Interaction, MessageEmbed } from "discord.js";
import { getMessageButtonForMusic } from "../../utils/MessageButtonForMusic";
import { getVoiceChannel } from "../../utils/checkSameRoom";
import { IClient } from "./../../types/index";
import { MenuId } from "./../../types/MenuId";
import { checkSameRoom } from "./../../utils/checkSameRoom";
import { ButtonId } from "./../../types/ButtonId";
import { IButtonCommandHandlers } from "./../../types/buttonCommands";
import { ISlashCommandHandlers } from "src/types/slashCommand";
import { SearchResult } from "distube";
import { BotInfoModel } from "src/model/BotInfo";

const interactionCreate = async (interaction: Interaction, client: IClient) => {
  try {
    const botInfo = await BotInfoModel.findOne({});
    if (botInfo) {
      let historyBotUpAndDown = botInfo.historyBotUpAndDown;
      if (historyBotUpAndDown) {
        const lastHistory = historyBotUpAndDown[historyBotUpAndDown.length - 1];
        if (lastHistory) {
          if (lastHistory.down) {
            if (interaction.isButton() || interaction.isSelectMenu()) {
              interaction.update({
                content: `rất xin lỗi nhưng bot đang down vì lý do ${lastHistory.reason}`,
                embeds: [],
                components: []
              });
            }
            if (interaction.isCommand()) {
              interaction.reply({
                content: `rất xin lỗi nhưng bot đang down vì lý do ${lastHistory.reason}`,
                embeds: [],
                components: [],
              });
            }
            return;
          }
        }
      }
    }
    if (interaction.isCommand()) {
      let cmd: string | undefined | ISlashCommandHandlers =
        client.slashCommand?.get(interaction.commandName);
      if (!cmd || cmd == undefined) {
        interaction.reply({ content: "Không tìm thấy lệnh này" });
        return;
      }
      console.log(cmd);
      cmd = require(cmd).default;
      if (!cmd || typeof cmd === "string") {
        interaction.reply({ content: "Không tìm thấy lệnh này" });
        return;
      }
      cmd.run(client, interaction, interaction.options);
    }
    if (interaction.isButton()) {
      const data = interaction.customId.split("_");
      let cmd: string | undefined | IButtonCommandHandlers =
        client.slashCommand?.get(data[0]);
      if (!cmd || cmd == undefined) {
        interaction.update({ content: "Không tìm thấy lệnh này" });
        return;
      }
      cmd = require(cmd).default;
      if (!cmd || typeof cmd === "string") {
        interaction.update({ content: "Không tìm thấy lệnh này" });
        return;
      }
      console.log(
        new Date(data[1].trim()).getMilliseconds() >=
          new Date().getMilliseconds(),
        data,
        new Date().toISOString()
      );
      if (cmd.category === "music") {
        const date = new Date();
        if (data[1]) {
          if (
            new Date(data[1].trim()).getMilliseconds() >=
            new Date().getMilliseconds()
          ) {
            interaction.update({
              content: `nút này đã hết hạn hãy sử dụng ${client.prefix}nowplaying để tạo nút mới`,
              embeds: [],
              components: [],
            });
            return;
          }
        }
      }
      cmd.run(client, interaction, []);
    }
    if (interaction.isSelectMenu()) {
    }
  } catch (e) {
    console.log(e);
    if (interaction.isCommand() || interaction.isButton()) {
      if (interaction.replied) {
        interaction.editReply({
          content:
            "bot có một chút lỗi vui lòng thử lại sau lại sau nếu vẫn còn lỗi thì liên hệ với ngủ",
        });
      } else {
        interaction.reply({
          content:
            "bot có một chút lỗi vui lòng thử lại sau lại sau nếu vẫn còn lỗi thì liên hệ với ngủ",
        });
      }
    }
  }
};
export default interactionCreate;
