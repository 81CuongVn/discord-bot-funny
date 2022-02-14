import {
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { MenuId } from "../../types/MenuId";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
function isValidURL(string: string) {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
}
export default {
  name: "play",
  description: "find song for you chose",
  usage: "play",
  aliases: ["p"],
  category: "music",
  permission: [],
  run: async (client, message, args) => {
    if (!message.member?.voice.channel) {
      message.reply("bạn đang không ở trong kênh nhạc");
      return;
    }
    // if bot in another voice channel
    if (message.guild?.me?.voice.channel) {
      if (
        message.guild?.me?.voice.channel.id !== message.member?.voice.channel.id
      ) {
        message.reply("bot đang ở trong kênh khác");
        return;
      }
    }

    const musicName = args.join(" ");
    if (!musicName) {
      message.reply("bạn chưa nhập tên bài hát");
      return;
    }
    if (isValidURL(musicName)) {
      if (!message.member?.voice.channel) {
        message.reply("bạn đang không ở trong kênh nhạc");
        return;
      }
      if (message.channel.type !== "GUILD_TEXT") {
        message.reply("bạn phải ở trong kênh nhạc của mình");
        return;
      }
      client.disTube?.play(message.member?.voice.channel, musicName, {
        textChannel: message.channel,
        metadata: {
          channel: message.member?.voice.channel,
          textChannelId: message.channel.id,
          user: message.author.id,
        },
      });
      client.disTube
        ?.getQueue(message.member?.voice.channel.id)
        ?.setVolume(100);
      return;
    }

    const video = await client.disTube?.search(musicName, {
      limit: 6,
      type: "video",
      safeSearch: true,
    });
    if (!video) {
      message.reply("không tìm thấy bài hát");
      return;
    }
    let description = ``;
    video.forEach((track, index) => {
      description += `${index}. ${track.name} thời lượng là ${
        track.formattedDuration
      } ${track.views ? `tổng lược xem ${track.views}` : ""} \n`;
    });

    const embed = new MessageEmbed()
      .setTitle("🎵 Chọn bài hát bạn muốn lưu ý")
      .setDescription(description)
      .setColor("#00ff00")
      .setFooter(
        "được làm bởi: ngủ ; người yêu cầu :" + message.author.username
      )
      .setTimestamp();
    const botMessage = await message.channel.send({
      embeds: [embed],
    });
    const collect = message.channel.createMessageCollector({
      filter: (m) => m.author.id === message.author.id,
      max: 1,
    });
    let wasChoose = false;
    collect.on("collect", async (m) => {
      if (wasChoose) {
        if (botMessage.deletable) botMessage.delete();
        return;
      }
      if (m.content === "cancel") {
        m.channel.send("bạn đã hủy yêu cầu");
        return;
      }
      const index = parseInt(m.content);
      if (isNaN(index) || index < 0 || index >= video.length) {
        m.channel.send("bạn chọn sai bài hát");
        return;
      }
      const track = video[index];
      if (!m.member?.voice.channel) {
        m.reply("bạn đang không ở trong kênh nhạc");
        return;
      }
      if (m.channel.type !== "GUILD_TEXT") {
        m.reply("bạn phải ở trong kênh nhạc của mình");
        return;
      }
      client.disTube?.play(m.member?.voice.channel, track.url, {
        textChannel: m.channel,
        metadata: {
          channel: m.member?.voice.channel,
          textChannelId: m.channel.id,
          user: m.author.id,
        },
      });
      client.disTube?.getQueue(m.member?.voice.channel.id)?.setVolume(100);
      wasChoose = true;
      if (botMessage.deletable) botMessage.delete();
      collect.emit("end");
    });
  },
} as IMessageCommandHandlers;
