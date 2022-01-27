import { IMessageCommandHandlers } from "../../types/MessageCommand";
import { Message, MessageEmbed } from "discord.js";
import { stripIndent } from "common-tags";
import { IClient } from "../../types";

const helpController: IMessageCommandHandlers = {
  name: "help",
  category: "user",
  aliases: ["h"],
  description: "hỗ trợ sử dụng lệnh",
  usage: "help [command]",
  permission: [],
  run: async (client: IClient, message: Message, args: string[]) => {
    try {
      if (!args[0]) {
        getAll(client, message, args);
        return;
      } else {
        getCommand(client, message, args[0]);
      }
    } catch (error) {
      console.log(error);
      message.channel.send("server have some error try again later");
    }
  },
};

function getAll(client: IClient, message: Message, args: string[]) {
  const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(
      `xem chi tiết các dùng bằng cách ${client.prefix}help [command]`
    );
  const commands = (categories: string) => {
    return client.commands
      ?.filter((c) => c.category === categories)
      .map((c) => c.name)
      .join(client.prefix);
  };
  let info = client.categories
    ?.map((cat) => {
      return stripIndent`
        **${cat[0].toUpperCase() + cat.slice(1)}**\n
        *${commands(cat)}*
        `;
    })
    .reduce((string, categories) => string + "\n" + categories);
  if (!info) info = "Không tìm thấy lệnh nào cả";

  embed.setDescription(info);

  message.channel.send({
    embeds: [embed],
  });
}

function getCommand(client: IClient, message: Message, args: string) {
  const command = args.toLowerCase() || client.aliases?.get(args.toLowerCase());
  if (!command) {
    message.channel.send(`không tìm thấy lệnh ${client.prefix}${args}`);
    return;
  }
  const cmd = client.commands?.get(command);
  let info = `Không tìm thấy lệnh ${args}`;

  if (!cmd) {
    message.channel.send({
      embeds: [new MessageEmbed().setColor("RED").setDescription(info)],
    });
    return;
  }

  if (cmd.name) info = `**Tên Lệnh** : ${cmd.name}`;
  if (cmd.category) info += `\n**Thể Loại** : ${cmd.category}`;
  if (cmd.aliases) info += `\n**Tên Gọi Khác** : ${cmd.aliases.join(", ")}`;
  if (cmd.description) info += `\n**Mô Tả** : ${cmd.description}`;
  if (cmd.usage)
    info += `\n**Sử Dụng** : ${client.prefix}${cmd.usage} \n **chú ý** : <> là bắt buộc [] là không bắt buộc`;
  message.channel.send({
    embeds: [new MessageEmbed().setColor("RANDOM").setDescription(info)],
  });
}

export default helpController;
