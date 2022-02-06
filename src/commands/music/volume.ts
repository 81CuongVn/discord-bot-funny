import { MessageEmbed } from "discord.js";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";

export default {
  name: "volume",
  description: "set volume chỉ hoạt động khi phòng chỉ có bot với bạn",
  category: "music",
  aliases: ["volume"],
  usage: "volume <number>",
  run: async (client, message, args) => {
    if (!message.guild) return;
    const queue = client.disTube?.getQueue(message.guild);
    if (!queue) {
      message.channel.send("Không có nhạc nào đang phát");
      return;
    }
    const channel = message.member?.voice.channel;
    if (!channel) {
      message.channel.send("Bạn phải ở trong voice channel");
      return;
    }
    if (channel.id !== queue.voice.channel.id) {
      message.channel.send("Bạn phải ở trong voice channel");
      return;
    }
    const volume = parseInt(args[0]);
    if (isNaN(volume)) {
      message.channel.send("Bạn phải nhập số");
      return;
    }
    if (volume < 0) {
      message.channel.send("Bạn phải nhập số từ 0 đến 100");
      return;
    }
    // check number user in voice channel
      const members = channel.members; // filter bot
    if (members.size == 2) {
      queue.setVolume(volume);
      message.channel.send(`Đã thay đổi volume thành ${volume}`);
    } else if (members.size > 2) {
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(
          "cách đều chỉnh âm lượng cho bot thủ công"
        )
        .setDescription(
          "click chuột phải vào bot rồi tại phần âm lượng người dùng chỉnh về mức vừa đủ đối với bạn"
        );
        message.channel.send({ content : "tránh ảnh hưởng đến người khác có thể điều chỉnh thủ công" , embeds: [embed] });
    }
  },
} as IMessageCommandHandlers;
