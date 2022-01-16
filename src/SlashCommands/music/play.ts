import { ISlashCommandHandlers } from "../../types/slashCommand";
import {
  Constants,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { getVoiceChannel } from "../../utils/checkSameRoom";
import { checkSameRoom } from "./../../utils/checkSameRoom";
import { MenuId } from "./../../types/MenuId";
export default {
  name: "play".toLocaleLowerCase(),
  description: "find song for you chose",
  usage: "play",
  aliases: ["p"],
  options: [
    {
      name: "song",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      description: "song name",
    },
  ],
  run: async (client, interaction, args) => {
    try {
      const voiceChannel = getVoiceChannel(interaction, client);
      if (!voiceChannel) {
        return interaction.reply({
          content: "you are not in voice channel",
        });
      }
      if (!(await checkSameRoom(interaction, voiceChannel))) {
        return interaction.reply({
          content: "you are not in voice channel",
        });
      }
      const song = interaction.options.getString("song");
      if (!song) {
        return interaction.reply({
          content: "you must enter song name",
        });
      }
      if (!interaction.guild) {
        return interaction.reply({
          content: "bot can't play music in DM",
        });
      }
      const queue = client.player?.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel,
        },
      });
      await interaction.deferReply();
      // verify vc connection
      try {
        if (!queue?.connection) await queue?.connect(voiceChannel.id);
      } catch {
        queue?.destroy();
        return await interaction.reply({
          content: "Could not join your voice channel!",
          ephemeral: true,
        });
      }
      if (!queue) {
        return await interaction.reply({
          content: "bot could not join your voice channel!",
          ephemeral: true,
        });
      }
      const track = (
        await client.player?.search(song, {
          requestedBy: interaction.user,
        })
      )?.tracks.slice(0, 10);
      if (!track) {
        return interaction.editReply({
          content: `❌ | Track **${song}** not found!`,
        });
      }
      const options: MessageSelectOptionData[] = [];
      track.forEach((track, index) => {
        options.push({
          label: `${track.title.slice(0, 20)} ...`,
          value: track.url,
          description: `${track.duration}`,
        });
      });
      const row = new MessageActionRow();
      row.addComponents(
        new MessageSelectMenu()
          .setCustomId(MenuId.playSongMenu)
          .setPlaceholder("chọn bài hát bạn muốn lưu ý chỉ chọn một lần ")
          .setMaxValues(1)
          .setMinValues(1)
          .setOptions(options)
      );
      const embed = new MessageEmbed()
        .setTitle("🎵 Chọn bài hát bạn muốn lưu ý")
        .setDescription(`chỉ được chọn một lần `)
        .setColor("#00ff00")
        .setFooter(
          "được làm bởi: ngủ ; người yêu cầu :" + interaction.user.username
        )
        .setTimestamp();
      return interaction.editReply({
        content: `✅ | chọn bài hát bạn muốn`,
        components: [row],
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
      return interaction.reply({
        content: "server have some error try again later",
      });
    }
  },
} as ISlashCommandHandlers;
