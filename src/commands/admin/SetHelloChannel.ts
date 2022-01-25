import { HelloChannelModel } from "../../model/HelloChannel";
import { IMessageCommandHandlers } from "../../types/MessageCommand";

export default {
  name: "SetHelloOption".toLocaleLowerCase(),
  category: "admin",
  aliases: ["sho"],
  description: "Set channel for bot say hello message",
  usage:
        "SetHelloChannel <method : set or remove> <channel> [role give user went join can use with method set]",
  permission: ["MANAGE_CHANNELS"],
  run: async (client, message, args) => {
    try {
      if (!args[0]) {
        message.channel.send(
          "Bạn chưa điều bạn muốn làm có thể là set hoặc là remove"
        );
        return;
      }
      if (args[0] === "set") {
        if (!args[1]) {
          message.channel.send("Bạn chưa nhập channel");
          return;
        }
        console.log(args);
        const channel =
          message.mentions.channels.first() ||
          message.guild?.channels.cache.find(
            (c) => c.id == args[1].replace(/([0-9])\w+/g, "")
          );
        if (!channel) {
          message.channel.send("Không tìm thấy channel");
          return;
        }
        if (channel.type !== "GUILD_TEXT") {
          message.channel.send("Channel phải là text channel");
          return;
        }
        const guild = client.guilds.cache.find(
          (g) => g.id === message.guild?.id
        );
        if (!guild) {
          message.channel.send("Bot chưa được kết nối với server");
          return;
        }
        const HelloChannel = await HelloChannelModel.findOne({
          serverId: guild.id,
        });
        const role =
          message.mentions.roles.first() ||
          message.guild?.roles.cache.find(
            (r) => r.id == args[2].replace(/([0-9])\w+/g, "")
          );
        if (!HelloChannel) {
          // if have the role we save it to db
          if (role) {
            const newHelloChannel = new HelloChannelModel({
              serverId: guild.id,
              channelId: channel.id,
              roleId: role.id,
            });
            await newHelloChannel.save();
          } else {
            const newHelloChannel = new HelloChannelModel({
              serverId: guild.id,
              channelId: channel.id,
            });
            await newHelloChannel.save();
          }
        } else {
          await HelloChannelModel.findOneAndUpdate(
            {
              serverId: guild.id,
            },
            {
              channelId: channel.id,
              roleId: role?.id,
              isDeleted: false,
            }
          );
        }

        message.channel.send("Đã thiết lập channel").then((msg) => {
          msg.react("✅");
          setTimeout(() => {
            msg.delete();
          }, 10000);
        });
      } else if (args[1] === "remove") {
        const HelloChannel = await HelloChannelModel.findOne({
          serverId: message.guild?.id,
        });
        if (!HelloChannel) {
          message.channel.send("Chưa có channel nào được thiết lập");
          return;
        }
        await HelloChannelModel.findOneAndRemove({
          serverId: message.guild?.id,
        });
        message.channel.send("Đã xóa channel").then((msg) => {
          msg.react("✅");
          setTimeout(() => {
            msg.delete();
          }, 10000);
        });
      }
    } catch (error) {
      console.log(error);
      message.channel.send(`bot xảy ra lỗi vui lòng thử lại sau`);
    }
  },
} as IMessageCommandHandlers;
