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
      if (numberMessage < 1) {
        message.channel.send("Số lượng tin nhắn phải lớn hơn 0");
        return;
      }
      if (numberMessage > 100) {
        message.channel.send("Số lượng tin nhắn phải nhỏ hơn 100");
        return;
      }
      const fetched = await message.channel.messages.fetch({
        limit: numberMessage,
      });
        let messageNumber= 0
        fetched.map((msg, index) => {
          messageNumber = messageNumber + 1
        if (msg.deletable) msg.delete();
      });
      let botMessageSend = await message.channel.send(`đang xóa ${messageNumber} tin nhắn`);
      setTimeout(() => {
        botMessageSend.react("✅");
        botMessageSend.edit({content : `đã xóa ${messageNumber} tin nhắn`, embeds: []});
      }, 3000);
    } catch (error) {
      console.log(error);
      message.channel.send(`bot xảy ra lỗi vui lòng thử lại sau`);
    }
  },
} as IMessageCommandHandlers;
