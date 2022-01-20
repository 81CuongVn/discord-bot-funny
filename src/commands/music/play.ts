import {
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { MenuId } from "../../types/MenuId";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
export default {
  name: "play",
  description: "find song for you chose",
  usage: "play",
  aliases: ["p"],
    category:"music",
  run: async (client, message, args) => {
    if (!message.member?.voice.channel) {
      message.reply("bạn đang không ở trong kênh nhạc");
      return;
    }
    const musicName = args.join(" ");
    if (!musicName) {
      message.reply("bạn chưa nhập tên bài hát");
      return;
    }
    const video = await client.disTube?.search(musicName, {
      limit: 10,
      type: "video",
      safeSearch: true,
    });
    if (!video) {
      message.reply("không tìm thấy bài hát");
      return;
    }
    const options: MessageSelectOptionData[] = [];
    video.forEach((track, index) => {
      options.push({
        label: `${track.name.slice(0, 20)} ...`,
        value: track.url,
        description: `thời lượng : ${track.formattedDuration} , số luợt xem : ${track.views}`,
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
        "được làm bởi: ngủ ; người yêu cầu :" + message.author.username
      )
      .setTimestamp();
    return message.channel.send({
      content: `✅ | chọn bài hát bạn muốn`,
      embeds: [embed],
      components: [row],
    });
  },
} as IMessageCommandHandlers;
