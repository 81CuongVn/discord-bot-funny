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
        const queue = client.player?.getQueue(interaction.guild);
        const track = (
          await client.player?.search(interaction.values[0], {
            requestedBy: interaction.user,
          })
        )?.tracks[0];
        if (!track) {
          interaction.update({
            content: "Không tìm thấy bài hát",
          });
          return;
        }
        if (!queue) {
          interaction.update({
            content: "Bot chưa được thêm vào queue",
          });
          return;
        }
        queue.play(track);
        const row = getMessageButtonForMusic(
          [ButtonId.ResumeMusic],
          interaction
        );
        let timeQueue = 0;
        queue.tracks.map((track) => {
          timeQueue = timeQueue + track.durationMS;
        });
        timeQueue = timeQueue + track.durationMS;

        const embed = new MessageEmbed()
          .setTitle(track.title)
          .setURL(track.url)
          .setDescription(
            track.description ||
              `đang chơi nhạc : ${track.title} của : ${track.author} , được yêu cẩu bởi ${track.requestedBy.username} , với thời lượng là ${track.duration} với tổng thời gian là ${track.durationMS}ms tổng thời gian của cả danh sách phát mà bot phát là ${timeQueue}ms`
          )
          .setThumbnail(track.thumbnail)
          .setFooter(
            `bot được làm ra bởi ngủ , được yêu cầu bởi ${track.requestedBy.username}`
          )
          .setTimestamp()
          .setImage(track.thumbnail);

        interaction.update({
          content: `Đang chạy bài hát: ${track.title}`,
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
