import { IMessageCommandHandlers } from "../../types/MessageCommand";
import { Client, Message } from "discord.js";
const dataExportPing: IMessageCommandHandlers = {
  name: "ping",
  category: "user",
  aliases: ["p"],
  description: "ping bot",
  usage: "ping",
  run: async (client: Client<boolean>, message: Message, args: string[]) => {
    try {
      message.channel.send(`Pong! ${client.ws.ping} ms`);
    } catch (error) {
      console.log(error);
      message.channel.send("server have some error try again later");
    }
  },
};
export default dataExportPing;
