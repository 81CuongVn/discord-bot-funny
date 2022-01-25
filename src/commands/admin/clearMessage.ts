import { IMessageCommandHandlers } from "./../../types/MessageCommand";
export default {
  name: "clearMessage".toLocaleLowerCase(),
  category: "admin",
  aliases: ["xóa tin nhắn"],
  description: "Xóa tin nhắn",
  usage: "clearMessage <số lượng tin nhắn muốn xoá>",
  permission: ["MANAGE_MESSAGES"],
  run: async (client, message, args) => {
    try {
      if (!args[0]) {
        message.channel.send("Bạn chưa nhập số lượng tin nhắn muốn xoá");
        return;
      }
      const numberMessage = parseInt(args[0]);
      if (isNaN(numberMessage)) {
        message.channel.send("Số lượng tin nhắn phải là số");
        return;
      }
      if (numberMessage <= 0) {
        message.channel.send("Số lượng tin nhắn phải lớn hơn 0");
        return;
      }
      if (numberMessage > 100){
        message.channel.send("số lượng tin nhắn một lần xoá phải bé hơn 100")
        return;
      }
      if (message.channel.type === "DM") {
        message.channel.send("Không thể xoá tin nhắn trong DM");
        return;
      }
      const { size } = await message.channel.bulkDelete(numberMessage);
      message.channel
        .send(`Đã xoá ${size} tin nhắn trong ${message.channel.name}`)
        .then((msg) => {
          msg.react("✅");
          setTimeout(() => {
            msg.delete();
          }, 10000);
        });
    } catch (error) {
      console.log(error);
      message.channel.send(`bot xảy ra lỗi vui lòng thử lại sau`);
    }
  },
} as IMessageCommandHandlers;
