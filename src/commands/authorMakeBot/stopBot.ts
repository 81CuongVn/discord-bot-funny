import { BotInfoModel } from "../../model/BotInfo";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
export default {
  name: "stopBot".toLocaleLowerCase(),
  category: "authorMakeBot",
  aliases: [],
  permission: [],
  run: async (client, message, args) => {
    const botInfo = await BotInfoModel.findOne({});
    if (
      message.author.id !== client.UserCreatBotId ||
      message.author.id !== botInfo?.owner
    ) {
      message.channel.send("Bạn không có quyền sử dụng lệnh này");
      return;
    }
    let botDown = false;
    if (args[0] === "down") {
      botDown = true;
    }
    if (!args[1]) {
      message.channel.send("Bạn chưa nhập lý do bot down kìa ");
      return;
    }
    const reason = args.slice(1).join(" ");
    BotInfoModel.findOneAndUpdate(
      {},
      {
        historyBotUpAndDown: [
          ...botInfo.historyBotUpAndDown,
          {
            up: !botDown,
            down: botDown,
            date: new Date(),
            reason,
          },
        ],
      }
    );
    message.react("✅");
  },
} as IMessageCommandHandlers;
