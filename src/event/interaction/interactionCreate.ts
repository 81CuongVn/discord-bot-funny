import {
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { getMessageButtonForMusic } from "../../utils/MessageButtonForMusic";
import { getVoiceChannel } from "../../utils/checkSameRoom";
import { IClient } from "./../../types/index";
import { MenuId } from "./../../types/MenuId";
import { checkSameRoom } from "./../../utils/checkSameRoom";
import { ButtonId } from "./../../types/ButtonId";
import { IButtonCommandHandlers } from "./../../types/buttonCommands";
import { ISlashCommandHandlers } from "src/types/slashCommand";
import { SearchResult } from "distube";

const interactionCreate = async (interaction: Interaction, client: IClient) => {
  try {
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
      let cmd: string | undefined | IButtonCommandHandlers =
        client.buttonCommand?.get(interaction.customId);
      if (!cmd || cmd == undefined) {
        interaction.update({ content: "Không tìm thấy lệnh này" });
        return;
      }
      cmd = require(cmd).default;
      if (!cmd || typeof cmd === "string") {
        interaction.update({ content: "Không tìm thấy lệnh này" });
        return;
      }
      cmd.run(client, interaction, []);
    }
    if (interaction.isSelectMenu()) {
      if (interaction.customId === MenuId.playSongMenu) {
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
        const urlVideo = interaction.values[0];
        let track: SearchResult[] | undefined | SearchResult =
          await client.disTube?.search(urlVideo, {
            limit: 1,
            type: "video",
            safeSearch: true,
          });

        if (!track) {
          interaction.update({
            content: "Không tìm thấy bài hát",
          });
          return;
        }
        track = track[0];
        const row = getMessageButtonForMusic(
          [ButtonId.ResumeMusic],
          interaction
        );

        const embed = new MessageEmbed()
          .setTitle(track.name)
          .setURL(track.url)
          .setDescription(
            `đang chơi nhạc : ${track.name} của : ${track.source} , được yêu cẩu bởi ${interaction.user.username} , với thời lượng là ${track.formattedDuration} với tổng thời gian là ${track.duration}ms`
          )
          .setFooter(
            `bot được làm ra bởi ngủ , được yêu cầu bởi ${interaction.user.username}`
          )
          .setTimestamp();
        if (track.thumbnail) {
          embed.setThumbnail(track.thumbnail);
          embed.setImage(track.thumbnail);
        }
        client.disTube?.play(voiceChannel, track.url);
        interaction.update({
          content: `Đang chạy bài hát: ${track.name}`,
          components: row,
          embeds: [embed],
        });
        return;
      }
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
