import { MessageEmbed } from "discord.js";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
import { ButtonId } from "./../../types/ButtonId";
import { getMessageButtonForMusic } from "./../../utils/MessageButtonForMusic";
import { RepeatMode } from "distube";
export default {
  name: "nowPlaying".toLocaleLowerCase(),
  description: "get song now playing",
  category: "music",
  aliases: ["nowPlaying"],
  usage: "nowPlaying",
  run: async (client, message, args) => {
    try {
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
      const song = queue.songs[0];
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(song.name || "")
        .setURL(song.url)
        .setDescription(
          `đang phát bài hát: ${song.name} với thời lượng là ${song.formattedDuration}`
        )
        .setFooter(
          `bot được phát triển bởi:<@${client.UserCreatBotId}> cảm ơn vì đã sử dụng`
        )
        .setTimestamp();
      const row = getMessageButtonForMusic(queue);
      message.channel
        .send({
          embeds: [embed],
          components: row,
        })
        .then(async (msg) => {

          const metadata: any = queue?.songs[0]?.metadata;
          if (metadata) {
            const lastMessage = await msg.channel.messages.fetch(
            metadata.messageId
              );
              if (lastMessage) {
                  if (lastMessage.deletable){
                      lastMessage.delete();
                  }
              }
            metadata.messageId = msg.id;
          }
        });

      return;
    } catch (error) {
      console.log(error);
      message.channel.send(`bot xảy ra lỗi vui lòng thử lại sau`);
    }
  },
} as IMessageCommandHandlers;
