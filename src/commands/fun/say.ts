import { Client, Message } from "discord.js";
import { IMessageCommandHandlers } from "../../types/MessageCommand";
import { getAudioUrl } from "google-tts-api";

const sayController: IMessageCommandHandlers = {
  name: "say",
  category: "fun",
  aliases: ["s", "speak"],
  description: "Đọc nội dung bạn muốn",
  usage: "say <nội dung>",
  permission: [],
  run: async (client: Client<boolean>, message: Message, args: string[]) => {
    try {
      if (!args[0]) {
        message.channel.send("xin hãy nhập gì đó đẻ bot nói");
        return;
      }
      const stringTalk = args.join(" ");
      if (stringTalk.length > 200) {
        message.channel.send("bot chỉ đọc được dưới 200 kí tự");
        return;
      }
      const voiceChannel = message.member?.voice;
      if (!voiceChannel) {
        message.channel.send("bot cần phải đứng trong voice channel");
        return;
      }
      if (!voiceChannel.channelId) {
        message.channel.send("bạn phải vào room voice để sử dụng lệnh này");
        return;
      }

      const audioUrl = getAudioUrl(stringTalk, {
        lang: "vi",
        slow: false,
        host: "https://translate.google.com",
      });
     
    } catch (error) {
      console.log(error);
      message.channel.send("server have some error try again later");
    }
  },
};
export default sayController;
