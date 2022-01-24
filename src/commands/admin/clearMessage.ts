import { IMessageCommandHandlers } from "./../../types/MessageCommand";
export default {
  name: "clearMessage".toLocaleLowerCase(),
  category: "admin",
  aliases: ["xóa tin nhắn"],
  description: "Xóa tin nhắn",
  usage: "clearMessage <số lượng tin nhắn muốn xoá>",
  run: async (client, message, args) => {
    try {
      if (!message.member?.permissions.has("MANAGE_MESSAGES")) {
        message.channel.send("Bạn không có quyền sử dụng tính năng này");
        return;
      }
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
